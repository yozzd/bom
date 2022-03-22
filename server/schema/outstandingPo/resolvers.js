const sequelize = require('../../config/db');
const {
  OUTSTANDINGPO,
} = require('./model');
const { isAuthenticated } = require('../auth/service');
const { whereCategory, whereStatus } = require('./methods');

const resolvers = {
  Query: {
    getZones: isAuthenticated(async () => {
      const zones = await OUTSTANDINGPO.findAll({
        attributes: [
          [sequelize.literal('DISTINCT po_zone'), 'zone'],
        ],
        order: [['poZone']],
      });

      return zones;
    }),
    getAllOutstandingPoByCategory: isAuthenticated(async (_, { category }) => {
      const where = whereCategory(category);

      const outstandingPo = await OUTSTANDINGPO.findAll({
        attributes: [
          'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
          'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
          'poFinance', 'poEta', 'poArrival', 'poStatus', 'approvalDate',
          'comp', 'hse', 'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
          'arrivalStatus', 'poRemarks', 'poRemarksBom', 'poRemarksAdmin',
          'poRemarksFinance', 'poRemarksWarehouse', 'poCancel', 'colorClass',
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
          'poRemarksFinance', 'poRemarksWarehouse', 'poCancel', 'colorClass',
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
