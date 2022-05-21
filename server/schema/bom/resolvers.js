const fs = require('fs');
const { Op } = require('sequelize');
const { GraphQLUpload } = require('graphql-upload');
const { ErrorWithProps } = require('mercurius');
const XLSX = require('xlsx');
const { format } = require('date-fns');
const sequelize = require('../../config/db');
const {
  LT, WO, WOMODULE, WOITEM, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
  Material,
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
  'bomPoDate', 'bomPoNo', 'poNo', 'bomRemarks', 'priority', 'bomEtaStatus',
  'sr', 'isMpr', 'validasi', 'packing', 'hold', 'cancel',
  'idHeader', 'idModule', 'colorClass',
];

const resolvers = {
  Upload: GraphQLUpload,
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
            [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.validasi AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalValidation'],
            [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.packing = 0 AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalIncomingItems'],
            [sequelize.literal('COUNT(CASE WHEN `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalItems'],
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
            [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.validasi THEN 1 ELSE NULL END)'), 'totalValidation'],
            [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.packing = 0 THEN 1 ELSE NULL END)'), 'totalIncomingItems'],
            [sequelize.literal('COUNT(`wos->mprs->items`.id)'), 'totalItems'],
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

        return item;
      }));
      lt.wos = total;
      lt.totalPrice = lt.totalPriceWO + ltMpr.totalPriceWO;

      return lt;
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
            [sequelize.literal('IFNULL(SUM(CASE WHEN `wos->mprs->items`.packing = 0 THEN `wos->mprs->items`.bom_usd_total ELSE 0 END), 0)'), 'totalPricePerWO'],
            [sequelize.literal('IFNULL(SUM(`wos->mprs->items`.materials_processed), 0)'), 'totalMaterialsProcessed'],
            [sequelize.literal('IFNULL(SUM(`wos->mprs->items`.yet_to_purchase), 0)'), 'totalYetToPurchase'],
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
                { no: { [Op.not]: null } },
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

      lt.wos[0].totalPricePerWO += ltMpr.wos[0].totalPricePerWO;
      lt.wos[0].totalMaterialsProcessed += ltMpr.wos[0].totalMaterialsProcessed;
      lt.wos[0].totalYetToPurchase += ltMpr.wos[0].totalYetToPurchase;
      lt.wos[0].totalPackingPerWO += ltMpr.wos[0].totalPackingPerWO;
      lt.wos[0].totalPackingPerUnit += ltMpr.wos[0].totalPackingPerUnit;
      lt.wos[0].difference -= ltMpr.wos[0].totalPricePerWO;

      const mpr = await WO.findOne({
        attributes: ['id', 'woNo'],
        where: { id },
        include: [{
          model: MPR,
          attributes: [
            'id', 'no', 'unit', 'requestorName', 'bomTimestamp',
          ],
          where: { no: { [Op.not]: null } },
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
              include: [{
                model: MPR,
                attributes: ['id', 'no'],
                required: false,
              }],
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
            include: [{
              model: MPR,
              attributes: ['id', 'no'],
              required: false,
            }],
          }],
        }],
      });

      return {
        lt, wo, mpr,
      };
    }),
    getWoModules: isAuthenticated(async (_, { idWo }) => {
      const modules = await WOMODULE.findAll({
        attributes: ['id', 'hid', 'header'],
        where: { idWo },
      });

      return modules;
    }),
    getAllWoRunning: isAuthenticated(async (_, { key }) => {
      const wo = await WO.findAll({
        attributes: ['id', 'woNo'],
        where: { woNo: { [Op.substring]: key } },
        include: [{
          model: LT,
          attributes: ['id', 'ltNo'],
        }],
      });

      return wo;
    }),
    getAllWoModules: isAuthenticated(async (_, { key }) => {
      const wo = await WO.findAll({
        attributes: ['id', 'woNo'],
        where: { woNo: { [Op.substring]: key } },
        order: ['woNo', ['modules', 'hid']],
        include: [{
          model: WOMODULE,
          attributes: ['id', 'hid', 'header'],
        }],
      });

      return wo;
    }),
    getSearchItems: isAuthenticated(async (_, { key }) => {
      const attributes = [
        'id', 'bomDescription', 'bomSpecification', 'bomModel', 'bomBrand',
        'bomSupplier', 'isMpr',
      ];
      const where = {
        [Op.or]: [
          { bomDescription: { [Op.substring]: key } },
          { bomSpecification: { [Op.substring]: key } },
        ],
      };

      const bomItems = await WOITEM.findAll({
        attributes,
        where,
        raw: true,
      });

      const mprItems = await MPRITEM.findAll({
        attributes,
        where,
        raw: true,
      });

      const items = [...bomItems, ...mprItems];
      return items;
    }),
    getSearchModules: isAuthenticated(async (_, { idHeader }) => {
      const items = await WOITEM.findAll({
        attributes: [
          'id', 'bomDescription', 'bomSpecification', 'bomModel', 'bomBrand',
          'bomSupplier', 'isMpr',
        ],
        where: { idHeader },
        raw: true,
      });

      return items;
    }),
  },
  Mutation: {
    updateItem: isAuthenticated(async (_, { input }) => {
      const {
        euro, gbp, myr, idr, sgd, fromMpr, ...obj
      } = input;
      let { unit } = obj;
      delete obj.unit;
      const currObj = {
        euro, gbp, myr, idr, sgd,
      };
      const value = getCurrency(obj.bomCurrEaC, obj.bomCurrEaV, currObj);

      let item = {};

      const attributes = [
        ...Object.keys(obj), 'bomQtyRqd', 'bomQtyBalance', 'bomUsdEa',
        'bomUsdUnit', 'bomUsdTotal', 'materialsProcessed', 'yetToPurchase',
        'bomEtaStatus', 'validasi', 'poZone', 'poNo', 'idHeader', 'idModule',
        'colorClass',
      ];
      const include = [{
        model: MPR,
        attributes: ['id', 'no'],
        required: false,
      }];

      if (obj.isMpr) {
        item = await MPRITEM.findOne({
          attributes,
          where: { id: obj.id },
          include,
        });
      } else {
        item = await WOITEM.findOne({
          attributes,
          where: { id: obj.id },
        });
      }

      Object.assign(item, obj);
      if (obj.sr) unit = 1;
      const qtyBalance = obj.bomQtyStock - ((unit * obj.bomQty) - obj.bomQtyRec);
      const usdTotal = unit * value * obj.bomQty;

      item.bomQtyBalance = qtyBalance;
      item.bomQtyRqd = unit * obj.bomQty;
      item.bomUsdEa = value;
      item.bomUsdUnit = value * obj.bomQty;
      item.bomUsdTotal = usdTotal;
      item.materialsProcessed = qtyBalance === 0 ? usdTotal : 0;
      item.yetToPurchase = qtyBalance < 0 ? usdTotal : 0;

      if (obj.bomPoNo) {
        const [zone, no] = obj.bomPoNo.split('.');
        item.poZone = zone;
        item.poNo = no;
      }

      if (fromMpr) {
        item.idModule = obj.idModule;
      } else {
        item.idHeader = obj.idHeader;
      }

      if (item.idMaterial) {
        const material = await Material.findOne({
          attributes: ['MaterialCD', 'MaterialNM', 'MaterialDesc', 'Model', 'Brand', 'unit'],
          where: { MaterialCD: item.idMaterial },
        });

        item.bomDescription = material.MaterialNM;
        item.bomSpecification = material.MaterialDesc;
        item.bomModel = material.Model;
        item.bomBrand = material.Brand;
        item.bomUnit = material.unit;
      }

      const save = await item.save();

      return save;
    }),
    deleteItem: isAuthenticated(async (_, { input }) => {
      await Promise.all(
        input.map(async (v) => {
          if (v.isMpr) {
            await MPRITEM.destroy({
              where: { id: v.id },
            });
          } else {
            await WOITEM.destroy({
              where: { id: v.id },
            });
          }
        }),
      );

      return input;
    }),
    addWoItems: isAuthenticated(async (_, { input }) => {
      const saved = [];
      const cAttributes = [
        ...itemAttributes, 'idWo', 'idLt', 'poZone', 'whRemarks', 'prRemarks',
        'rndRemarks', 'hvacRemarks', 'mechanicalRemarks', 'electronicRemarks',
        'fabricationRemarks',
      ];

      await Promise.all(
        input.map(async (v) => {
          let item = {};
          const where = { id: v.id };

          if (v.isMpr) {
            item = await MPRITEM.findOne({
              attributes: cAttributes,
              where,
              raw: true,
            });
          } else {
            item = await WOITEM.findOne({
              attributes: cAttributes,
              where,
              raw: true,
            });
          }

          delete item.id;
          delete item.moduleId;

          item.bomQty = 0;
          item.bomQtyRqd = 0;
          item.bomQtyBalance = 0;
          item.bomEta = null;
          item.bomQtyRec = 0;
          item.bomDateRec = null;
          item.bomQtyStock = 0;
          item.bomCurrSizeC = null;
          item.bomCurrSizeV = 0;
          item.bomCurrEaC = null;
          item.bomCurrEaV = 0;
          item.bomUsdEa = 0;
          item.bomUsdUnit = 0;
          item.bomUsdTotal = 0;
          item.bomSupplier = null;
          item.bomPoDate = null;
          item.bomPoNo = null;
          item.bomRemarks = null;
          item.bomEtaStatus = null;
          item.poZone = null;
          item.poNo = null;
          item.whRemarks = null;
          item.prRemarks = null;
          item.rndRemarks = null;
          item.hvacRemarks = null;
          item.mechanicalRemarks = null;
          item.electronicRemarks = null;
          item.fabricationRemarks = null;
          item.materialsProcessed = 0;
          item.yetToPurchase = 0;
          item.priority = null;
          item.sr = 0;
          item.validasi = 0;
          item.packing = 0;
          item.hold = 0;
          item.cancel = 0;
          item.isMpr = 0;
          item.idWo = v.idWo;
          item.idHeader = v.idHeader;
          item.idLt = v.idLt;
          item.colorClass = null;
          item.bomStatus = null;
          item.poQty = null;
          item.poCurr = null;
          item.poVal = null;
          item.poRemarks = null;
          item.idModule = null;

          const newItem = new WOITEM(item);
          const save = await newItem.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
    updateWoModule: isAuthenticated(async (_, { input }) => {
      const module = await WOMODULE.findOne({
        attributes: ['id', 'hid', 'header'],
        where: { id: input.id },
        include: [{
          model: WOITEM,
          attributes: itemAttributes,
          required: false,
        }],
      });

      module.hid = input.hid;
      module.header = input.header;
      const save = await module.save();
      return save;
    }),
    deleteWoModule: isAuthenticated(async (_, { id }) => {
      await WOMODULE.destroy({
        where: { id },
      });

      return id;
    }),
    importWo: isAuthenticated(async (_, { input }) => {
      const { file } = input;

      const { filename, createReadStream } = await file;
      const stream = createReadStream();

      const tmp = `/tmp/${filename}`;

      await new Promise((resolve, reject) => {
        stream
          .on('error', (error) => {
            if (stream.truncated) fs.unlinkSync(tmp);
            reject(error);
          })
          .pipe(fs.createWriteStream(tmp))
          .on('finish', async () => {
            try {
              const wb = XLSX.readFile(tmp);
              const ws = wb.Sheets[wb.SheetNames[0]];

              let lt = {};
              let wo = {};

              const ltNo = ws.E1.v;
              const woNo = (ws.E2.v).split(':')[1].trim();

              lt = await LT.findOne({
                attributes: ['id'],
                where: { ltNo },
                raw: true,
              });

              wo = await WO.findOne({
                attributes: ['id'],
                where: { woNo },
                raw: true,
              });

              if (!lt) {
                const newLT = new LT({ ltNo });
                lt = await newLT.save();
              }

              if (!wo) {
                const idLt = lt.id;
                const unit = parseInt(ws.F3.v, 10);
                const cat = (ws.A2.v).split(':')[1].trim();
                const model = (ws.A3.v).split(':')[1].trim();
                const product = (ws.A4.v).split(':')[1].trim();
                const pic = 0;
                const sgd = parseFloat(ws.T3.v);
                const idr = parseInt(ws.T4.v, 10);
                const euro = parseFloat(ws.T5.v);
                const gbp = parseFloat(ws.T6.v);

                const newWO = new WO({
                  woNo,
                  idLt,
                  unit,
                  cat,
                  model,
                  product,
                  pic,
                  sgd,
                  idr,
                  euro,
                  gbp,
                });
                wo = await newWO.save();
              }

              const range = XLSX.utils.decode_range(ws['!ref']);

              let idHeader = null;
              /* eslint-disable no-await-in-loop */
              for (let R = 9; R <= range.e.r; R += 1) {
                if (ws[`A${R}`] && ws[`A${R}`].v === 'MRP BOM  IN-CHARGE : ') break;
                else if (ws[`A${R}`] && ws[`C${R}`] && ws[`I${R}`] && ws[`I${R}`].v === 0) {
                  const newModule = new WOMODULE({
                    hid: ws[`A${R}`].v,
                    header: ws[`C${R}`].v,
                    idWo: wo.id,
                    idLt: lt.id,
                  });
                  const save = await newModule.save();
                  idHeader = save.id;
                } else if (ws[`A${R}`] && ws[`C${R}`] && ws[`I${R}`] && ws[`I${R}`].v > 0) {
                  let poZone = null;
                  let poNo = null;

                  if (ws[`Y${R}`] && ws[`Y${R}`].v) {
                    poZone = (ws[`Y${R}`].v).split('.')[0].trim();
                    poNo = (ws[`Y${R}`].v).split('.')[1].trim();
                  }

                  const newItem = new WOITEM({
                    bomDescription: ws[`A${R}`] ? ws[`C${R}`].v : null,
                    bomSpecification: ws[`D${R}`] ? ws[`D${R}`].v : null,
                    bomModel: ws[`E${R}`] ? ws[`E${R}`].v : null,
                    bomBrand: ws[`F${R}`] ? ws[`F${R}`].v : null,
                    bomQty: ws[`G${R}`] ? ws[`G${R}`].v : null,
                    bomUnit: ws[`H${R}`] ? ws[`H${R}`].v : null,
                    bomQtyStock: ws[`L${R}`] ? ws[`L${R}`].v : null,
                    bomEta: ws[`M${R}`] ? format(new Date(ws[`M${R}`].w), 'yyyy-MM-dd') : null,
                    bomQtyRec: ws[`N${R}`] ? ws[`N${R}`].v : null,
                    bomDateRec: ws[`O${R}`] ? format(new Date(ws[`O${R}`].w), 'yyyy-MM-dd') : null,
                    bomCurrSizeC: ws[`P${R}`] ? ws[`P${R}`].v : null,
                    bomCurrSizeV: ws[`Q${R}`] ? ws[`Q${R}`].v : null,
                    bomCurrEaC: ws[`P${R}`] ? ws[`P${R}`].v : null,
                    bomCurrEaV: ws[`S${R}`] ? ws[`S${R}`].v : null,
                    bomUsdEa: ws[`T${R}`] ? ws[`T${R}`].v : null,
                    bomSupplier: ws[`W${R}`] ? ws[`W${R}`].v : null,
                    bomPoDate: ws[`X${R}`] ? format(new Date(ws[`X${R}`].w), 'yyyy-MM-dd') : null,
                    bomPoNo: ws[`Y${R}`] ? ws[`Y${R}`].v : null,
                    poZone,
                    poNo,
                    bomRemarks: ws[`Z${R}`] ? ws[`Z${R}`].v : null,
                    idHeader,
                    idWo: wo.id,
                    idLt: lt.id,
                  });
                  await newItem.save();
                }
              }

              resolve();
            } catch (err) {
              if (typeof err === 'string') {
                reject(new ErrorWithProps(err));
              } else {
                reject(new ErrorWithProps(err.message));
              }
            }
          });
      });
    }),
  },
};

module.exports = { resolvers, itemAttributes };
