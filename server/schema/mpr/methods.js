const { Op } = require('sequelize');
const {
  WO, WOMODULE, MPR, MPRMODULE, MPRITEM,
} = require('../relations');
const { itemAttributes } = require('../bom/resolvers');

const inSection = (department) => {
  let sections = [];

  if (department === 110) sections = [111, 113];
  else if (department === 120) sections = [121, 122, 129];
  else if (department === 130) sections = [131, 132, 133, 134, 135, 136, 139];
  else if (department === 140) sections = [142, 143, 561];
  else if (department === 150) sections = [151, 152, 153, 154, 159];
  else if (department === 170) sections = [171, 179];
  else if (department === 210) sections = [211, 212, 213, 219];
  else if (department === 220) sections = [221, 229];
  else if (department === 320) sections = [321, 322, 323, 324];
  else if (department === 330) sections = [331];
  else if (department === 510) sections = [161, 511, 513];

  return sections;
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
  const { isManager, department, section } = ctx.req.user;

  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const fdate = new Date(new Date(date) - tzoffset).toISOString();

  let where = {};

  if (isManager) {
    where = {
      [Op.and]: [
        { requestorTimestamp: { [Op.gt]: fdate } },
        { requestorSection: { [Op.in]: inSection(department) } },
        { managerApproved: 0 },
        { whApproved: 0 },
      ],
    };
  } else if (section === 213) {
    where = {
      [Op.and]: [
        { managerTimestamp: { [Op.gt]: fdate } },
        { managerApproved: 1 },
        { whApproved: 0 },
      ],
    };
  } else if (section === 211) {
    where = {
      [Op.and]: [
        { whTimestamp: { [Op.gt]: fdate } },
        { managerApproved: 1 },
        { whApproved: 1 },
      ],
    };
  }

  const mpr = await MPR.findAll({
    attributes: ['id', 'requestorTimestamp'],
    where,
  });

  return mpr;
};

module.exports = {
  whereStatus, whereUser, oneMpr, getNotif,
};
