const fs = require('fs');
const fetch = require('node-fetch');
const { ErrorWithProps } = require('mercurius');
const { GraphQLUpload } = require('graphql-upload');
const { Op } = require('sequelize');
const { pssUrl, pssAuth } = require('../../config');
const {
  WO, WOMODULE, WOITEM, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { whereStatus, whereUser } = require('./methods');
const { itemAttributes } = require('../bom/resolvers');

const mprAttributes = [
  'id', 'status', 'no', 'woNo', 'model', 'product', 'projectName',
  'unit', 'category', 'dor', 'idWo', 'requestorSection',
  'requestorName', 'requestorTimestamp', 'managerApproved',
  'managerTimestamp', 'whApproved', 'whTimestamp', 'bomApproved',
  'bomTimestamp', 'attachment', 'remark', 'packing', 'hold', 'cancel',
];

const attributes = [
  'idMaterial', 'bomDescription', 'bomSpecification', 'bomModel', 'bomBrand',
  'bomQty', 'bomUnit', 'bomQtyRqd', 'bomQtyBalance', 'bomQtyStock', 'bomEta',
  'bomQtyRec', 'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
  'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal', 'materialsProcessed',
  'yetToPurchase', 'bomSupplier', 'bomPoDate', 'bomPoNo', 'bomRemarks', 'priority',
  'bomEtaStatus', 'sr', 'isMpr', 'packing', 'hold', 'cancel', 'idHeader',
  'idModule', 'colorClass',
];

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
        attributes: mprAttributes,
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
      const {
        idLt, file, remAttach, ...obj
      } = input;

      const mpr = await MPR.findOne({
        attributes: mprAttributes,
        where: { id: obj.id },
      });

      Object.assign(mpr, obj);

      const dir = `static/attachment/${obj.id}`;
      if (file) {
        const { filename, createReadStream } = await file;
        const stream = createReadStream();

        const tmp = `/tmp/${filename}`;

        await new Promise((resolve, reject) => {
          stream
            .on('error', (error) => {
              if (stream.truncated) fs.unlinkSync(tmp);
              reject(error);
            })
            .pipe(fs.createWriteStream(tmp))
            .on('finish', () => {
              try {
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

      if (remAttach) {
        fs.unlinkSync(`${dir}/${mpr.attachment}`);
        mpr.attachment = null;
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
    addMprItems: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          let item = {};
          const where = { id: v.id };

          if (v.isMpr) {
            item = await MPRITEM.findOne({
              attributes,
              where,
              raw: true,
            });
          } else {
            item = await WOITEM.findOne({
              attributes,
              where,
              raw: true,
            });
          }

          item.bomQty = 0;
          item.bomQtyRqd = 0;
          item.bomQtyBalance = 0;
          item.bomEta = null;
          item.bomQtyRec = 0;
          item.bomDateRec = null;
          item.bomQtyStock = 0;
          item.bomCurrSizeC = null;
          item.bomCurrSizeV = 0;
          item.bomCurrEaC = null;
          item.bomCurrEaV = 0;
          item.bomUsdEa = 0;
          item.bomUsdUnit = 0;
          item.bomUsdTotal = 0;
          item.bomSupplier = null;
          item.bomPoDate = null;
          item.bomPoNo = null;
          item.bomRemarks = null;
          item.bomEtaStatus = null;
          item.materialsProcessed = 0;
          item.yetToPurchase = 0;
          item.priority = null;
          item.sr = 0;
          item.hold = 0;
          item.cancel = 0;
          item.isMpr = 1;
          item.idMpr = v.idMpr;
          item.idWo = v.idWo;
          item.idHeader = null;
          item.idModule = v.idModule;
          item.colorClass = null;
          item.timestamp = Date.now();

          const newItem = new MPRITEM(item);
          const save = await newItem.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
    addMprModule: isAuthenticated(async (_, { input }) => {
      const newModule = new MPRMODULE(input);
      const save = await newModule.save();
      save.items = [];

      return save;
    }),
    updateMprModule: isAuthenticated(async (_, { input }) => {
      const module = await MPRMODULE.findOne({
          attributes: ['id', 'moduleChar', 'moduleName', 'idMpr'],
          where: { id: input.id },
          include: [{
            model: MPRITEM,
            attributes,
            required: false,
            include: [{
              model: WOMODULE,
              attributes: ['id', 'hid', 'header'],
              required: false,
            }],
          }],
        });

      module.moduleChar = input.moduleChar;
      module.moduleName = input.moduleName;
      const save = await module.save();
      return save;
    }),
    moveToModule: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          const item = await MPRITEM.findOne({
            attributes: itemAttributes,
            where: { id: v.id },
          });

          Object.assign(item, v);
          const save = await item.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
    deleteModule: isAuthenticated(async (_, { id }) => {
      await MPRMODULE.destroy({
        where: { id },
      });

      await MPRITEM.destroy({
        where: { idModule: id },
      });

      return id;
    }),
  },
};

module.exports = { resolvers };
