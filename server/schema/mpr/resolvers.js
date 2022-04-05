const fs = require('fs');
const { Op } = require('sequelize');
const {
  WO, WOMODULE, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { whereStatus, whereUser } = require('./methods');
const { itemAttributes } = require('../bom/resolvers');

const resolvers = {
  MPR: {
    attachmentCheck: async ({ id, attachment }) => {
      try {
        await fs.existsSync(`static/attachment/${id}/${attachment}`);
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
          ['dor', 'ASC'],
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
  },
  Mutation: {},
};

module.exports = { resolvers };
