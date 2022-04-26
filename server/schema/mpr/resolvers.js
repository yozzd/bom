const fs = require('fs');
const fetch = require('node-fetch');
const { pssUrl, pssAuth } = require('../../config');
const { Op } = require('sequelize');
const {
  WO, WOMODULE, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { whereStatus, whereUser } = require('./methods');
const { itemAttributes } = require('../bom/resolvers');

const resolvers = {
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
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing', 'requestorSection',
          'requestorName', 'requestorTimestamp', 'managerApproved',
          'managerTimestamp', 'whApproved', 'whTimestamp', 'bomApproved',
          'bomTimestamp', 'attachment', 'remark',
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
          'unit', 'category', 'dor', 'idWo', 'packing', 'requestorName',
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
  },
};

module.exports = { resolvers };
