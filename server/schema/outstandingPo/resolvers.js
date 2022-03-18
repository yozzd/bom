const { Op } = require('sequelize');
const {
  OUTSTANDINGPO,
} = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllOutstandingPo: isAuthenticated(async (_, { zone }) => {
      let where = null;
      if (zone === 1) {
        where = {
          [Op.and]: [
            { poCancel: 0 },
            { poZone: { [Op.in]: ['C', 'T', 'HK'] } },
          ],
        };
      } else if (zone === 2) {
        where = {
          [Op.and]: [
            { poCancel: 0 },
            { poZone: { [Op.in]: ['S'] } },
          ],
        };
      }

      const outstandingPo = await OUTSTANDINGPO.findAll({
        attributes: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'approvalDate', 'comp', 'hse',
          'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
        ],
        where,
      });

      return outstandingPo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
