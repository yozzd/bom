require('dotenv').config();
const nodemailer = require('nodemailer');
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
    html += '<div>Berikut ini adalah informasi BOM Work Order di online pada Web System (WDS > BOM > Filter > Close):</div>';
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

module.exports = { wherePic, getCurrency, sendApprovedEmail };
