const { ErrorWithProps } = require('mercurius');
const sequelize = require('../../config/db');
const {
  OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const {
  whereCategory, whereStatus, whereZones, genOut,
} = require('./methods');
const { byCategory, byStatus, byZone } = require('./query');

const itemAttributes = [
  'id', 'poIssue', 'poZone', 'poNo', 'poSupplier', 'poDescription',
  'poKvalue', 'poValue', 'poLt', 'poLpayment', 'poBom', 'poAdmin',
  'poFinance', 'poEta', 'poArrival', 'poStatus', 'approvalDate',
  'comp', 'hse', 'poValueUsd', 'poPaidUsd', 'poBalanceUsd',
  'arrivalStatus', 'poRemarks', 'poRemarksBom', 'poRemarksAdmin',
  'poRemarksFinance', 'poRemarksWarehouse', 'poCancel', 'colorClass',
];
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
      const result = await byCategory(where);

      return result;
    }),
    getAllOutstandingPoByStatus: isAuthenticated(async (_, { status }) => {
      const where = whereStatus(status);
      const result = await byStatus(where);

      return result;
    }),
    getAllOutstandingPoByZones: isAuthenticated(async (_, { zone }) => {
      const where = whereZones(zone);
      const result = await byZone(where);

      return result;
    }),
    getProposedPoNo: isAuthenticated(async () => {
      const poNum = await OUTSTANDINGPO.findAll({
        attributes: [
          [sequelize.fn('MAX', sequelize.col('po_no')), 'poNo'],
        ],
      });

      return poNum;
    }),
    checkPo: isAuthenticated(async (_, { poNo }) => {
      const count = await OUTSTANDINGPO.count({ where: { poNo } });

      if (count > 0) {
        return { status: 0 };
      }
      return { status: 1 };
    }),
    genOutXLS: isAuthenticated(async (_, { input }) => {
      const {
        mode, category, status, zone, header,
      } = input;
      let result = null;

      if (mode === 1) {
        const where = whereCategory(category);
        result = await byCategory(where);
      } else if (mode === 2) {
        const where = whereStatus(status);
        result = await byStatus(where);
      } else if (mode === 3) {
        const where = whereZones(zone);
        result = await byZone(where);
      }

      const gen = await genOut(result, header);

      return gen;
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
        attributes: itemAttributes,
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
