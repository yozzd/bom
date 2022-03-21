const {
  OUTSTANDINGPO,
} = require('./model');
const { isAuthenticated } = require('../auth/service');
const { whereCategory, whereStatus } = require('./methods');

const resolvers = {
  Query: {
    getAllOutstandingPoByCategory: isAuthenticated(async (_, { category }) => {
      const where = whereCategory(category);

      const outstandingPo = await OUTSTANDINGPO.findAll({
        attributes: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'poStatus', 'approvalDate',
          'comp', 'hse', 'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
          'arrivalStatus', 'poRemarks', 'poRemarksBom', 'poRemarksAdmin',
          'poRemarksFinance', 'poRemarksWarehouse', 'colorClass',
        ],
        where,
        order: [['poIssue', 'DESC']],
      });

      return outstandingPo;
    }),
    getAllOutstandingPoByStatus: isAuthenticated(async (_, { status }) => {
      const where = whereStatus(status);

      const outstandingPo = await OUTSTANDINGPO.findAll({
        attributes: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'poStatus', 'approvalDate',
          'comp', 'hse', 'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
          'arrivalStatus', 'poRemarks', 'poRemarksBom', 'poRemarksAdmin',
          'poRemarksFinance', 'poRemarksWarehouse', 'colorClass',
        ],
        where,
        order: [['poIssue', 'DESC']],
      });

      return outstandingPo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
