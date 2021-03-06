const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const {
  LT, WO, WOMODULE, WOITEM, MPR, MPRITEM, OUTSTANDINGPO,
} = require('../relations');

const itemAttributes = [
  'id', 'idMaterial', 'bomDescription', 'bomSpecification',
  'bomModel', 'bomBrand', 'bomQty', 'bomUnit', 'bomQtyRqd',
  'bomQtyBalance', 'bomQtyStock', 'bomEta', 'bomQtyRec',
  'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
  'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal',
  'materialsProcessed', 'yetToPurchase', 'bomSupplier',
  'bomPoDate', 'bomPoNo', 'poNo', 'bomRemarks', 'priority', 'bomEtaStatus',
  'sr', 'isMpr', 'validasi', 'packing', 'hold', 'cancel',
  'idHeader', 'idModule', 'colorClass',
];

const queryLt = async (id, status) => {
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
        'cat', 'pic', 'rndic', 'refer', 'status', 'euro', 'gbp', 'myr', 'idr', 'sgd',
        [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.bom_qty_balance >= 0 AND `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalIncoming'],
        [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.validasi AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalValidation'],
        [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalIncomingItems'],
        [sequelize.literal('COUNT(CASE WHEN `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalItems'],
        [sequelize.literal('SUM(CASE WHEN `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
        [sequelize.literal('SUM(`wos->modules->items`.yet_to_purchase)'), 'totalYetToPurchase'],
        [sequelize.literal('SUM(CASE WHEN `wos->modules`.header LIKE ("%deviation%") THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalDeviation'],
        [sequelize.literal('SUM(CASE WHEN `wos->modules->items`.packing THEN `wos->modules->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
        [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.bom_qty > 0 AND `wos->modules->items`.bom_qty_stock >= 0 AND `wos->modules->items`.bom_qty_balance >= 0 THEN 1 ELSE NULL END)'), 'totalOntimeItems'],
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
        [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.validasi THEN 1 ELSE NULL END)'), 'totalValidation'],
        [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.packing = 0 THEN 1 ELSE NULL END)'), 'totalIncomingItems'],
        [sequelize.literal('COUNT(`wos->mprs->items`.id)'), 'totalItems'],
        [sequelize.literal('SUM(CASE WHEN `wos->mprs->items`.packing = 0 THEN `wos->mprs->items`.bom_usd_total ELSE 0 END)'), 'totalPricePerWO'],
        [sequelize.literal('SUM(`wos->mprs->items`.yet_to_purchase)'), 'totalYetToPurchase'],
        [sequelize.literal('SUM(CASE WHEN `wos->mprs->items`.packing THEN `wos->mprs->items`.bom_usd_total ELSE 0 END)'), 'totalPackingPerWO'],
        [sequelize.literal('COUNT(DISTINCT `wos->mprs`.id)'), 'totalMpr'],
        [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.bom_qty > 0 AND `wos->mprs->items`.bom_qty_stock >= 0 AND `wos->mprs->items`.bom_qty_balance >= 0 THEN 1 ELSE NULL END)'), 'totalOntimeItems'],
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

  const total = await Promise.all(lt.wos.map((v, i) => {
    const item = v;
    item.bomIncoming = item.totalIncoming;
    item.mprIncoming = ltMpr.wos[i].totalIncoming;
    item.bomPercentIncoming = item.percentIncoming;
    item.mprPercentIncoming = ltMpr.wos[i].percentIncoming;
    item.bomValidation = item.totalValidation;
    item.mprValidation = ltMpr.wos[i].totalValidation;
    item.bomPercentValidation = item.percentValidation;
    item.mprPercentValidation = ltMpr.wos[i].percentValidation;

    item.totalIncoming += ltMpr.wos[i].totalIncoming;
    item.totalIncomingItems += ltMpr.wos[i].totalIncomingItems;
    item.totalItems += ltMpr.wos[i].totalItems;
    item.totalValidation += ltMpr.wos[i].totalValidation;
    item.totalMpr = ltMpr.wos[i].totalMpr;
    item.totalPricePerUnit += ltMpr.wos[i].totalPricePerUnit;
    item.totalPricePerWO += ltMpr.wos[i].totalPricePerWO;
    item.difference -= ltMpr.wos[i].totalPricePerWO;
    item.totalYetToPurchase += ltMpr.wos[i].totalYetToPurchase;
    item.totalPackingPerUnit += ltMpr.wos[i].totalPackingPerUnit;
    item.totalPackingPerWO += ltMpr.wos[i].totalPackingPerWO;

    item.percentIncoming = (item.totalIncoming / item.totalIncomingItems) * 100;
    item.percentValidation = (item.totalValidation / item.totalItems) * 100;

    item.totalOntimeItems += ltMpr.wos[i].totalOntimeItems;

    return item;
  }));
  lt.wos = total;
  lt.totalPrice = lt.totalPriceWO + ltMpr.totalPriceWO;

  return lt;
};

const queryWo = async (id) => {
  const wo = await WO.findOne({
    attributes: ['id', 'woNo', 'cat', 'product', 'model', 'unit'],
    where: { id },
    order: [['modules', 'hid']],
    include: [{
      model: LT,
      attributes: ['id', 'ltNo'],
    }, {
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

  return wo;
};

module.exports = {
  queryLt, queryWo,
};
