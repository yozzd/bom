const {
  LT, WO, WOMODULE, WOITEM, MPR, MPRITEM, OUTSTANDINGPO,
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

  return wo;
};

module.exports = {
  queryWo,
};
