const sequelize = require('../../config/db');
const {
  OUTSTANDINGPO,
} = require('../relations');

const itemAttributes = [
  'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
  'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
  'poFinance', 'poEta', 'poArrival', 'poStatus', 'approvalDate',
  'comp', 'hse', 'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
  'arrivalStatus', 'poRemarks', 'poRemarksBom', 'poRemarksAdmin',
  'poRemarksFinance', 'poRemarksWarehouse', 'poCancel', 'colorClass',
];

const byCategory = async (where) => {
  const items = await OUTSTANDINGPO.findAll({
    attributes: itemAttributes,
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
};

const byStatus = async (where) => {
  const items = await OUTSTANDINGPO.findAll({
    attributes: itemAttributes,
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
};

const byZone = async (where) => {
  const items = await OUTSTANDINGPO.findAll({
    attributes: itemAttributes,
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
};

module.exports = { byCategory, byStatus, byZone };
