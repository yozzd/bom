const {
  OUTSTANDINGPO,
} = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllOutstandingPo: isAuthenticated(async () => {
      const outstandingPo = await OUTSTANDINGPO.findAll({
        attributes: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'approvalDate', 'comp', 'hse',
          'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
        ],
        where: {
          poCancel: 0,
        },
      });

      return outstandingPo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
