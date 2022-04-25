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

const whereUser = async ({
  req: {
    user: {
      group, department, section, isManager,
    },
  },
}, items, status) => {
  const ids = await Promise.all(items.reduce((prev, curr) => [...prev, curr.idMpr], []));
  let where = null;

  let inSection = [];
  if (department === 110) inSection = [111, 113];
  else if (department === 120) inSection = [121, 122, 129];
  else if (department === 130) inSection = [131, 132, 133, 134, 135, 136, 139];
  else if (department === 140) inSection = [142, 143, 561];
  else if (department === 150) inSection = [151, 152, 153, 154, 159];
  else if (department === 170) inSection = [171, 179];
  else if (department === 210) inSection = [211, 212, 213, 219];
  else if (department === 220) inSection = [221, 229];
  else if (department === 320) inSection = [321, 322, 323, 324];
  else if (department === 330) inSection = [331];
  else if (department === 510) inSection = [161, 511, 513];

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
  } else if (group === 11 && section === 213 && status === 0) {
    where = {
      [Op.and]: [
        { id: { [Op.in]: ids } },
        { cancel: 0 },
        { hold: 0 },
        { managerApproved: 1 },
        { whApproved: 0 },
      ],
    };
  } else if (isManager) {
    if (status === 0) {
      where = {
        [Op.and]: [
          { id: { [Op.in]: ids } },
          { cancel: 0 },
          { hold: 0 },
          { managerApproved: 0 },
          { requestorSection: { [Op.in]: inSection } },
        ],
      };
    } else {
      where = {
        [Op.and]: [
          { id: { [Op.in]: ids } },
          { cancel: 0 },
          { hold: 0 },
          { requestorSection: { [Op.in]: inSection } },
        ],
      };
    }
  } else {
    where = {
      [Op.and]: [
        { id: { [Op.in]: ids } },
        { cancel: 0 },
        { hold: 0 },
        { requestorId: group },
        { requestorSection: section },
      ],
    };
  }

  return where;
};

module.exports = { whereStatus, whereUser };
