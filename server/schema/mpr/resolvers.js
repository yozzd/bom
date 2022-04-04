const fs = require('fs');
const { Op } = require('sequelize');
const {
  WO, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { isAuthenticated } = require('../auth/service');
const { whereStatus, whereUser } = require('./methods');

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
    attachmentCheck: async ({ id, attachment }) => {
      try {
        await fs.existsSync(`static/attachment/${id}/${attachment}`);
        return true;
      } catch (err) {
        return false;
      }
    },
    // modules: async ({ id }) => {
    //   const module = await MPRMODULE.findAll({
    //     attributes: ['id', 'moduleChar', 'moduleName'],
    //     where: { idMpr: id },
    //     required: false,
    //   });

    //   if (module.length) return module;
    //   return [{
    //     id: 0, moduleChar: '', moduleName: '', idMpr: id,
    //   }];
    // },
  },
  // MPRMODULE: {
  //   items: async ({ id, idMpr }) => {
  //     let item = [];
  //     const attributes = [
  //       'id', 'idMaterial', 'bomDescription', 'bomSpecification',
  //       'bomModel', 'bomBrand', 'bomQty', 'bomUnit', 'bomQtyRqd',
  //       'bomQtyBalance', 'bomQtyStock', 'bomEta', 'bomQtyRec',
  //       'bomDateRec', 'bomCurrSizeC', 'bomCurrSizeV', 'bomCurrEaC',
  //       'bomCurrEaV', 'bomUsdEa', 'bomUsdUnit', 'bomUsdTotal',
  //       'materialsProcessed', 'yetToPurchase', 'bomSupplier',
  //       'bomPoDate', 'bomPoNo', 'bomRemarks', 'priority', 'bomEtaStatus',
  //       'validasi', 'hold', 'cancel', 'colorClass',
  //     ];

  //     const include = [{
  //       model: OUTSTANDINGPO,
  //       attributes: ['poStatus', 'poArrival', 'poNo'],
  //       required: false,
  //     }];

  //     if (id) {
  //       item = await MPRITEM.findAll({
  //         attributes,
  //         where: {
  //           [Op.and]: [
  //             { idModule: id },
  //             { idHeader: { [Op.is]: null } },
  //           ],
  //         },
  //         required: false,
  //         include,
  //       });
  //     } else {
  //       item = await MPRITEM.findAll({
  //         attributes,
  //         where: {
  //           [Op.and]: [
  //             { idMpr },
  //             { idHeader: { [Op.is]: null } },
  //           ],
  //         },
  //         required: false,
  //         include,
  //       });
  //     }

  //     return item;
  //   },
  // },
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
        attributes: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing', 'requestorSection',
          'requestorName', 'requestorTimestamp', 'managerApproved',
          'managerTimestamp', 'whApproved', 'whTimestamp', 'bomApproved',
          'bomTimestamp', 'attachment', 'remark',
        ],
        order: [
          ['category', 'DESC'],
          ['dor', 'ASC'],
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
      const mpr = await MPR.findOne({
        attributes: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing', 'requestorName',
        ],
        where: { id },
        required: false,
        include: [{
          model: MPRMODULE,
          attributes: ['id', 'moduleChar', 'moduleName'],
          required: false,
          include: [{
            model: MPRITEM,
            attributes: itemAttributes,
            where: { cancel: 0 },
            required: false,
          }],
        }, {
          model: MPRITEM,
          attributes: itemAttributes,
          where: {
            [Op.and]: [
              { cancel: 0 },
              { idModule: { [Op.is]: null } },
            ],
          },
          required: false,
        }],
      });

      return mpr;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
