const fs = require('fs');
const flow = require('lodash/fp/flow');
const groupBy = require('lodash/fp/groupBy');
const map = require('lodash/fp/map').convert({ cap: false });
const { format } = require('date-fns');
const PdfPrinter = require('pdfmake');
const { ErrorWithProps } = require('mercurius');
const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const {
  Wmr, WO, WOITEM, WOMODULE, MPR, MPRITEM, MPRMODULE,
} = require('../relations');
const { itemAttributes } = require('../bom/resolvers');

const fonts = {
  Roboto: {
    normal: 'static/font/Roboto-Regular.ttf',
    bold: 'static/font/Roboto-Medium.ttf',
    bolditalics: 'static/font/Roboto-MediumItalic.ttf',
  },
  Times: {
    normal: 'static/font/times-new-roman.ttf',
    bold: 'static/font/times-new-roman-bold.ttf',
    italics: 'static/font//times-new-roman-italic.ttf',
    bolditalics: 'static/font/times-new-roman-bold-italic.ttf',
  },
};
const printer = new PdfPrinter(fonts);

const wmrSerial = (count) => {
  if (count < 10) return `00000${count}`;
  if (count < 100) return `0000${count}`;
  if (count < 1000) return `000${count}`;
  if (count < 10000) return `00${count}`;
  if (count < 100000) return `0${count}`;
  return count;
};

const oneWmr = async (id) => {
  const wmr = await Wmr.findOne({
    attributes: [
      'id', 'no', 'requestedBy', 'requestedById', 'authorizedBy', 'authorizedById',
      'issuedBy', 'issuedById', 'receivedBy', 'receivedById',
    ],
    where: { id },
    include: [{
      model: WOITEM,
      attributes: [
        ...itemAttributes,
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM MaterialStock WHERE MaterialCD = items.id_material)'), 'stock1'],
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM lokasimaterial WHERE MaterialCD = items.id_material AND type_alokasi = \'stock\')'), 'stock2'],
        [sequelize.literal('(SELECT IFNULL(SUM(request), 0) FROM wmr_detail_consumable WHERE MaterialCD = items.id_material)'), 'stock3'],
      ],
      include: [{
        model: Wmr,
        attributes: ['id', 'no'],
      }],
    }, {
      model: WO,
      attributes: ['id', 'woNo', 'idLt'],
    }],
    group: ['items.id'],
  });

  const wmrMpr = await Wmr.findOne({
    attributes: [
      'id', 'no', 'requestedBy', 'authorizedBy',
    ],
    where: { id },
    include: [{
      model: MPRITEM,
      attributes: [
        ...itemAttributes,
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM MaterialStock WHERE MaterialCD = items.id_material)'), 'stock1'],
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM lokasimaterial WHERE MaterialCD = items.id_material AND type_alokasi = \'stock\')'), 'stock2'],
        [sequelize.literal('(SELECT IFNULL(SUM(request), 0) FROM wmr_detail_consumable WHERE MaterialCD = items.id_material)'), 'stock3'],
      ],
      include: [{
        model: Wmr,
        attributes: ['id', 'no'],
      }],
    }],
  });

  wmr.items.push(...wmrMpr.items);

  return wmr;
};

const oneWmrPrint = async (id) => {
  const wmrQuery1 = await Wmr.findOne({
    attributes: [
      'id', 'no', 'requestedBy', 'requestedById', 'authorizedBy', 'authorizedById',
      'issuedBy', 'issuedById', 'receivedBy', 'receivedById',
    ],
    where: { id },
    include: [{
      model: WOITEM,
      attributes: [
        ...itemAttributes,
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM MaterialStock WHERE MaterialCD = items.id_material)'), 'stock1'],
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM lokasimaterial WHERE MaterialCD = items.id_material AND type_alokasi = \'stock\')'), 'stock2'],
        [sequelize.literal('(SELECT IFNULL(SUM(request), 0) FROM wmr_detail_consumable WHERE MaterialCD = items.id_material)'), 'stock3'],
      ],
      include: [{
        model: WOMODULE,
        attributes: ['id', 'hid', 'header'],
      }, {
        model: Wmr,
        attributes: ['id', 'no'],
      }],
    }, {
      model: WO,
      attributes: ['id', 'woNo', 'idLt'],
    }],
  });

  const wmrQuery2 = await Wmr.findOne({
    attributes: [
      'id', 'no', 'requestedBy', 'requestedById', 'authorizedBy', 'authorizedById',
      'issuedBy', 'issuedById', 'receivedBy', 'receivedById',
    ],
    where: { id },
    include: [{
      model: MPRITEM,
      where: { idHeader: { [Op.not]: null } },
      attributes: [
        ...itemAttributes,
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM MaterialStock WHERE MaterialCD = items.id_material)'), 'stock1'],
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM lokasimaterial WHERE MaterialCD = items.id_material AND type_alokasi = \'stock\')'), 'stock2'],
        [sequelize.literal('(SELECT IFNULL(SUM(request), 0) FROM wmr_detail_consumable WHERE MaterialCD = items.id_material)'), 'stock3'],
      ],
      include: [{
        model: WOMODULE,
        attributes: ['id', 'hid', 'header'],
      }, {
        model: Wmr,
        attributes: ['id', 'no'],
      }],
    }],
  });

  wmrQuery1.items.push(...wmrQuery2.items);

  const wmrMprQuery = await Wmr.findOne({
    attributes: ['id'],
    where: { id },
    include: [{
      model: MPRITEM,
      where: { idHeader: { [Op.is]: null } },
      attributes: [
        ...itemAttributes,
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM MaterialStock WHERE MaterialCD = items.id_material)'), 'stock1'],
        [sequelize.literal('(SELECT IFNULL(SUM(qty), 0) FROM lokasimaterial WHERE MaterialCD = items.id_material AND type_alokasi = \'stock\')'), 'stock2'],
        [sequelize.literal('(SELECT IFNULL(SUM(request), 0) FROM wmr_detail_consumable WHERE MaterialCD = items.id_material)'), 'stock3'],
      ],
      include: [{
        model: MPRMODULE,
        attributes: ['id', 'moduleChar', 'moduleName'],
      }, {
        model: MPR,
        attributes: ['id', 'no'],
      }, {
        model: Wmr,
        attributes: ['id', 'no'],
      }],
    }],
  });

  const { items, ...wmr } = wmrQuery1.dataValues;

  const modWo = flow(
    groupBy('idHeader'),
    map((value) => ({
      module: {
        id: value[0].module ? value[0].module.id : null,
        hid: value[0].module ? value[0].module.hid : null,
        header: value[0].module ? value[0].module.header : null,
      },
      items: value,
    })),
  )(items);

  const modMpr = flow(
    groupBy((value) => [value.idModule, value.mpr.id]),
    map((value) => ({
      module: {
        id: value[0].module ? value[0].module.id : null,
        moduleChar: value[0].module ? value[0].module.moduleChar : null,
        moduleName: value[0].module ? value[0].module.moduleName : null,
      },
      items: value,
    })),
  )(wmrMprQuery.items);

  return { wmr, modWo, modMpr };
};

const printWmrDocument = async (id) => {
  try {
    const { wmr, modWo, modMpr } = await oneWmrPrint(id);
    let mprNo = '';

    const arrTbl = [
      [{ text: 'No', rowSpan: 2, alignment: 'center' }, { text: 'Material CD', rowSpan: 2, alignment: 'center' }, { text: 'Material Name', rowSpan: 2, alignment: 'center' }, { text: 'Material Desc.', rowSpan: 2, alignment: 'center' }, { text: 'WO No.', rowSpan: 2, alignment: 'center' }, { text: 'Quantity', colSpan: 2, alignment: 'center' }, '', { text: 'Remarks', colSpan: 2, alignment: 'center' }, ''],
      ['', '', '', '', '', { text: 'Request', alignment: 'center' }, { text: 'Issued', alignment: 'center' }, { text: 'Production', alignment: 'center' }, { text: 'Warehouse', alignment: 'center' }],
    ];

    const woNo = await wmr.wo.woNo;

    modWo.map((m) => {
      arrTbl.push([{ text: m.module.hid, alignment: 'center' }, { text: m.module.header, colSpan: 8 }, '', '', '', '', '', '', '']);

      m.items.map(async (v, i) => {
        arrTbl.push([{ text: `${i + 1}`, alignment: 'center' }, { text: v.idMaterial, alignment: 'center' }, v.bomDescription, v.bomSpecification, woNo, { text: `${v.bomQtyRqd} ${v.bomUnit}`, alignment: 'center' }, { text: v.qtyIssued ? `${v.qtyIssued} ${v.bomUnit}` : '', alignment: 'center' }, v.wmrPrRemarks, v.wmrWhRemarks]);
        return true;
      });
      return true;
    });

    if (modMpr.length) {
      arrTbl.push([{ text: '', colSpan: 9 }, '', '', '', '', '', '', '', '']);

      modMpr.map((m) => {
        if (mprNo !== m.items[0].mpr.no) {
          arrTbl.push([{ text: 'MPR', alignment: 'center' }, { text: m.items[0].mpr.no, colSpan: 8 }, '', '', '', '', '', '', '']);
        }
        mprNo = m.items[0].mpr.no;

        if (m.module.id) {
          arrTbl.push([{ text: m.module.moduleChar, alignment: 'center' }, { text: m.module.moduleName, colSpan: 8 }, '', '', '', '', '', '', '']);
        }
        m.items.map(async (v, i) => {
          arrTbl.push([{ text: `${i + 1}`, alignment: 'center' }, { text: v.idMaterial, alignment: 'center' }, v.bomDescription, v.bomSpecification, woNo, { text: `${v.bomQtyRqd} ${v.bomUnit}`, alignment: 'center' }, { text: v.qtyIssued ? `${v.qtyIssued} ${v.bomUnit}` : '', alignment: 'center' }, v.wmrPrRemarks, v.wmrWhRemarks]);
          return true;
        });
        return true;
      });
    }

    const docDefinition = {
      content: [
        {
          columns: [
            {
              stack: [
                { image: 'static/images/stempel.jpg', width: 60, absolutePosition: { x: 150, y: 15 } },
                {
                  width: 'auto',
                  table: {
                    widths: [50, 5, 70],
                    heights: 12,
                    body: [
                      [{ text: 'Approved by', border: [true, true, false, true] }, { text: ':', border: [false, true, false, true] }, { text: '', border: [false, true, true, true] }],
                      [{ text: 'Originator', border: [true, false, false, true] }, { text: ':', border: [false, false, false, true] }, { text: 'MRP-WH', border: [false, false, true, true] }],
                      [{ text: 'Doc. No.', border: [true, false, false, true] }, { text: ':', border: [false, false, false, true] }, { text: 'Frm-213-001', border: [false, false, true, true] }],
                      [{ text: 'Date.', border: [true, false, false, true] }, { text: ':', border: [false, false, false, true] }, { text: '05/05/2008', border: [false, false, true, true] }],
                      [{ text: 'Version.', border: [true, false, false, true] }, { text: ':', border: [false, false, false, true] }, { text: '2', border: [false, false, true, true] }],
                    ],
                  },
                },
              ],
            },
            {
              width: 200, text: 'WAREHOUSE MATERIAL REQUISITION', alignment: 'center', fontSize: 12, bold: true,
            },
            {
              width: 'auto',
              style: { fontSize: 8 },
              table: {
                widths: [50, 5, 70],
                heights: 12,
                body: [
                  [{
                    text: 'Stock Card', colSpan: 3, alignment: 'center', border: [true, true, true, false],
                  }, '', ''],
                  [{ text: '', border: [true, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, true, false] }],
                  [{ text: '......', alignment: 'center', border: [true, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '........', alignment: 'center', border: [false, false, true, false] }],
                  [{ text: '(Initial)', alignment: 'center', border: [true, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '(Date)', alignment: 'center', border: [false, false, true, false] }],
                  [{ text: 'WMR No.', border: [true, true, false, true] }, { text: ':', border: [false, true, false, true] }, { text: wmr.no, border: [false, true, true, true] }],
                ],
              },
            },
          ],
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            widths: [20, 50, 80, 80, 50, 40, 40, 45, 45],
            headerRows: 2,
            heights: 12,
            body: arrTbl,
          },
        },
        {
          margin: [0, 40, 0, 0],
          text: `Batam, ${format(new Date(), 'dd-MM-yyyy')}`,
          alignment: 'right',
        },
        {
          margin: [0, 40, 0, 0],
          table: {
            widths: [120, 260, 120],
            heights: [36, 12, 12, 36, 12, 12],
            body: [
              [{ text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }],
              [{ text: wmr.issuedBy ? `${wmr.issuedById} ${wmr.issuedBy}` : '', alignment: 'center', border: [false, false, false, true] }, { text: '', border: [false, false, false, false] }, { text: `${wmr.requestedById} ${wmr.requestedBy}`, alignment: 'center', border: [false, false, false, true] }],
              [{ text: 'Issued By', alignment: 'center', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: 'Requested By', alignment: 'center', border: [false, false, false, false] }],
              [{ text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }],
              [{ text: wmr.receivedById ? `${wmr.receivedById} ${wmr.receivedBy}` : '', alignment: 'center', border: [false, false, false, true] }, { text: '', border: [false, false, false, false] }, { text: `${wmr.authorizedById} ${wmr.authorizedBy}`, alignment: 'center', border: [false, false, false, true] }],
              [{ text: 'Received By', alignment: 'center', border: [false, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: 'Authorized By', alignment: 'center', border: [false, false, false, false] }],
            ],
          },
        },
      ],
      defaultStyle: {
        fontSize: 8,
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(fs.createWriteStream(`static/report/${wmr.no}.pdf`));
      pdfDoc.on('end', () => {
        resolve({ status: 1 });
      });
      pdfDoc.end();
    });
  } catch (err) {
    if (typeof err === 'string') {
      throw new ErrorWithProps(err);
    } else {
      throw new ErrorWithProps(err.message);
    }
  }
};

const getNotif = (async (date, ctx) => {
  const { section } = ctx.req.user;

  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const fdate = new Date(new Date(date) - tzoffset).toISOString();

  let where = {};

  if (section === 213) {
    where = {
      [Op.and]: [
        { authorizedByTimestamp: { [Op.gt]: fdate } },
        { authorizedByApproved: 1 },
      ],
    };
  } else {
    where = {
      [Op.and]: [
        { requestedByTimestamp: { [Op.gt]: fdate } },
        { requestedBy: { [Op.not]: null } },
      ],
    };
  }

  const wmr = await Wmr.findAll({
    attributes: [
      'id', 'no', 'requestedBy', 'requestedByTimestamp', 'authorizedBy', 'authorizedByTimestamp',
      'issuedBy', 'issuedByTimestamp',
    ],
    where,
  });

  return wmr;
});

module.exports = {
  wmrSerial, oneWmr, printWmrDocument, getNotif,
};
