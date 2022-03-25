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
        { bomQty: { [Op.eq]: 0 } },
      ],
    };
  }

  return where;
};

module.exports = { whereStatus };
