const sequelize = require('../../config/db');
const {
  OUTSTANDINGPO,
} = require('./model');
const { isAuthenticated } = require('../auth/service');
const { whereCategory, whereStatus, whereZones } = require('./methods');

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

      const items = await OUTSTANDINGPO.findAll({
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

      const totals = await OUTSTANDINGPO.findAll({
        attributes: [
          [sequelize.literal('SUM(po_value_usd)'), 'totalPoValueUsd'],
          [sequelize.literal('SUM(po_paid_usd)'), 'totalPoPaidUsd'],
        ],
        where,
      });

      return { items, totals };
    }),
    getAllOutstandingPoByStatus: isAuthenticated(async (_, { status }) => {
      const where = whereStatus(status);

      const items= await OUTSTANDINGPO.findAll({
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

      const totals = await OUTSTANDINGPO.findAll({
        attributes: [
          [sequelize.literal('SUM(po_value_usd)'), 'totalPoValueUsd'],
          [sequelize.literal('SUM(po_paid_usd)'), 'totalPoPaidUsd'],
        ],
        where,
      });

      return { items, totals };
    }),
    getAllOutstandingPoByZones: isAuthenticated(async (_, { zone }) => {
      const where = whereZones(zone);

      const items = await OUTSTANDINGPO.findAll({
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

      const totals = await OUTSTANDINGPO.findAll({
        attributes: [
          [sequelize.literal('SUM(po_value_usd)'), 'totalPoValueUsd'],
          [sequelize.literal('SUM(po_paid_usd)'), 'totalPoPaidUsd'],
        ],
        where,
      });

      return { items, totals };
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
