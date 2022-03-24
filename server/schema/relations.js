const { LT, WO, WOMODULE, WOITEM } = require('./bom/model');
const { OUTSTANDINGPO } = require('./outstandingPo/model');

LT.hasMany(WO, {
  foreignKey: 'idLt',
  targetKey: 'id',
});
WO.belongsTo(LT);

WO.hasMany(WOMODULE, {
  foreignKey: 'idWo',
  targetKey: 'id',
});
WOMODULE.belongsTo(WO);

WOMODULE.hasMany(WOITEM, {
  foreignKey: 'idHeader',
  targetKey: 'id',
});
WOITEM.belongsTo(WOMODULE);

OUTSTANDINGPO.hasMany(WOITEM, {
  foreignKey: 'poNo',
});
WOITEM.belongsTo(OUTSTANDINGPO, {
  foreignKey: 'poNo',
  targetKey: 'poNo',
});

module.exports = {
  LT, WO, WOMODULE, WOITEM,
  OUTSTANDINGPO,
};
