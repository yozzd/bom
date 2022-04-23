const { ErrorWithProps } = require('mercurius');
const sequelize = require('../../config/db');
const {
  OUTSTANDINGPO,
} = require('../relations');
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
    getProposedPoNo: isAuthenticated(async () => {
      const poNum = await OUTSTANDINGPO.findAll({
        attributes: [
          [sequelize.fn('MAX', sequelize.col('po_no')), 'poNo'],
        ]
      });
      
      return poNum;
    }),
  },
  Mutation: {
    createOutPo: isAuthenticated(async (_, { input }) => {
      const count = await OUTSTANDINGPO.count({ where: { poNo: input.poNo } });

      if (count > 0) {
        throw new ErrorWithProps(`This Po No '${input.poNo}' has been registered, please choose another number`);
      } else {
        const newOutPo = new OUTSTANDINGPO(input);
        const save = await newOutPo.save();
        return save;
      }
    }),
    updateOutPo: isAuthenticated(async (_, { input }) => {
      const po = await OUTSTANDINGPO.findOne({
        attributes: [...Object.keys(input)],
        where: { id: input.id },
      });

      Object.assign(po, input);
      po.poIssue = input.poIssue || null;
      po.approvalDate = input.approvalDate || null;
      po.poLpayment = input.poLpayment || null;
      po.poBom = input.poBom || null;
      po.poAdmin = input.poAdmin || null;
      po.poFinance = input.poFinance || null;
      po.poEta = input.poEta || null;
      po.poArrival = input.poArrival || null;

      const save = await po.save();

      return save;
    }),
    deleteOutPo: isAuthenticated(async (_, { input }) => {
      await Promise.all(
        input.map(async (v) => {
          await OUTSTANDINGPO.destroy({
            where: { id: v.id },
          });
        }),
      );

      return input;
    }),
  },
};

module.exports = { resolvers };
