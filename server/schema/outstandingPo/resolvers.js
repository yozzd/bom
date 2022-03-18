const {
  OUTSTANDINGPO,
} = require('./model');
const { isAuthenticated } = require('../auth/service');
const { whereZone } = require('./methods');

const resolvers = {
  Query: {
    getAllOutstandingPo: isAuthenticated(async (_, { zone }) => {
      const where = whereZone(zone);

      const outstandingPo = await OUTSTANDINGPO.findAll({
        attributes: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'approvalDate', 'comp', 'hse',
          'poValueUsd', 'poPaidUsd', 'poBalanceUsd', 'arrivalStatus',
          'poRemarks',
        ],
        where,
      });

      return outstandingPo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
