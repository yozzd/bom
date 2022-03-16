const { Op } = require('sequelize');
const merge = require('lodash/merge');
const sequelize = require('../../config/db');
const {
  LT, WO, WOHEADER, WOITEM,
} = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllLT: isAuthenticated(async (_, { status }) => {
      const lt = await LT.findAll({
        attributes: ['id', 'ltNo', 'customer'],
        order: [['id', 'DESC']],
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'status'],
          where: { status },
        }],
      });

      return lt;
    }),
    getOneLT: isAuthenticated(async (_, { id, status }) => {
      const lt = await LT.findOne({
        attributes: ['id', 'ltNo', 'customer', 'totalBudget', 'totalPriceWO'],
        group: ['wos.id'],
        where: { id },
        order: [
          [sequelize.literal('LENGTH(wo_no), wo_no')],
        ],
        include: [{
          model: WO,
          attributes: [
            'id', 'woNo', 'model', 'product', 'issued', 'unit', 'budget', 'difference', 'stage',
            [sequelize.literal('COUNT(CASE WHEN `wos->headers->items`.bom_qty_balance >= 0 AND `wos->headers->items`.packing = 0 AND `wos->headers`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalIncoming'],
            [sequelize.literal('COUNT(CASE WHEN `wos->headers->items`.validasi AND `wos->headers->items`.packing = 0 AND `wos->headers`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalValidation'],
            [sequelize.literal('COUNT(CASE WHEN `wos->headers->items`.packing = 0 AND `wos->headers`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalItems'],
            [sequelize.literal('SUM(CASE WHEN `wos->headers->items`.packing = 0 AND `wos->headers`.header NOT LIKE ("%deviation%") THEN `wos->headers->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
            [sequelize.literal('SUM(`wos->headers->items`.yet_to_purchase)'), 'totalYetToPurchase'],
            [sequelize.literal('SUM(CASE WHEN `wos->headers`.header LIKE ("%deviation%") THEN `wos->headers->items`.bom_usd_total ELSE 0 END)'), 'totalDeviation'],
            [sequelize.literal('SUM(CASE WHEN `wos->headers->items`.packing THEN `wos->headers->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
          ],
          where: { status },
          include: [{
            model: WOHEADER,
            attributes: [],
            include: [{
              model: WOITEM,
              attributes: [],
              where: {
                [Op.and]: [
                  { cancel: 0 },
                  { idHeader: { [Op.not]: null } },
                ],
              },
            }],
          }],
        }],
      });

      return lt;
    }),
    getOneWO: isAuthenticated(async (_, { id }) => {
      const wo = await WO.findOne({
        attributes: [
          'id', 'woNo', 'idLt', 'cat', 'model', 'product', 'stage',
          'sgd', 'idr', 'budget', 'refer', 'status',
        ],
        where: { id },
        include: [{
          model: WOHEADER,
          attributes: ['id', 'hid', 'header'],
          order: ['hid'],
          include: [{
            model: WOITEM,
            attributes: [
              'id', 'idMaterial', 'bomDescription', 'bomSpecification',
              'bomModel', 'bomBrand', 'bomQty', 'bomUnit', 'bomQtyRqd',
              'bomQtyBalance', 'bomQtyStock', 'bomEta', 'bomQtyRec',
              'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
              'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal',
              'materialsProcessed', 'yetToPurchase', 'bomSupplier',
              'bomPoDate', 'bomPoNo', 'bomRemarks', 'priority', 'bomEtaStatus',
              'packing',
            ],
            where: {
              [Op.and]: [
                { cancel: 0 },
                { idHeader: { [Op.not]: null } },
              ],
            },
            required: false,
          }],
        }],
      });

      const woSum = await WO.findOne({
        attributes: [
          [sequelize.literal('SUM(CASE WHEN `headers->items`.packing = 0 AND `headers`.header NOT LIKE ("%deviation%") THEN `headers->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
        ],
        where: { id },
        include: [{
          model: WOHEADER,
          attributes: [],
          include: [{
            model: WOITEM,
            attributes: [],
            where: {
              [Op.and]: [
                { cancel: 0 },
                { idHeader: { [Op.not]: null } },
              ],
            },
            required: false,
          }],
        }],
      });

      return merge(wo, woSum);
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
