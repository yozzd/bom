const fs = require('fs');
const XLSX = require('xlsx');
const sanitizeHtml = require('sanitize-html');
const { ErrorWithProps } = require('mercurius');
const { Op } = require('sequelize');
const { float2 } = require('../scalar/number');

const cond1 = {
  [Op.or]: [
    { poStatus: { [Op.is]: null } },
    { poStatus: { [Op.ne]: 'Complete' } },
    {
      [Op.and]: [
        { poFinance: { [Op.is]: null } },
        { poStatus: { [Op.eq]: 'Complete' } },
      ],
    },
  ],
};

const whereCategory = (category) => {
  let where = null;

  if (category === 1) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['C', 'T', 'HK'] } },
        cond1,
      ],
    };
  } else if (category === 2) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['S'] } },
        cond1,
      ],
    };
  } else if (category === 3) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.notIn]: ['C', 'T', 'HK', 'S', 'OL', 'L'] } },
        cond1,
      ],
    };
  } else if (category === 4) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['OL'] } },
        cond1,
      ],
    };
  } else {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['L'] } },
        cond1,
      ],
    };
  }

  return where;
};

const whereStatus = (status) => {
  let where = null;

  if (status === 0) {
    where = {
      [Op.and]: [
        { poCancel: 1 },
      ],
    };
  } else if (status === 1) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poFinance: { [Op.not]: null } },
        { poArrival: { [Op.not]: null } },
        { poStatus: { [Op.eq]: 'Complete' } },
      ],
    };
  } else if (status === 2) {
    where = {
      [Op.and]: [
        { poFinance: { [Op.is]: null } },
        { poArrival: { [Op.not]: null } },
        { poStatus: { [Op.eq]: 'Complete' } },
      ],
    };
  } else if (status === 3) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poFinance: { [Op.not]: null } },
        { poArrival: { [Op.is]: null } },
      ],
    };
  } else if (status === 4) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poStatus: { [Op.eq]: 'Partial' } },
      ],
    };
  } else {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poFinance: { [Op.is]: null } },
        { poArrival: { [Op.is]: null } },
      ],
    };
  }

  return where;
};

const whereZones = (zone) => {
  const where = {
    [Op.and]: [
      { poCancel: 0 },
      { poZone: { [Op.eq]: zone } },
    ],
  };

  return where;
};

const wherePoNo = (poNo) => {
  const where = {
    [Op.and]: [
      { poCancel: 0 },
      { poNo },
    ],
  };

  return where;
};

const genOut = async ({ items, totals }, header) => {
  try {
    const dir = 'static/report';
    const len = 7 + items.length;
    const balance = await totals[0].totalPoBalanceUsd;

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const wb = {
      SheetNames: ['Master'],
      Sheets: {
        Master: {
          '!ref': `A1:V${len}`,
          A1: { t: 's', v: header },
          A2: { t: 's', v: `Total PO Value: USD ${float2(totals[0].totalPoValueUsd).format()}` },
          A3: { t: 's', v: `Total PO Paid: USD ${float2(totals[0].totalPoPaidUsd).format()}` },
          A4: { t: 's', v: `Total PO Balance: USD ${float2(balance).format()}` },
          A6: { t: 's', v: 'No' },
          B6: { t: 's', v: 'Po Issue' },
          C6: { t: 's', v: 'Approval Date' },
          D6: { t: 's', v: 'Zone' },
          E6: { t: 's', v: 'Po No' },
          F6: { t: 's', v: 'Supplier' },
          G6: { t: 's', v: 'Description' },
          H6: { t: 's', v: 'Po Value' },
          I6: { t: 's', v: 'Po Value (USD)' },
          J6: { t: 's', v: 'Po Paid (USD)' },
          K6: { t: 's', v: 'Po Balance (USD)' },
          L6: { t: 's', v: 'LT Project' },
          M6: { t: 's', v: 'Latest Payment' },
          N6: { t: 's', v: 'Production (Production Required)' },
          O6: { t: 's', v: 'Documents to Finance + Pi (Complete)' },
          P6: { t: 's', v: 'Payment Status' },
          Q6: { t: 's', v: 'ETA at Labtech' },
          R6: { t: 's', v: 'Time Arrival' },
          S6: { t: 's', v: 'Arrival Status' },
          T6: { t: 's', v: 'Complete' },
          U6: { t: 's', v: 'HSE' },
          V6: { t: 's', v: 'Remarks' },
          '!merges': [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
            { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
          ],
          '!cols': [
            { wpx: 30 }, { wpx: 70 }, { wpx: 70 }, { wpx: 30 }, { wpx: 50 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 },
            { wpx: 80 }, { wpx: 80 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 },
            { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 60 }, { wpx: 60 },
            { wpx: 60 }, { wpx: 120 },
          ],
        },
      },
    };

    let row = 7;
    for (let i = 0; i < items.length; i += 1) {
      wb.Sheets.Master[`A${row}`] = { t: 's', v: i + 1 };
      wb.Sheets.Master[`B${row}`] = { t: 's', v: items[i].poIssue };
      wb.Sheets.Master[`C${row}`] = { t: 's', v: items[i].approvalDate };
      wb.Sheets.Master[`D${row}`] = { t: 's', v: items[i].poZone };
      wb.Sheets.Master[`E${row}`] = { t: 's', v: items[i].poNo };
      wb.Sheets.Master[`F${row}`] = { t: 's', v: items[i].poSupplier };
      wb.Sheets.Master[`G${row}`] = { t: 's', v: items[i].poDescription };
      wb.Sheets.Master[`H${row}`] = { t: 'f', v: `${items[i].poKvalue} ${float2(items[i].poValue).format()}` };
      wb.Sheets.Master[`I${row}`] = { t: 'f', v: `USD ${float2(items[i].poValueUsd).format()}` };
      wb.Sheets.Master[`J${row}`] = { t: 'f', v: `USD ${float2(items[i].poPaidUsd).format()}` };
      wb.Sheets.Master[`K${row}`] = { t: 'f', v: `USD ${float2(items[i].poBalanceUsd).format()}` };
      wb.Sheets.Master[`L${row}`] = { t: 's', v: items[i].poLt };
      wb.Sheets.Master[`M${row}`] = { t: 's', v: items[i].poLpayment };
      wb.Sheets.Master[`N${row}`] = { t: 's', v: items[i].poBom };
      wb.Sheets.Master[`O${row}`] = { t: 's', v: items[i].poAdmin };
      wb.Sheets.Master[`P${row}`] = { t: 's', v: items[i].poFinance };
      wb.Sheets.Master[`Q${row}`] = { t: 's', v: items[i].poEta };
      wb.Sheets.Master[`R${row}`] = { t: 's', v: items[i].poArrival };
      wb.Sheets.Master[`S${row}`] = { t: 's', v: items[i].arrivalStatus };
      wb.Sheets.Master[`T${row}`] = { t: 's', v: items[i].comp };
      wb.Sheets.Master[`U${row}`] = { t: 's', v: items[i].hse };
      wb.Sheets.Master[`V${row}`] = { t: 's', v: sanitizeHtml(items[i].poRemarks, { allowedTags: [], allowedAttributes: {} }) };

      row += 1;
    }

    const fn = `static/report/${header}.xlsx`;
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
  whereCategory, whereStatus, whereZones, wherePoNo, genOut,
};
