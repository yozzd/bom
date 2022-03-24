const {
  LT, WO, WOMODULE, WOITEM,
} = require('./bom/model');
const { MPR, MPRMODULE, MPRITEM } = require('./mpr/model');
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

MPR.hasMany(MPRMODULE, {
  foreignKey: 'idMpr',
  targetKey: 'id',
});
MPRMODULE.belongsTo(MPR);

MPRMODULE.hasMany(MPRITEM, {
  foreignKey: 'idModule',
  targetKey: 'id',
});
MPRITEM.belongsTo(MPRMODULE);

OUTSTANDINGPO.hasMany(WOITEM, {
  foreignKey: 'poNo',
});
WOITEM.belongsTo(OUTSTANDINGPO, {
  foreignKey: 'poNo',
  targetKey: 'poNo',
});

OUTSTANDINGPO.hasMany(MPRITEM, {
  foreignKey: 'poNo',
});
MPRITEM.belongsTo(OUTSTANDINGPO, {
  foreignKey: 'poNo',
  targetKey: 'poNo',
});

module.exports = {
  LT,
  WO,
  WOMODULE,
  WOITEM,
  MPR,
  MPRMODULE,
  MPRITEM,
  OUTSTANDINGPO,
};
