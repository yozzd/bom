const { Op } = require('sequelize');
const {
  WO, MPR, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { whereStatus } = require('./methods');

const resolvers = {
  Query: {
    getAllMPR: isAuthenticated(async (_, { status }) => {
      const where = whereStatus(status);

      const items = await MPRITEM.findAll({
        attributes: [
          'idMpr',
        ],
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

      const ids = await Promise.all(items.reduce((prev, curr) => [...prev, curr.idMpr], []));

      const mpr = await MPR.findAll({
        attributes: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing',
          'managerApproved', 'managerTimestamp', 'whApproved',
          'whTimestamp', 'bomApproved', 'bomTimestamp',
        ],
        order: [
          ['category', 'DESC'],
          ['dor', 'ASC'],
        ],
        where: {
          [Op.and]: [
            { id: { [Op.in]: ids } },
            { cancel: 0 },
            { hold: 0 },
            { managerApproved: 1 },
            { whApproved: 1 },
          ],
        },
        include: [{
          model: WO,
          attributes: ['idLt'],
        }],
      });

      return mpr;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
