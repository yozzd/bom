const { Op } = require('sequelize');
const {
  MPR, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllMPR: isAuthenticated(async (_, { status }) => {
      console.log(status);
      const items = await MPRITEM.findAll({
        attributes: [
          'idMpr',
        ],
        where: {
          [Op.and]: [
            { cancel: 0 },
            { bomQtyBalance: { [Op.lt]: 0 } },
            { bomQtyRec: { [Op.lte]: 0 } },
            { poNo: { [Op.is]: null } },
            { '$outstandingPo.po_no$': { [Op.is]: null } },
          ],
        },
        group: ['idMpr'],
        required: false,
        include: [{
          model: OUTSTANDINGPO,
          attributes: ['poStatus', 'poArrival', 'poNo'],
          required: false,
        }],
        raw: true,
      });

      const ids = items.reduce((prev, curr) => [...prev, curr.idMpr], []);

      const mpr = await MPR.findAll({
        attributes: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing',
          'managerApproved', 'whApproved', 'cancel', 'hold',
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
      });

      return mpr;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
