const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const {
  LT, WO, WOMODULE, WOITEM, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');

const itemAttributes = [
  'id', 'idMaterial', 'bomDescription', 'bomSpecification',
  'bomModel', 'bomBrand', 'bomQty', 'bomUnit', 'bomQtyRqd',
  'bomQtyBalance', 'bomQtyStock', 'bomEta', 'bomQtyRec',
  'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
  'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal',
  'materialsProcessed', 'yetToPurchase', 'bomSupplier',
  'bomPoDate', 'bomPoNo', 'bomRemarks', 'priority', 'bomEtaStatus',
  'validasi', 'hold', 'cancel', 'colorClass',
];

const resolvers = {
  MPR: {
    modules: async ({ id }) => {
      const module = await MPRMODULE.findAll({
        attributes: ['id', 'moduleChar', 'moduleName'],
        where: { idMpr: id },
        required: false,
      });

      if (module.length) return module;
      return [{
        id: 0, moduleChar: '', moduleName: '', idMpr: id,
      }];
    },
  },
  MPRMODULE: {
    items: async ({ id, idMpr }) => {
      let item = [];

      const include = [{
        model: OUTSTANDINGPO,
        attributes: ['poStatus', 'poArrival', 'poNo'],
        required: false,
      }];

      if (id) {
        item = await MPRITEM.findAll({
          attributes: itemAttributes,
          where: { idModule: id },
          required: false,
          include,
        });
      } else {
        item = await MPRITEM.findAll({
          attributes: itemAttributes,
          where: { idMpr },
          required: false,
          include,
        });
      }

      return item;
    },
  },
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
          [sequelize.literal('LENGTH(wos.wo_no), wos.wo_no')],
        ],
        required: false,
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
          required: false,
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
        }],
      });

      const ltMpr = await LT.findOne({
        attributes: ['id', 'ltNo', 'totalBudget', 'totalPriceWO'],
        group: ['wos.id'],
        where: { id },
        order: [
          [sequelize.literal('LENGTH(wos.wo_no), wos.wo_no')],
        ],
        required: false,
        include: [{
          model: WO,
          attributes: [
            'id', 'woNo', 'unit',
            [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.bom_qty_balance >= 0 AND `wos->mprs->items`.packing = 0 THEN 1 ELSE NULL END)'), 'totalIncoming'],
            [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.validasi AND `wos->mprs->items`.packing = 0 THEN 1 ELSE NULL END)'), 'totalValidation'],
            [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.packing = 0 THEN 1 ELSE NULL END)'), 'totalItems'],
            [sequelize.literal('SUM(CASE WHEN `wos->mprs->items`.packing = 0 THEN `wos->mprs->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
            [sequelize.literal('SUM(`wos->mprs->items`.yet_to_purchase)'), 'totalYetToPurchase'],
            [sequelize.literal('SUM(CASE WHEN `wos->mprs->items`.packing THEN `wos->mprs->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
            [sequelize.literal('COUNT(DISTINCT `wos->mprs`.id)'), 'totalMpr'],
          ],
          where: { status },
          required: false,
          include: [{
            model: MPR,
            attributes: [],
            where: {
              [Op.and]: [
                { cancel: 0 },
                { whApproved: 1 },
                { managerApproved: 1 },
                { bomApproved: 1 },
              ],
            },
            required: false,
            include: [{
              model: MPRITEM,
              attributes: [],
              where: {
                [Op.and]: [
                  { cancel: 0 },
                ],
              },
              required: false,
            }],
          }],
        }],
      });

      return { lt, ltMpr };
    }),
    getOneWO: isAuthenticated(async (_, { idLt, id }) => {
      const lt = await LT.findOne({
        attributes: ['id', 'ltNo', 'customer'],
        where: { id: idLt },
        include: [{
          model: WO,
          attributes: [
            'unit', 'budget', 'difference', 'totalPackingPerUnit',
            [sequelize.literal('SUM(CASE WHEN `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
            [sequelize.literal('SUM(`wos->modules->items`.materials_processed)'), 'totalMaterialsProcessed'],
            [sequelize.literal('SUM(`wos->modules->items`.yet_to_purchase)'), 'totalYetToPurchase'],
            [sequelize.literal('SUM(CASE WHEN `wos->modules`.header LIKE ("%deviation%") THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalDeviation'],
            [sequelize.literal('SUM(CASE WHEN `wos->modules->items`.packing THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
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
            }],
          }],
        }],
      });

      const wo = await WO.findOne({
        attributes: [
          'id', 'woNo', 'idLt', 'unit', 'cat', 'model', 'product', 'picName',
          'rndic', 'stage', 'sgd', 'idr', 'euro', 'gbp', 'myr', 'refer', 'status',
          'issued',
        ],
        where: { id },
        order: [['modules', 'hid']],
        include: [{
          model: WOMODULE,
          attributes: ['id', 'hid', 'header'],
          include: [{
            model: WOITEM,
            attributes: itemAttributes,
            where: {
              idHeader: { [Op.not]: null },
            },
            required: false,
            include: [{
              model: OUTSTANDINGPO,
              attributes: ['poStatus', 'poArrival', 'poNo'],
              required: false,
            }],
          }],
        }],
      });

      const ltMpr = await LT.findOne({
        attributes: ['id', 'ltNo'],
        where: { id: idLt },
        required: false,
        include: [{
          model: WO,
          attributes: [
            'unit', 'totalPackingPerUnit',
            [sequelize.literal('SUM(CASE WHEN `wos->mprs->items`.packing = 0 THEN `wos->mprs->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
            [sequelize.literal('SUM(`wos->mprs->items`.materials_processed)'), 'totalMaterialsProcessed'],
            [sequelize.literal('SUM(`wos->mprs->items`.yet_to_purchase)'), 'totalYetToPurchase'],
            [sequelize.literal('SUM(CASE WHEN `wos->mprs->items`.packing THEN `wos->mprs->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
          ],
          where: { id },
          required: false,
          include: [{
            model: MPR,
            attributes: [],
            where: {
              [Op.and]: [
                { cancel: 0 },
                { whApproved: 1 },
                { managerApproved: 1 },
                { bomApproved: 1 },
              ],
            },
            required: false,
            include: [{
              model: MPRITEM,
              attributes: [],
              where: {
                [Op.and]: [
                  { cancel: 0 },
                ],
              },
              required: false,
            }],
          }],
        }],
      });

      const mpr = await WO.findOne({
        attributes: ['id', 'woNo'],
        where: { id },
        include: [{
          model: MPR,
          attributes: [
            'id', 'no', 'requestorName', 'bomTimestamp',
          ],
          required: false,
        }],
      });

      return {
        lt, wo, ltMpr, mpr,
      };
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
