const fs = require('fs');
const { GraphQLUpload } = require('graphql-upload');
const { ErrorWithProps } = require('mercurius');
const XLSX = require('xlsx');
const { format } = require('date-fns');
const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const {
  LT, WO, WOMODULE, WOITEM, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
  Material, Employer, Wmr,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { queryLt, queryWo } = require('./query');
const {
  wherePic, getCurrency, sendApprovedEmail, sendValidatedEmail,
  genLt, genWo,
} = require('./method');

const itemAttributes = [
  'id', 'idMaterial', 'bomDescription', 'bomSpecification',
  'bomModel', 'bomBrand', 'bomQty', 'bomUnit', 'bomQtyRqd',
  'bomQtyBalance', 'bomQtyStock', 'bomEta', 'bomQtyRec',
  'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
  'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal',
  'materialsProcessed', 'yetToPurchase', 'bomSupplier',
  'bomPoDate', 'bomPoNo', 'poNo', 'bomRemarks', 'priority', 'bomEtaStatus',
  'sr', 'isMpr', 'validasi', 'packing', 'hold', 'cancel',
  'idHeader', 'idModule', 'idWmr', 'qtyIssued', 'wmrPrRemarks', 'wmrWhRemarks',
  'stockReady', 'colorClass',
];

const pics = [
  '', 'Electronic', 'HVAC', ' Mechanical', 'Information Technology',
  'Sales Marketing & Support', 'Customer Sevice & Installation Training Support',
  'Ennovation', '[Electronic, HVAC, Mechanical]',
  'General Affair & Human Resource Management', 'R & D',
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
      const lt = await queryLt(id, status);
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
            [sequelize.literal('COUNT(CASE WHEN `wos->modules->items`.validasi AND `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalValidation'],
            [sequelize.literal('COUNT(CASE WHEN `wos->modules`.header NOT LIKE ("%deviation%") THEN 1 ELSE NULL END)'), 'totalItems'],
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
            }, {
              model: Wmr,
              attributes: ['id', 'no'],
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
            }, {
              model: Wmr,
              attributes: ['id', 'no'],
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
            [sequelize.literal('COUNT(CASE WHEN `wos->mprs->items`.validasi THEN 1 ELSE NULL END)'), 'totalValidation'],
            [sequelize.literal('COUNT(`wos->mprs->items`.id)'), 'totalItems'],
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
      lt.wos[0].totalItems += ltMpr.wos[0].totalItems;
      lt.wos[0].totalValidation += ltMpr.wos[0].totalValidation;

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
              }, {
                model: OUTSTANDINGPO,
                attributes: ['poStatus', 'poArrival', 'poNo'],
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
            }, {
              model: OUTSTANDINGPO,
              attributes: ['poStatus', 'poArrival', 'poNo'],
            }, {
              model: Wmr,
              attributes: ['id', 'no'],
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
        attributes: ['id', 'woNo', 'model', 'product', 'unit'],
        where: { woNo: { [Op.substring]: key } },
        include: [{
          model: LT,
          attributes: ['id', 'ltNo'],
        }],
      });

      return wo;
    }),
    getPersonDept: isAuthenticated(async (_, { key }) => {
      const persons = await Employer.findAll({
        attributes: ['nk', 'nama'],
        where: {
          [Op.and]: [
            { nama: { [Op.substring]: key } },
          ],
        },
      });

      return persons;
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
    genLtXLS: isAuthenticated(async (_, { id, status }) => {
      const lt = await queryLt(id, status);
      const gen = await genLt(lt);

      return gen;
    }),
    genWoXLS: isAuthenticated(async (_, { id }) => {
      const wo = await queryWo(id);
      const gen = await genWo(wo);

      return gen;
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
        'idWmr', 'colorClass',
      ];
      const include = [{
        model: MPR,
        attributes: ['id', 'no'],
        required: false,
      }, {
        model: OUTSTANDINGPO,
        attributes: ['poStatus', 'poArrival', 'poNo'],
      }, {
        model: Wmr,
        attributes: ['id', 'no'],
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
          include: [{
            model: OUTSTANDINGPO,
            attributes: ['poStatus', 'poArrival', 'poNo'],
          }, {
            model: Wmr,
            attributes: ['id', 'no'],
          }],
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

      if (obj.materialsProcessed === 0) {
        item.materialsProcessed = qtyBalance === 0 ? usdTotal : 0;
        item.yetToPurchase = qtyBalance < 0 ? usdTotal : 0;
      }

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
      const arr = input.map((v) => ({
        id: v.id,
        isMpr: v.isMpr,
        idHeader: v.idHeader,
        idModule: v.idModule,
        mpr: { id: v.idMpr ? v.idMpr : null },
      }));

      await Promise.all(
        arr.map(async (v) => {
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

      return arr;
    }),
    addWoItems: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          const item = {};

          item.bomDescription = v.bomDescription;
          item.bomSpecification = v.bomSpecification;
          item.bomModel = v.bomModel;
          item.bomBrand = v.bomBrand;
          item.bomUnit = v.bomUnit;
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
          item.idMaterial = v.idMaterial;
          item.colorClass = null;
          item.bomStatus = null;
          item.poQty = null;
          item.poCurr = null;
          item.poVal = null;
          item.poRemarks = null;
          item.idModule = null;
          item.idWmr = null;

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
          include: [{
            model: Wmr,
            attributes: ['id', 'no'],
          }],
          required: false,
        }],
      });

      module.hid = input.hid;
      module.header = input.header;

      if (input.bomEta) {
        await Promise.all(
          module.items.map(async (v) => {
            const item = v;
            item.bomEta = input.bomEta;

            await item.save();
          }),
        );
      }
      const save = await module.save();
      return save;
    }),
    deleteWoModule: isAuthenticated(async (_, { id }) => {
      await WOMODULE.destroy({
        where: { id },
      });

      return id;
    }),
    importWo: isAuthenticated(async (_, { input }, ctx) => {
      const { file } = input;

      const { filename, createReadStream } = await file;
      const stream = createReadStream();

      const tmp = `/tmp/${filename}`;

      return new Promise((resolve, reject) => {
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

              const where = wherePic(0, ctx);
              const Lt = await LT.findOne({
                attributes: ['id', 'ltNo', 'customer'],
                where: { id: lt.id },
                include: [{
                  model: WO,
                  attributes: ['id', 'woNo', 'status'],
                  where,
                }],
              });

              return resolve(Lt);
            } catch (err) {
              if (typeof err === 'string') {
                reject(new ErrorWithProps(err));
              } else {
                reject(new ErrorWithProps(err.message));
              }
            }

            return true;
          });
      });
    }),
    deleteLt: isAuthenticated(async (_, { id }) => {
      await LT.destroy({
        where: { id },
      });

      return id;
    }),
    cloneWo: isAuthenticated(async (_, { input }, ctx) => {
      const {
        id, ltNo, woNo, unit, eta, fill, complete,
      } = input;
      const cAttributes = [
        ...itemAttributes, 'idWo', 'idLt', 'poZone', 'whRemarks', 'prRemarks',
        'rndRemarks', 'hvacRemarks', 'mechanicalRemarks', 'electronicRemarks',
        'fabricationRemarks',
      ];

      let lt = {};
      let wo = {};

      lt = await LT.findOne({
        attributes: ['id'],
        where: { ltNo },
        raw: true,
      });

      if (!lt) {
        const newLT = new LT({ ltNo });
        lt = await newLT.save();
      }

      const oldWo = await WO.findOne({
        attributes: [
          'woNo', 'cat', 'model', 'product', 'pic', 'picName', 'rndic',
          'sgd', 'idr', 'euro', 'gbp', 'myr', 'budget', 'refer',
        ],
        where: { id },
        raw: true,
      });

      const newWO = new WO({
        woNo,
        idLt: lt.id,
        unit,
        cat: oldWo.cat,
        model: oldWo.model,
        product: oldWo.product,
        pic: oldWo.pic,
        picName: oldWo.picName,
        rndic: oldWo.rndic,
        sgd: parseFloat(oldWo.sgd),
        idr: parseInt(oldWo.idr, 10),
        euro: parseFloat(oldWo.euro),
        gbp: parseFloat(oldWo.gbp),
        myr: parseFloat(oldWo.myr),
        budget: parseFloat(oldWo.budget),
        refer: oldWo.woNo,
      });

      wo = await newWO.save();

      const oldModules = await WOMODULE.findAll({
        attributes: ['id', 'hid', 'header'],
        where: { idWo: id },
        raw: true,
      });

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < oldModules.length; i += 1) {
        const newModule = new WOMODULE({
          hid: oldModules[i].hid,
          header: oldModules[i].header,
          idWo: wo.id,
          idLt: lt.id,
        });

        const mod = await newModule.save();

        const oldItems = await WOITEM.findAll({
          attributes: cAttributes,
          where: { idHeader: oldModules[i].id, idWo: id },
          raw: true,
        });

        for (let j = 0; j < oldItems.length; j += 1) {
          let bomQtyBalance = 0;
          let bomQtyStock = 0;
          let bomEta = eta || null;
          let bomQtyRec = 0;
          let bomDateRec = null;
          let bomPoDate = null;
          let bomPoNo = null;
          let poZone = null;
          let poNo = null;
          let bomEtaStatus = null;
          let bomStatus = null;

          const currObj = {
            euro: wo.euro,
            gbp: wo.gbp,
            myr: wo.myr,
            idr: wo.idr,
            sgd: wo.sgd,
          };
          const value = getCurrency(oldItems[j].bomCurrEaC, oldItems[j].bomCurrEaV, currObj);

          if (fill) {
            bomQtyBalance = 0;
            bomQtyStock = unit * oldItems[j].bomQty;
          } else if (complete) {
            bomQtyBalance = oldItems[j]
              .bomQtyStock - ((unit * oldItems[j].bomQty) - oldItems[j].bomQtyRec);
            bomQtyStock = unit * oldItems[j].bomQtyStock;
            bomEta = oldItems[j].bomEta;
            bomQtyRec = oldItems[j].bomQtyRec;
            bomDateRec = oldItems[j].bomDateRec;
            bomPoDate = oldItems[j].bomPoDate;
            bomPoNo = oldItems[j].bomPoNo;
            poZone = oldItems[j].poZone;
            poNo = oldItems[j].poNo;
            bomEtaStatus = oldItems[j].bomEtaStatus;
            bomStatus = oldItems[j].bomStatus;
          } else {
            bomQtyBalance = (unit * oldItems[j].bomQty) * -1;
            bomQtyStock = 0;
          }

          const newItem = new WOITEM({
            bomDescription: oldItems[j].bomDescription,
            bomSpecification: oldItems[j].bomSpecification,
            bomModel: oldItems[j].bomModel,
            bomBrand: oldItems[j].bomBrand,
            bomQty: oldItems[j].bomQty,
            bomUnit: oldItems[j].bomUnit,
            bomQtyRqd: unit * oldItems[j].bomQty,
            bomQtyBalance,
            bomQtyStock,
            bomEta,
            bomQtyRec,
            bomDateRec,
            bomPoDate,
            bomPoNo,
            poZone,
            poNo,
            bomEtaStatus,
            bomStatus,
            bomCurrSizeC: oldItems[j].bomCurrSizeC,
            bomCurrSizeV: oldItems[j].bomCurrSizeV,
            bomCurrEaC: oldItems[j].bomCurrEaC,
            bomCurrEaV: oldItems[j].bomCurrEaV,
            bomUsdEa: value,
            bomUsdUnit: value * oldItems[j].bomQty,
            bomUsdTotal: unit * value * oldItems[j].bomQty,
            bomSupplier: oldItems[j].bomSupplier,
            bomRemarks: oldItems[j].bomRemarks,
            sr: 0,
            yetToPurchase: unit * value * oldItems[j].bomQty,
            idMaterial: oldItems[j].idMaterial,
            idWo: wo.id,
            idLt: lt.id,
            idHeader: mod.id,
          });

          await newItem.save();
        }
      }

      const where = wherePic(0, ctx);
      const Lt = await LT.findOne({
        attributes: ['id', 'ltNo', 'customer'],
        where: { id: lt.id },
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'status'],
          where,
        }],
      });

      return Lt;
    }),
    deleteWo: isAuthenticated(async (_, { id }) => {
      await WO.destroy({
        where: { id },
      });

      return id;
    }),
    validateWoItem: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          let item = {};
          const where = { id: v.id };

          if (v.isMpr) {
            item = await MPRITEM.findOne({
              attributes: itemAttributes,
              where,
              include: [{
                model: MPR,
                attributes: ['id', 'no'],
                required: false,
              }, {
                model: Wmr,
                attributes: ['id', 'no'],
              }],
            });
          } else {
            item = await WOITEM.findOne({
              attributes: itemAttributes,
              where,
              include: [{
                model: Wmr,
                attributes: ['id', 'no'],
              }],
            });
          }

          item.validasi = v.validasi;

          const save = await item.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
    updateWo: isAuthenticated(async (_, { input }) => {
      const wo = await WO.findOne({
        attributes: [
          'id', 'woNo', 'cat', 'model', 'product', 'unit', 'pic', 'picName',
          'rndic', 'budget', 'refer', 'stage', 'status', 'issued',
          'euro', 'gbp', 'myr', 'idr', 'sgd',
        ],
        where: { id: input.id },
        include: [{
          model: LT,
          attributes: ['id', 'ltNo'],
        }],
      });

      if (wo.unit !== input.unit
          || wo.euro !== input.euro
          || wo.gbp !== input.gbp
          || wo.myr !== input.myr
          || wo.idr !== input.idr
          || wo.sgd !== input.sgd) {
        const items = await WOITEM.findAll({
          attributes: [
            ...itemAttributes, 'idWo',
          ],
          where: { idWo: wo.id },
        });

        const currObj = {
          euro: input.euro,
          gbp: input.gbp,
          myr: input.myr,
          idr: input.idr,
          sgd: input.sgd,
        };

        await Promise.all(
          items.map(async (v) => {
            const item = v;
            const value = getCurrency(v.bomCurrEaC, v.bomCurrEaV, currObj);
            const qtyBalance = v.bomQtyStock - ((input.unit * v.bomQty) - v.bomQtyRec);
            const usdTotal = input.unit * value * v.bomQty;

            item.bomQtyBalance = qtyBalance;
            item.bomQtyRqd = input.unit * v.bomQty;
            item.bomUsdEa = value;
            item.bomUsdUnit = value * v.bomQty;
            item.bomUsdTotal = usdTotal;
            item.materialsProcessed = qtyBalance === 0 ? usdTotal : 0;
            item.yetToPurchase = qtyBalance < 0 ? usdTotal : 0;

            Object.assign(v, item);
            await v.save();
          }),
        );
      }

      Object.assign(wo, input);
      wo.picName = pics[input.pic];

      if (input.status === 2) await sendValidatedEmail(wo, input.pic);

      const save = await wo.save();
      return save;
    }),
    validateWo: isAuthenticated(async (_, { id, validated }) => {
      const wo = await WO.findOne({
        attributes: [
          'id', 'woNo', 'status', 'validated', 'product', 'model',
        ],
        where: { id },
        include: [{
          model: LT,
          attributes: ['id', 'ltNo'],
        }],
      });

      if (validated === 1) {
        wo.status = 1;
      } else {
        wo.status = 0;
      }
      wo.validated = validated;

      const save = await wo.save();

      if (validated === 1) await sendApprovedEmail(wo);

      return save;
    }),
    stockItem: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          let item = {};
          const where = { id: v.id };
          const include = [{
            model: Wmr,
            attributes: ['id', 'no'],
          }];

          if (v.isMpr) {
            item = await MPRITEM.findOne({
              attributes: itemAttributes,
              where,
              include,
            });
          } else {
            item = await WOITEM.findOne({
              attributes: itemAttributes,
              where,
              include,
            });
          }

          if (v.type === 0) {
            item.bomQtyBalance = -1 * v.bomQtyRqd;
            item.bomQtyStock = 0;
          } else {
            item.bomQtyBalance = 0;
            item.bomQtyStock = v.bomQtyRqd;
            item.bomQtyRec = 0;
          }

          const save = await item.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
    processMaterials: isAuthenticated(async (_, { id }) => {
      const saved = [];

      const wo = await WO.findOne({
        attributes: [
          'unit', 'euro', 'gbp', 'myr', 'idr', 'sgd',
        ],
        where: { id },
      });

      const currObj = {
        euro: wo.euro,
        gbp: wo.gbp,
        myr: wo.myr,
        idr: wo.idr,
        sgd: wo.sgd,
      };

      const items1 = await WOITEM.findAll({
        attributes: itemAttributes,
        where: {
          [Op.and]: [
            { cancel: 0 },
            { idWo: id },
            { bomQtyBalance: { [Op.gte]: 0 } },
          ],
        },
        include: [{
          model: OUTSTANDINGPO,
          attributes: ['poStatus', 'poArrival', 'poNo'],
        }, {
          model: Wmr,
          attributes: ['id', 'no'],
        }],
      });

      const items2 = await MPRITEM.findAll({
        attributes: itemAttributes,
        where: {
          [Op.and]: [
            { cancel: 0 },
            { idWo: id },
            { bomQtyBalance: { [Op.gte]: 0 } },
          ],
        },
        include: [{
          model: MPR,
          attributes: ['id', 'no'],
        }, {
          model: OUTSTANDINGPO,
          attributes: ['poStatus', 'poArrival', 'poNo'],
        }, {
          model: Wmr,
          attributes: ['id', 'no'],
        }],
      });

      if (items2.length) {
        items1.push(...items2);
      }

      await Promise.all(
        items1.map(async (v) => {
          const item = v;
          const unit = item.sr ? 1 : wo.unit;
          const value = getCurrency(item.bomCurrEaC, item.bomCurrEaV, currObj);
          const qtyBalance = item.bomQtyStock - ((unit * item.bomQty) - item.bomQtyRec);
          const usdTotal = unit * value * item.bomQty;

          item.materialsProcessed = qtyBalance === 0 ? usdTotal : 0;
          item.yetToPurchase = qtyBalance < 0 ? usdTotal : 0;

          Object.assign(v, item);
          const save = await v.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
  },
};

module.exports = { resolvers, itemAttributes };
