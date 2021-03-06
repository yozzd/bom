const fs = require('fs');
const fetch = require('node-fetch');
const { ErrorWithProps } = require('mercurius');
const { GraphQLUpload } = require('graphql-upload');
const XLSX = require('xlsx');
const { format } = require('date-fns');
const sequelize = require('../../config/db');
const { pssUrl, pssAuth } = require('../../config');
const {
  WO, WOMODULE, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
  Wmr,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const {
  whereStatus, whereUser, oneMpr, getNotif, secName,
} = require('./methods');
const { itemAttributes } = require('../bom/resolvers');

const mprAttributes = [
  'id', 'status', 'no', 'woNo', 'model', 'product', 'projectName',
  'unit', 'category', 'dor', 'idWo', 'requestorSection',
  'requestorName', 'requestorTimestamp', 'managerApproved',
  'managerTimestamp', 'whApproved', 'whTimestamp', 'bomApproved',
  'bomTimestamp', 'attachment', 'remark', 'packing', 'hold', 'cancel',
];

const attributes = [
  'idMaterial', 'bomDescription', 'bomSpecification', 'bomModel', 'bomBrand',
  'bomQty', 'bomUnit', 'bomQtyRqd', 'bomQtyBalance', 'bomQtyStock', 'bomEta',
  'bomQtyRec', 'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
  'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal', 'materialsProcessed',
  'yetToPurchase', 'bomSupplier', 'bomPoDate', 'bomPoNo', 'bomRemarks', 'priority',
  'bomEtaStatus', 'sr', 'isMpr', 'packing', 'hold', 'cancel', 'idHeader',
  'idModule', 'colorClass',
];

const dateNow = () => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  return new Date(new Date() - tzoffset).toISOString();
};

const resolvers = {
  Upload: GraphQLUpload,
  MPR: {
    attachmentCheck: ({ id, attachment }) => {
      try {
        fs.existsSync(`static/attachment/${id}/${attachment}`);
        return true;
      } catch (err) {
        return false;
      }
    },
  },
  Query: {
    getAllMPR: isAuthenticated(async (_, { status }, ctx) => {
      const where = whereStatus(status);

      const items = await MPRITEM.findAll({
        attributes: ['idMpr'],
        where,
        group: ['idMpr'],
        required: false,
        include: [{
          model: OUTSTANDINGPO,
          attributes: ['poStatus', 'poArrival', 'poNo'],
          required: false,
        }],
        raw: true,
      });

      const whereU = await whereUser(ctx, items, status);
      const mpr = await MPR.findAll({
        attributes: mprAttributes,
        order: [
          ['category', 'DESC'],
          ['dor', 'DESC'],
        ],
        where: whereU,
        include: [{
          model: WO,
          attributes: ['idLt'],
        }],
      });

      return mpr;
    }),
    getOneMPR: isAuthenticated(async (_, { id }) => {
      const mpr = await oneMpr(id);
      return mpr;
    }),
    getMprModules: isAuthenticated(async (_, { idMpr }) => {
      const modules = await MPRMODULE.findAll({
        attributes: ['id', 'moduleChar', 'moduleName'],
        where: { idMpr },
      });

      return modules;
    }),
    getMprNotifications: isAuthenticated(async (_, { date }, ctx) => {
      const notif = await getNotif(date, ctx);

      return notif;
    }),
  },
  Mutation: {
    createMpr: isAuthenticated(async (_, { input }, ctx) => {
      const { idLt, ltNo, ...obj } = input;

      const no = ltNo.split(' ').join('+');
      const headers = { Authorization: pssAuth };
      const info = await fetch(`${pssUrl}${no}`, { headers });
      const t = await info.json();
      obj.projectName = t.customer_name || 'PT. LABTECH PENTA INTERNATIONAL';

      const { group, section } = ctx.req.user;
      obj.requestorId = group;
      obj.requestorSection = section;
      obj.requestorName = secName(section);
      obj.requestorTimestamp = dateNow();

      const newMpr = new MPR(obj);
      const save = await newMpr.save();
      save.wo = { idLt };

      return save;
    }),
    updateMpr: isAuthenticated(async (_, { input }) => {
      const {
        idLt, file, remAttach, ...obj
      } = input;

      const mpr = await MPR.findOne({
        attributes: mprAttributes,
        where: { id: obj.id },
      });

      Object.assign(mpr, obj);

      const dir = `static/attachment/${obj.id}`;
      if (file) {
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
            .on('finish', () => {
              try {
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

                fs.copyFileSync(tmp, `${dir}/${filename}`);

                mpr.attachment = filename;

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
      }

      if (remAttach) {
        fs.unlinkSync(`${dir}/${mpr.attachment}`);
        mpr.attachment = null;
      }

      const save = await mpr.save();
      save.wo = { idLt };

      return save;
    }),
    deleteMpr: isAuthenticated(async (_, { input }) => {
      await Promise.all(
        input.map(async (v) => {
          await MPR.destroy({
            where: { id: v.id },
          });
        }),
      );

      return input;
    }),
    addMprItems: isAuthenticated(async (_, { input }) => {
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
          item.hold = 0;
          item.cancel = 0;
          item.isMpr = 1;
          item.idMpr = v.idMpr;
          item.idWo = v.idWo;
          item.idHeader = null;
          item.idModule = v.idModule;
          item.idMaterial = v.idMaterial;
          item.colorClass = null;
          item.bomStatus = null;
          item.poQty = null;
          item.poCurr = null;
          item.poVal = null;
          item.poRemarks = null;
          item.idWmr = null;
          item.timestamp = dateNow();

          const newItem = new MPRITEM(item);
          const save = await newItem.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
    addMprModule: isAuthenticated(async (_, { input }) => {
      const newModule = new MPRMODULE(input);
      const save = await newModule.save();
      save.items = [];

      return save;
    }),
    updateMprModule: isAuthenticated(async (_, { input }) => {
      const module = await MPRMODULE.findOne({
        attributes: ['id', 'moduleChar', 'moduleName', 'idMpr'],
        where: { id: input.id },
        include: [{
          model: MPRITEM,
          attributes,
          required: false,
          include: [{
            model: WOMODULE,
            attributes: ['id', 'hid', 'header'],
            required: false,
          }, {
            model: Wmr,
            attributes: ['id', 'no'],
          }],
        }],
      });

      module.moduleChar = input.moduleChar;
      module.moduleName = input.moduleName;
      const save = await module.save();
      return save;
    }),
    moveToModule: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          const item = await MPRITEM.findOne({
            attributes: itemAttributes,
            where: { id: v.id },
          });

          Object.assign(item, v);
          const save = await item.save();
          save.oIdModule = v.oIdModule;
          saved.push(save);
        }),
      );

      return saved;
    }),
    approveMpr: isAuthenticated(async (_, { input }) => {
      const mpr = await MPR.findOne({
        attributes: mprAttributes,
        where: { id: input.id },
        include: [{
          model: WO,
          attributes: ['idLt'],
        }],
      });

      if (input.type === 'manager') {
        mpr.managerApproved = 1;
        mpr.managerTimestamp = dateNow();
      } else if (input.type === 'wh') {
        mpr.whApproved = 1;
        mpr.whTimestamp = dateNow();
      } else {
        mpr.bomApproved = 1;
        mpr.bomTimestamp = dateNow();

        if (mpr.no === '######') {
          const no = await MPR.findAll({
            attributes: [
              [sequelize.literal('MAX(no) + 1'), 'no'],
            ],
            raw: true,
          });

          const p = parseInt(no[0].no, 10);
          const n = p < 10000 ? `0${p}` : p;

          mpr.no = n;
        }
      }

      const save = await mpr.save();
      return save;
    }),
    disapproveMpr: isAuthenticated(async (_, { input }) => {
      const mpr = await MPR.findOne({
        attributes: mprAttributes,
        where: { id: input.id },
        include: [{
          model: WO,
          attributes: ['idLt'],
        }],
      });

      if (input.type === 'manager') {
        mpr.managerApproved = 0;
        mpr.managerTimestamp = '0000-00-00 00:00:00';
      } else if (input.type === 'wh') {
        mpr.whApproved = 0;
        mpr.whTimestamp = '0000-00-00 00:00:00';
      } else {
        mpr.bomApproved = 0;
        mpr.bomTimestamp = '0000-00-00 00:00:00';

        mpr.no = '######';
      }

      const save = await mpr.save();
      return save;
    }),
    deleteModule: isAuthenticated(async (_, { id }) => {
      await MPRMODULE.destroy({
        where: { id },
      });

      await MPRITEM.destroy({
        where: { idModule: id },
      });

      return id;
    }),
    importMpr: isAuthenticated(async (_, { input }, ctx) => {
      const { section } = ctx.req.user;
      const { idWo, idMpr, file } = input;

      const mpr = await MPR.findOne({
        attributes: [
          'id', 'unit',
        ],
        where: { id: idMpr },
        raw: true,
      });

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

              const range = XLSX.utils.decode_range(ws['!ref']);

              let idModule = null;
              /* eslint-disable no-await-in-loop */
              for (let R = 9; R <= range.e.r; R += 1) {
                if (ws[`A${R}`] && ws[`A${R}`].v === 'MRP BOM  IN-CHARGE : ') break;
                else if (ws[`A${R}`] && ws[`C${R}`] && ws[`I${R}`] && ws[`I${R}`].v === 0) {
                  const newModule = new MPRMODULE({
                    moduleChar: ws[`A${R}`].v,
                    moduleName: ws[`C${R}`].v,
                    idMpr,
                  });
                  const save = await newModule.save();
                  idModule = save.id;
                } else if (ws[`A${R}`] && ws[`C${R}`] && ws[`I${R}`] && ws[`I${R}`].v > 0) {
                  const bomQty = ws[`G${R}`] ? ws[`G${R}`].v : 0;
                  let bomQtyStock = 0;
                  let bomQtyBalance = 0;

                  let poZone = null;
                  let poNo = null;

                  if (ws[`L${R}`] && section === 513) {
                    bomQtyBalance = (ws[`L${R}`].v * mpr.unit) - (bomQty * mpr.unit);
                    bomQtyStock = ws[`L${R}`].v * mpr.unit;
                    packing = 1;
                  } else if (ws[`L${R}`] && section !== 513) {
                    bomQtyBalance = ws[`L${R}`].v - (mpr.unit * bomQty);
                    bomQtyStock = ws[`L${R}`].v;
                    packing = 0;
                  } else {
                    bomQtyBalance = 0 - (mpr.unit * bomQty);
                    packing = 0;
                  }

                  if (ws[`Y${R}`] && ws[`Y${R}`].v) {
                    poZone = (ws[`Y${R}`].v).split('.')[0].trim();
                    poNo = (ws[`Y${R}`].v).split('.')[1].trim();
                  }

                  const newItem = new MPRITEM({
                    bomDescription: ws[`A${R}`] ? ws[`C${R}`].v : null,
                    bomSpecification: ws[`D${R}`] ? ws[`D${R}`].v : '',
                    bomModel: ws[`E${R}`] ? ws[`E${R}`].v : null,
                    bomBrand: ws[`F${R}`] ? ws[`F${R}`].v : null,
                    bomQty,
                    bomQtyBalance,
                    bomUnit: ws[`H${R}`] ? ws[`H${R}`].v : null,
                    bomQtyStock,
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
                    packing,
                    idMpr,
                    idWo,
                    idModule,
                    idWmr: null,
                    timestamp: dateNow(),
                  });
                  await newItem.save();
                }
              }

              const rmpr = await oneMpr(idMpr);

              return resolve(rmpr);
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
  },
};

module.exports = { resolvers, dateNow };
