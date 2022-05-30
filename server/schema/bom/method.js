require('dotenv').config();
const fs = require('fs');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');
const { ErrorWithProps } = require('mercurius');
const { Op } = require('sequelize');

const wherePic = (status, ctx) => {
  const { group, department, isManager } = ctx.req.user;
  let where = null;

  if (group === 15 || (department === 170 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [2, 8] } },
      ],
    };
  } else if (group === 16 || (department === 120 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [3, 8] } },
      ],
    };
  } else if (group === 17 || (department === 110 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [1, 8] } },
      ],
    };
  } else if (group === 19 || (department === 320 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 9 },
      ],
    };
  } else if (group === 20 || (department === 140 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 4 },
      ],
    };
  } else if (group === 21 || (department === 510 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [5, 6] } },
      ],
    };
  } else if (group === 22 || (department === 140 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 7 },
      ],
    };
  } else if (group === 25 || (department === 130 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 10 },
      ],
    };
  } else {
    where = { status };
  }

  return where;
};

const getCurrency = (curr, val, currObj) => {
  const {
    euro, gbp, myr, idr, sgd,
  } = currObj;

  if (curr === 'SGD') return val / sgd;
  if (curr === 'RP') return val / idr;
  if (curr === 'EURO') return val / euro;
  if (curr === 'GBP') return val / gbp;
  if (curr === 'MYR') return val / myr;
  return val;
};

const sendApprovedEmail = async (wo) => {
  try {
    const str = wo.woNo.split('-')[0];
    const customer = await wo.lt.customer;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    let html = '';
    html += '<div>Dear All,</div>';
    html += '<div>Berikut ini adalah informasi BOM Work Order Web System (BOM > Filter > Close):</div>';
    html += '<table style="font-family: \'courier new\';">';
    html += '<tr>';
    html += `<td>Project</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.lt.ltNo} - ${customer.name}</td>`;
    html += '</tr>';
    html += '<tr>';
    html += `<td>WO</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.woNo}</td>`;
    html += '</tr>';
    html += '<tr>';
    html += `<td>Product Name</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.product}</td>`;
    html += '</tr>';
    html += '<tr>';
    html += `<td>Model</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.model}</td>`;
    html += '</tr>';
    html += '</table>';
    html += '<div>BOM sudah valid (Approved by Incharge Manager)</div>';
    html += '<div>Silahkan digunakan sebagai referensi</div>';

    let to = process.env.TO2;
    let cc = [];

    if (str === 'WB') {
      to = process.env.TO1;
      cc = process.env.CC1;
    }

    const message = {
      from: process.env.FROM,
      to,
      cc,
      subject: 'Validated WO',
      html,
    };

    const info = await transporter.sendMail(message);

    return info;
  } catch (err) {
    if (typeof err === 'string') {
      throw new ErrorWithProps(err);
    } else {
      throw new ErrorWithProps(err.message);
    }
  }
};

const sendValidatedEmail = async (wo, pic) => {
  try {
    const str = wo.woNo.split('-')[0];
    const customer = await wo.lt.customer;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    let html = '';
    html += '<div>Dear All,</div>';
    html += '<div>Berikut ini adalah informasi BOM Work Order di Web System (BOM > Filter > Validasi Approval):</div>';
    html += '<table style="font-family: \'courier new\';">';
    html += '<tr>';
    html += `<td>Project</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.lt.ltNo} - ${customer.name}</td>`;
    html += '</tr>';
    html += '<tr>';
    html += `<td>WO</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.woNo}</td>`;
    html += '</tr>';
    html += '<tr>';
    html += `<td>Product Name</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.product}</td>`;
    html += '</tr>';
    html += '<tr>';
    html += `<td>Model</td><td style="padding-left: 20px; padding-right: 5px;">:</td><td style="color: rgb(0, 0, 255);">${wo.model}</td>`;
    html += '</tr>';
    html += '</table>';
    html += '<div>Bahwa BOM sudah dapat direview untuk Validasi Approval oleh Production Incharge Manager</div>';

    let to = null;
    let cc = process.env.CC3;

    if (str === 'WB') {
      to = process.env.TO3;
      cc = process.env.CC2;
    }

    if (pic === 1) {
      to = process.env.TO4;
    } else if (pic === 2) {
      to = process.env.TO5;
    } else if (pic === 3) {
      to = process.env.TO6;
    } else if (pic === 4 || pic === 7) {
      to = process.env.TO7;
    } else if (pic === 5 || pic === 6) {
      to = process.env.TO8;
    } else if (pic === 8) {
      to = process.env.TO9;
    }

    const message = {
      from: process.env.FROM,
      to,
      cc,
      subject: 'Validated WO',
      html,
    };

    const info = await transporter.sendMail(message);

    return info;
  } catch (err) {
    if (typeof err === 'string') {
      throw new ErrorWithProps(err);
    } else {
      throw new ErrorWithProps(err.message);
    }
  }
};

const genWo = async (wo, mpr) => {
  try {
    const dir = 'static/report';
    let len = 100;

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const wb = {
      SheetNames: ['Master'],
      Sheets: {
        Master: {
          '!ref': `A1:Z${len}`,
          A1: { t: 's', v: 'BILL OF MATERIAL' },
          E1: { t: 's', v: `${wo.lt.ltNo}` },
          A2: { t: 's', v: `Cat: ${wo.cat}` },
          E2: { t: 's', v: `WO: ${wo.woNo}` },
          A3: { t: 's', v: `Model: ${wo.model}` },
          E3: { t: 's', v: `Total: ${wo.unit} Units` },
          A4: { t: 's', v: `Product Name: ${wo.product}` },
          A8: { t: 's', v: 'No' },
          C8: { t: 's', v: 'Material' },
          C9: { t: 's', v: 'Description' },
          D9: { t: 's', v: 'Specification' },
          E9: { t: 's', v: 'Model' },
          F9: { t: 's', v: 'Brand' },
          G8: { t: 's', v: 'Qty / Unit' },
          I8: { t: 's', v: 'Qty Rqd' },
          J8: { t: 's', v: 'Qty Balance' },
          L8: { t: 's', v: 'Stock Qty W/H' },
          M8: { t: 's', v: 'ETA' },
          N8: { t: 's', v: 'W/H Received' },
          N9: { t: 's', v: 'Qty' },
          O9: { t: 's', v: 'Date' },
          P8: { t: 's', v: 'Price' },
          P9: { t: 's', v: 'PO.Curr / size' },
          R9: { t: 's', v: 'PO.Curr / ea' },
          T9: { t: 's', v: 'USD / ea' },
          U9: { t: 's', v: 'USD / unit' },
          V8: { t: 's', v: 'Total (USD)' },
          W8: { t: 's', v: 'Supllier' },
          X8: { t: 's', v: 'PO / PR' },
          X9: { t: 's', v: 'Date' },
          Y9: { t: 's', v: 'No' },
          Z8: { t: 's', v: 'Remark' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // A1
            { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } }, // E1
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // A2
            { s: { r: 1, c: 4 }, e: { r: 1, c: 7 } }, // E2
            { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // A3
            { s: { r: 2, c: 4 }, e: { r: 2, c: 7 } }, // E3
            { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } }, // A4
            { s: { r: 7, c: 0 }, e: { r: 8, c: 0 } }, // A8
            { s: { r: 7, c: 2 }, e: { r: 7, c: 5 } }, // C8
            { s: { r: 8, c: 2 }, e: { r: 8, c: 2 } }, // C9
            { s: { r: 8, c: 3 }, e: { r: 8, c: 3 } }, // D9
            { s: { r: 8, c: 4 }, e: { r: 8, c: 4 } }, // E9
            { s: { r: 8, c: 5 }, e: { r: 8, c: 5 } }, // F9
            { s: { r: 7, c: 6 }, e: { r: 8, c: 7 } }, // G8
            { s: { r: 7, c: 8 }, e: { r: 8, c: 8 } }, // I8
            { s: { r: 7, c: 9 }, e: { r: 8, c: 9 } }, // J8
            { s: { r: 7, c: 11 }, e: { r: 8, c: 11 } }, // L8
            { s: { r: 7, c: 12 }, e: { r: 8, c: 12 } }, // M8
            { s: { r: 7, c: 13 }, e: { r: 7, c: 14 } }, // N8
            { s: { r: 8, c: 13 }, e: { r: 8, c: 13 } }, // N9
            { s: { r: 8, c: 14 }, e: { r: 8, c: 14 } }, // O9
            { s: { r: 7, c: 15 }, e: { r: 7, c: 20 } }, // P8
            { s: { r: 8, c: 15 }, e: { r: 8, c: 16 } }, // P9
            { s: { r: 8, c: 17 }, e: { r: 8, c: 18 } }, // R9
            { s: { r: 8, c: 19 }, e: { r: 8, c: 19 } }, // T9
            { s: { r: 8, c: 20 }, e: { r: 8, c: 20 } }, // U9
            { s: { r: 7, c: 21 }, e: { r: 8, c: 21 } }, // V8
            { s: { r: 7, c: 22 }, e: { r: 8, c: 22 } }, // W8
            { s: { r: 7, c: 23 }, e: { r: 7, c: 24 } }, // X8
            { s: { r: 8, c: 23 }, e: { r: 8, c: 23 } }, // X9
            { s: { r: 8, c: 24 }, e: { r: 8, c: 24 } }, // Y9
            { s: { r: 7, c: 25 }, e: { r: 8, c: 25 } }, // Z8
          ],
          '!cols': [
            { wpx: 30 }, { wpx: 100, hidden: true }, { wpx: 100 }, { wpx: 100 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 40 }, { wpx: 40 }, { wpx: 40 },
            { wpx: 40 }, { wpx: 10 }, { wpx: 40 }, { wpx: 80 }, { wpx: 40 },
            { wpx: 80 }, { wpx: 30 }, { wpx: 60 }, { wpx: 30 }, { wpx: 60 },
            { wpx: 60 }, { wpx: 60 }, { wpx: 60 }, { wpx: 100 }, { wpx: 80 },
            { wpx: 60 }, { wpx: 100 },
          ],
        },
      },
    };

    let row = 10;
    for (let i = 0; i < wo.modules.length; i += 1) {
      wb.Sheets.Master[`A${row}`] = { t: 's', v: wo.modules[i].hid };
      wb.Sheets.Master[`C${row}`] = { t: 's', v: wo.modules[i].header };
     
      row += 1;

      for (let j = 0; j < wo.modules[i].items.length; j += 1) {
        wb.Sheets.Master[`A${row}`] = { t: 'n', v: j + 1 };
        wb.Sheets.Master[`C${row}`] = { t: 's', v: wo.modules[i].items[j].bomDescription };
        wb.Sheets.Master[`D${row}`] = { t: 's', v: wo.modules[i].items[j].bomSpecification };
        wb.Sheets.Master[`E${row}`] = { t: 's', v: wo.modules[i].items[j].bomModel || '' };
        wb.Sheets.Master[`F${row}`] = { t: 's', v: wo.modules[i].items[j].bomBrand || '' };
        wb.Sheets.Master[`G${row}`] = { t: 'n', v: wo.modules[i].items[j].bomQty };
        
        row += 1;
      }
    }

    const fn = `static/report/${wo.woNo}.xlsx`;
    const content = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', bookSST: false });
    fs.writeFileSync(fn, content);

    return { status: 1 };
  } catch (err) {
    if (typeof err === 'string') {
      throw new ErrorWithProps(err);
    } else {
      throw new ErrorWithProps(err.message);
    }
  }
};

module.exports = {
  wherePic, getCurrency, sendApprovedEmail, sendValidatedEmail, genWo,
};
