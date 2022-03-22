const { Op } = require('sequelize');
const merge = require('lodash/merge');
const sequelize = require('../../config/db');
const {
  LT, WO, WOMODULE, WOITEM,
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
            [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.bom_qty_balance >= 0 AND `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalIncoming'],
            [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.validasi AND `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalValidation'],
            [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalItems'],
            [sequelize.literal('SUM(CASE WHEN `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
            [sequelize.literal('SUM(`wos->modules->items`.yet_to_purchase)'), 'totalYetToPurchase'],
            [sequelize.literal('SUM(CASE WHEN `wos->modules`.header LIKE ("%deviation%") THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalDeviation'],
            [sequelize.literal('SUM(CASE WHEN `wos->modules->items`.packing THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
          ],
          where: { status },
          include: [{
            model: WOMODULE,
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
          'id', 'woNo', 'idLt', 'unit', 'cat', 'model', 'product', 'picName',
          'rndic', 'stage', 'sgd', 'idr', 'euro', 'gbp', 'myr', 'budget',
          'refer', 'status',
        ],
        where: { id },
        include: [{
          model: WOMODULE,
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
              'validasi', 'hold', 'cancel', 'colorClass',
            ],
            where: {
              idHeader: { [Op.not]: null },
            },
            required: false,
          }],
        }],
      });

      const woTotal = await WO.findOne({
        attributes: [
          'difference', 'totalPackingPerUnit',
          [sequelize.literal('SUM(CASE WHEN `modules->items`.packing = 0 AND `modules`.header NOT LIKE ("%deviation%") THEN `modules->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
          [sequelize.literal('SUM(`modules->items`.materials_processed)'), 'totalMaterialsProcessed'],
          [sequelize.literal('SUM(`modules->items`.yet_to_purchase)'), 'totalYetToPurchase'],
          [sequelize.literal('SUM(CASE WHEN `modules->items`.packing THEN `modules->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
        ],
        where: { id },
        include: [{
          model: WOMODULE,
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

      return merge(wo, woTotal);
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
