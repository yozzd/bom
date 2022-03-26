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

const whereUser = async ({ req: { user: { group, section } } }, items) => {
  const ids = await Promise.all(items.reduce((prev, curr) => [...prev, curr.idMpr], []));
  let where = null;

  if ((group === 11 && section === 211) || (group === 11 && section === 212)) {
    where = {
      [Op.and]: [
        { id: { [Op.in]: ids } },
        { cancel: 0 },
        { hold: 0 },
        { managerApproved: 1 },
        { whApproved: 1 },
      ],
    };
  } else if (group === 11 && section === 213) {
    where = {
      [Op.and]: [
        { id: { [Op.in]: ids } },
        { cancel: 0 },
        { hold: 0 },
        { managerApproved: 1 },
        { whApproved: 0 },
      ],
    };
  }
  return where;
};

module.exports = { whereStatus, whereUser };
