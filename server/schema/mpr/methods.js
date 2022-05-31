const { format } = require('date-fns');
const { Op } = require('sequelize');
const {
  WO, WOMODULE, MPR, MPRMODULE, MPRITEM,
} = require('../relations');
const { itemAttributes } = require('../bom/resolvers');

const inSection = (department) => {
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

  return inSection;
};

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

  if ((group === 11 && section === 211) || (group === 11 && section === 212)) {
    where = {
      [Op.or]: [
        {
          [Op.and]: [
            { id: { [Op.in]: ids } },
            { cancel: 0 },
            { hold: 0 },
            { managerApproved: 1 },
            { whApproved: 1 },
          ],
        },
        {
          [Op.and]: [
            { cancel: 0 },
            { hold: 0 },
            { no: { [Op.is]: null } },
            { requestorId: group },
            { requestorSection: section },
          ],
        },
      ],
    };
  } else if (group === 11 && section === 213 && status === 0) {
    where = {
      [Op.or]: [
        {
          [Op.and]: [
            { id: { [Op.in]: ids } },
            { cancel: 0 },
            { hold: 0 },
            { managerApproved: 1 },
            { whApproved: 0 },
          ],
        },
        {
          [Op.and]: [
            { cancel: 0 },
            { hold: 0 },
            { no: { [Op.is]: null } },
            { requestorSection: { [Op.in]: inSection(department) } },
          ],
        },
      ],
    };
  } else if (isManager) {
    if (status === 0) {
      where = {
        [Op.or]: [
          {
            [Op.and]: [
              { id: { [Op.in]: ids } },
              { cancel: 0 },
              { hold: 0 },
              { managerApproved: 0 },
              { requestorSection: { [Op.in]: inSection(department) } },
            ],
          },
          {
            [Op.and]: [
              { cancel: 0 },
              { hold: 0 },
              { no: { [Op.is]: null } },
              { requestorSection: { [Op.in]: inSection(department) } },
            ],
          },
        ],
      };
    } else {
      where = {
        [Op.and]: [
          { id: { [Op.in]: ids } },
          { cancel: 0 },
          { hold: 0 },
          { requestorSection: { [Op.in]: inSection(department) } },
        ],
      };
    }
  } else {
    where = {
      [Op.or]: [
        {
          [Op.and]: [
            { id: { [Op.in]: ids } },
            { cancel: 0 },
            { hold: 0 },
            { requestorId: group },
            { requestorSection: section },
          ],
        },
        {
          [Op.and]: [
            { cancel: 0 },
            { hold: 0 },
            { no: { [Op.is]: null } },
            { requestorId: group },
            { requestorSection: section },
          ],
        },
      ],
    };
  }

  return where;
};

const oneMpr = async (id) => {
  const mpr = await MPR.findOne({
    attributes: [
      'id', 'no', 'woNo', 'model', 'product', 'projectName',
      'unit', 'category', 'dor', 'idWo', 'requestorName',
      'packing', 'hold', 'cancel',
    ],
    where: { id },
    required: false,
    include: [{
      model: WO,
      attributes: ['id', 'euro', 'gbp', 'myr', 'idr', 'sgd'],
    }, {
      model: MPRMODULE,
      attributes: ['id', 'moduleChar', 'moduleName'],
      required: false,
      include: [{
        model: MPRITEM,
        attributes: itemAttributes,
        required: false,
        include: [{
          model: WOMODULE,
          attributes: ['id', 'hid', 'header'],
          required: false,
        }],
      }],
    }, {
      model: MPRITEM,
      attributes: itemAttributes,
      where: {
        [Op.and]: [
          { cancel: 0 },
          { idModule: { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: 0 }] } },
        ],
      },
      required: false,
      include: [{
        model: WOMODULE,
        attributes: ['id', 'hid', 'header'],
        required: false,
      }],
    }],
  });

  return mpr;
};

const getNotif = async (date, ctx) => {
  const { isManager, department } = ctx.req.user;
  const fdate = format(new Date(date), 'yyyy-MM-dd HH:mm:ss');

  let where = {};

  if (isManager) {
    where = {
      [Op.and]: [
        { requestorTimestamp: { [Op.gt]: fdate } },
        { requestorSection: { [Op.in]: inSection(department) } },
        { managerApproved: 0 },
      ],
    };
  }
  
  const mpr = await MPR.findAll({
    attributes: ['id'],
    where,
  });

  return mpr;
};

module.exports = { whereStatus, whereUser, oneMpr, getNotif };
