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

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const wb = {
      SheetNames: ['Master'],
      Sheets: {
        Master: {
          '!ref': 'A1:Z10',
          A1: { t: 's', v: 'BILL OF MATERIAL' },
          A2: { t: 's', v: `Cat: ${wo.cat}` },
          A3: { t: 's', v: `Model: ${wo.model}` },
          A4: { t: 's', v: `Product Name: ${wo.product}` },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, //A1
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, //A2
            { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, //A3
            { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } }, //A4
          ],
          '!cols': [
            { wpx: 30 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 },
            { wpx: 100 },
          ],
        },
      },
    };

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
