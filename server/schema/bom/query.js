const { Op } = require('sequelize');
const {
  LT, WO, WOMODULE, WOITEM, MPR, MPRMODULE, MPRITEM, OUTSTANDINGPO,
} = require('../relations');
const { itemAttributes } = require('./resolvers');

const queryWo = async (id) => {
  const wo = await WO.findOne({
    attributes: ['id', 'woNo', 'cat', 'product', 'model', 'unit'],
    where: { id },
    order: [['modules', 'hid']],
    include: [{
      model: LT,
      attributes: ['id', 'ltNo'],
    }, {
      model: WOMODULE,
      attributes: ['id', 'hid', 'header'],
      include: [{
        model: WOITEM,
        attributes: itemAttributes,
        required: false,
        include: [{
          model: OUTSTANDINGPO,
          attributes: ['poStatus', 'poArrival', 'poNo'],
          required: false,
        }],
      }],
    }],
  });

  const woMpr = await WO.findOne({
    attributes: ['id', 'woNo'],
    where: { id },
    order: [['modules', 'hid']],
    include: [{
      model: WOMODULE,
      attributes: ['id', 'hid', 'header'],
      include: [{
        model: MPRITEM,
        attributes: itemAttributes,
        required: false,
        include: [{
          model: OUTSTANDINGPO,
          attributes: ['poStatus', 'poArrival', 'poNo'],
          required: false,
        }, {
          model: MPR,
          attributes: ['id', 'no'],
          required: false,
        }],
      }],
    }],
  });

  const merge = await Promise.all(wo.modules.map((v, i) => {
    v.items.push(...woMpr.modules[i].items);
    return v;
  }));

  wo.modules = merge;

  const mpr = await WO.findOne({
    attributes: ['id', 'woNo'],
    where: { id },
    include: [{
      model: MPR,
      attributes: [
        'id', 'no', 'unit', 'requestorName', 'bomTimestamp',
      ],
      where: { no: { [Op.not]: null } },
      required: false,
      include: [{
        model: MPRMODULE,
        attributes: ['id', 'moduleChar', 'moduleName'],
        required: false,
        include: [{
          model: MPRITEM,
          attributes: itemAttributes,
          where: { idHeader: { [Op.is]: null } },
          required: false,
          include: [{
            model: MPR,
            attributes: ['id', 'no'],
            required: false,
          }],
        }],
      }, {
        model: MPRITEM,
        attributes: itemAttributes,
        where: {
          [Op.and]: [
            { idModule: { [Op.or]: [{ [Op.is]: null }, { [Op.eq]: 0 }] } },
            { idHeader: { [Op.is]: null } },
          ],
        },
        required: false,
        include: [{
          model: MPR,
          attributes: ['id', 'no'],
          required: false,
        }],
      }],
    }],
  });

  return { wo, mpr };
};

module.exports = {
  queryWo,
};
