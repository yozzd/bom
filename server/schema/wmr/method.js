const fs = require('fs');
const PdfPrinter = require('pdfmake');
const { ErrorWithProps } = require('mercurius');
const sequelize = require('../../config/db');
const {
  Wmr, WO, WOITEM, MPRITEM,
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
      'id', 'no', 'requestedBy', 'authorizedBy', 'issuedBy', 'receivedBy',
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

const printWmrDocument = async (wmr) => {
  try {
    const docDefinition = {
      content: [
        {
          columns: [
            { text: 'test1' },
            { text: 'test1' },
            { text: 'test1' },
          ],
        },
      ],
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

module.exports = { wmrSerial, oneWmr, printWmrDocument };
