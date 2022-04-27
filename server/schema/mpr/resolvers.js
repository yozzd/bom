const fs = require('fs');
const fetch = require('node-fetch');
const { ErrorWithProps } = require('mercurius');
const { GraphQLUpload } = require('graphql-upload');
const { Op } = require('sequelize');
const { pssUrl, pssAuth } = require('../../config');
const {
  WO, WOMODULE, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { whereStatus, whereUser } = require('./methods');
const { itemAttributes } = require('../bom/resolvers');

const resolvers = {
  Upload: GraphQLUpload,
  MPR: {
    attachmentCheck: ({ id, attachment }) => {
      try {
        fs.existsSync(`static/attachment/${id}/${attachment}`);
        return true;
      } catch (err) {
        return false;
      }
    },
  },
  Query: {
    getAllMPR: isAuthenticated(async (_, { status }, ctx) => {
      const where = whereStatus(status);

      const items = await MPRITEM.findAll({
        attributes: ['idMpr'],
        where,
        group: ['idMpr'],
        required: false,
        include: [{
          model: OUTSTANDINGPO,
          attributes: ['poStatus', 'poArrival', 'poNo'],
          required: false,
        }],
        raw: true,
      });

      const whereU = await whereUser(ctx, items, status);
      const mpr = await MPR.findAll({
        attributes: [
          'id', 'status', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'requestorSection',
          'requestorName', 'requestorTimestamp', 'managerApproved',
          'managerTimestamp', 'whApproved', 'whTimestamp', 'bomApproved',
          'bomTimestamp', 'attachment', 'remark', 'packing', 'hold', 'cancel',
        ],
        order: [
          ['category', 'DESC'],
          ['dor', 'DESC'],
        ],
        where: whereU,
        include: [{
          model: WO,
          attributes: ['idLt'],
        }],
      });

      return mpr;
    }),
    getOneMPR: isAuthenticated(async (_, { id }) => {
      const mpr = await MPR.findOne({
        attributes: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'requestorName',
          'packing', 'hold', 'cancel',
        ],
        where: { id },
        required: false,
        include: [{
          model: WO,
          attributes: ['id', 'euro', 'gbp', 'myr', 'idr', 'sgd'],
        }, {
          model: MPRMODULE,
          attributes: ['id', 'moduleChar', 'moduleName'],
          required: false,
          include: [{
            model: MPRITEM,
            attributes: itemAttributes,
            required: false,
            include: [{
              model: WOMODULE,
              attributes: ['id', 'hid', 'header'],
              required: false,
            }],
          }],
        }, {
          model: MPRITEM,
          attributes: itemAttributes,
          where: {
            [Op.and]: [
              { cancel: 0 },
              { idModule: { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: 0 }] } },
            ],
          },
          required: false,
          include: [{
            model: WOMODULE,
            attributes: ['id', 'hid', 'header'],
            required: false,
          }],
        }],
      });

      return mpr;
    }),
    getMprModules: isAuthenticated(async (_, { idMpr }) => {
      const modules = await MPRMODULE.findAll({
        attributes: ['id', 'moduleChar', 'moduleName'],
        where: { idMpr },
      });

      return modules;
    }),
  },
  Mutation: {
    createMpr: isAuthenticated(async (_, { input }, ctx) => {
      const { idLt, ltNo, ...obj } = input;

      const no = ltNo.split(' ').join('+');
      const headers = { Authorization: pssAuth };
      const info = await fetch(`${pssUrl}${no}`, { headers });
      const t = await info.json();
      obj.projectName = t.customer_name || 'PT. LABTECH PENTA INTERNATIONAL';

      const { group, section, fullname } = ctx.req.user;
      obj.requestorId = group;
      obj.requestorSection = section;
      obj.requestorName = fullname;
      obj.requestorTimestamp = Date.now();

      const newMpr = new MPR(obj);
      const save = await newMpr.save();
      save.wo = { idLt };

      return save;
    }),
    updateMpr: isAuthenticated(async (_, { input }) => {
      const { idLt, file, ...obj } = input;

      const mpr = await MPR.findOne({
        attributes: [...Object.keys(obj)],
        where: { id: obj.id },
      });

      Object.assign(mpr, obj);

      if (file) {
        const { filename, createReadStream } = await file;
        const stream = createReadStream();

        const tmp = `/tmp/${filename}`;
        return new Promise((resolve, reject) => {
          stream
            .on('error', (error) => {
              if (stream.truncated) fs.unlinkSync(tmp);
              reject(error);
            })
            .pipe(fs.createWriteStream(tmp))
            .on('finish', () => {
              try {
                const dir = `static/attachment/${obj.id}`;
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                fs.copyFileSync(tmp, `${dir}/${filename}`);

                mpr.attachment = filename;
                resolve();
              } catch (err) {
                if (typeof err === 'string') {
                  reject(new ErrorWithProps(err));
                } else {
                  reject(new ErrorWithProps(err.message));
                }
              }
            });
        });
      }

      const save = await mpr.save();
      save.wo = { idLt };

      return save;
    }),
    deleteMpr: isAuthenticated(async (_, { input }) => {
      await Promise.all(
        input.map(async (v) => {
          await MPR.destroy({
            where: { id: v.id },
          });
        }),
      );

      return input;
    }),
  },
};

module.exports = { resolvers };
