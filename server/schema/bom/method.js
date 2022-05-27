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
    html = '<div>Test</div>';

    const message = {
      from: `"BOM Mailer System" <${process.env.SMTP_SENDER}>`,
      to: 'yossie@labtech.org',
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
