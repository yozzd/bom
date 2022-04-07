const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const {
  LT, WO, WOMODULE, WOITEM, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { wherePic, getCurrency } = require('./method');

const itemAttributes = [
  'id', 'idMaterial', 'bomDescription', 'bomSpecification',
  'bomModel', 'bomBrand', 'bomQty', 'bomUnit', 'bomQtyRqd',
  'bomQtyBalance', 'bomQtyStock', 'bomEta', 'bomQtyRec',
  'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
  'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal',
  'materialsProcessed', 'yetToPurchase', 'bomSupplier',
  'bomPoDate', 'bomPoNo', 'bomRemarks', 'priority', 'bomEtaStatus',
  'isMpr', 'validasi', 'hold', 'cancel', 'colorClass',
];

const resolvers = {
  Query: {
    getAllLT: isAuthenticated(async (_, { status }, ctx) => {
      const where = wherePic(status, ctx);
      const lt = await LT.findAll({
        attributes: ['id', 'ltNo', 'customer'],
        order: [['id', 'DESC']],
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'status'],
          where,
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
              where: { cancel: 0 },
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
            required: false,
            include: [{
              model: OUTSTANDINGPO,
              attributes: ['poStatus', 'poArrival', 'poNo'],
              required: false,
            }],
          }],
        }],
      });

      const woMpr = await WO.findOne({
        attributes: ['id', 'woNo'],
        where: { id },
        order: [['modules', 'hid']],
        include: [{
          model: WOMODULE,
          attributes: ['id', 'hid', 'header'],
          include: [{
            model: MPRITEM,
            attributes: itemAttributes,
            required: false,
            include: [{
              model: OUTSTANDINGPO,
              attributes: ['poStatus', 'poArrival', 'poNo'],
              required: false,
            }, {
              model: MPR,
              attributes: ['id', 'no'],
              required: false,
            }],
          }],
        }],
      });

      const merge = await Promise.all(wo.modules.map((v, i) => {
        v.items.push(...woMpr.modules[i].items);
        return v;
      }));
      wo.modules = merge;

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
              where: { cancel: 0 },
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
          include: [{
            model: MPRMODULE,
            attributes: ['id', 'moduleChar', 'moduleName'],
            required: false,
            include: [{
              model: MPRITEM,
              attributes: itemAttributes,
              where: { idHeader: { [Op.is]: null } },
              required: false,
            }],
          }, {
            model: MPRITEM,
            attributes: itemAttributes,
            where: {
              [Op.and]: [
                { idModule: { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: 0 }] } },
                { idHeader: { [Op.is]: null } },
              ],
            },
            required: false,
          }],
        }],
      });

      return {
        lt, wo, ltMpr, mpr,
      };
    }),
    getOneITEM: isAuthenticated(async (_, { id, isMpr }) => {
      let item = {};

      if (!isMpr) {
        item = await WOITEM.findOne({
          attributes: [
            'id', 'idMaterial', 'bomDescription', 'bomSpecification',
            'bomModel', 'bomBrand', 'bomQty', 'bomUnit', 'bomQtyStock',
            'bomEta', 'bomQtyRec', 'bomDateRec', 'bomCurrSizeC',
            'bomCurrSizeV', 'bomCurrEaC', 'bomCurrEaV', 'bomSupplier',
            'bomPoDate', 'bomPoNo', 'bomRemarks',
          ],
          where: { id },
          required: false,
          include: [{
            model: WO,
            attributes: [
              'id', 'idLt', 'unit', 'euro', 'gbp', 'myr',
              'idr', 'sgd',
            ],
            required: false,
          }],
        });
      }

      return item;
    }),
  },
  Mutation: {
    updateITEM: isAuthenticated(async (_, { input }) => {
      const {
        unit, euro, gbp, myr, idr, sgd, ...obj
      } = input;
      const currObj = {
        euro, gbp, myr, idr, sgd,
      };
      const value = getCurrency(obj.bomCurrEaC, obj.bomCurrEaV, currObj);

      let item = {};

      if (!obj.isMpr) {
        item = await WOITEM.findOne({
          attributes: [
            ...Object.keys(obj), 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal',
            'materialsProcessed', 'poZone', 'poNo',
          ],
          where: { id: obj.id },
        });
      }

      Object.assign(item, obj);
      const qtyBalance = obj.bomQtyStock - (unit * obj.bomQty) - obj.bomQtyRec;
      const usdTotal = unit * value * obj.bomQty;

      item.bomQtyBalance = qtyBalance;
      item.bomQtyRqd = unit * obj.bomQty;
      item.bomUsdEa = value;
      item.bomUsdUnit = value * obj.bomQty;
      item.bomUsdTotal = usdTotal;
      item.materialsProcessed = qtyBalance === 0 ? usdTotal : 0;

      if (obj.bomPoNo) {
        const [zone, no] = obj.bomPoNo.split('.');
        item.poZone = zone;
        item.poNo = no;
      }

      const save = await item.save();

      return save;
    }),
  },
};

module.exports = { resolvers, itemAttributes };
