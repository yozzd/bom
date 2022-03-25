const { Op } = require('sequelize');

const whereStatus = (status) => {
  let where = null;

  if (status === 0) {
    where = {
      [Op.or]: [
        {
          [Op.and]: [
            { cancel: 0 },
            { hold: 0 },
            { bomQtyBalance: { [Op.lt]: 0 } },
            { bomQtyRec: { [Op.lte]: 0 } },
            { poNo: { [Op.is]: null } },
            { '$outstandingPo.po_no$': { [Op.is]: null } },
          ],
        },
        { bomQty: 0 },
      ],
    };
  } else if (status === 1) {
    where = {
      [Op.or]: [
        {
          [Op.and]: [
            { cancel: 0 },
            { hold: 0 },
            { bomQtyBalance: { [Op.lt]: 0 } },
            { bomQtyRec: { [Op.lte]: 0 } },
            { poNo: { [Op.not]: null } },
            { '$outstandingPo.po_no$': { [Op.not]: null } },
          ],
        },
      ],
    };
  } else if (status === 2) {
    where = { hold: 1 };
  } else if (status === 3) {
    where = {
      [Op.or]: [
        {
          [Op.and]: [
            { bomQty: { [Op.gt]: 0 } },
            { bomQtyStock: { [Op.gt]: 0 } },
            { bomQtyBalance: { [Op.gte]: 0 } },
          ],
        },
        {
          [Op.and]: [
            { bomQtyRec: { [Op.gt]: 0 } },
            { bomQtyBalance: { [Op.gte]: 0 } },
            { bomPoNo: { [Op.not]: null } },
          ],
        },
      ],
    };
  } else {
    where = { cancel: 1 };
  }

  return where;
};

module.exports = { whereStatus };
