const {
  LT, WO, WOMODULE, WOITEM,
} = require('./bom/model');
const { MPR, MPRMODULE, MPRITEM } = require('./mpr/model');
const { OUTSTANDINGPO } = require('./outstandingPo/model');
const { Employer } = require('./employer/model');
const { Material } = require('./material/model');
const { Wmr } = require('./wmr/model');

LT.hasMany(WO, {
  foreignKey: 'idLt',
  targetKey: 'id',
});
WO.belongsTo(LT, {
  foreignKey: 'idLt',
  targetKey: 'id',
});

WO.hasMany(WOMODULE, {
  foreignKey: 'idWo',
  targetKey: 'id',
});
WOMODULE.belongsTo(WO);

WOMODULE.hasMany(WOITEM, {
  foreignKey: 'idHeader',
  targetKey: 'id',
});
WOITEM.belongsTo(WOMODULE, {
  foreignKey: 'idHeader',
  targetKey: 'id',
});

MPR.hasMany(MPRMODULE, {
  foreignKey: 'idMpr',
  targetKey: 'id',
});
MPRMODULE.belongsTo(MPR);

MPRMODULE.hasMany(MPRITEM, {
  foreignKey: 'idModule',
  targetKey: 'id',
});
MPRITEM.belongsTo(MPRMODULE, {
  foreignKey: 'idModule',
  targetKey: 'id',
});

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

WO.hasMany(MPR, {
  foreignKey: 'idWo',
  targetKey: 'id',
});
MPR.belongsTo(WO, {
  foreignKey: 'idWo',
  targetKey: 'id',
});

MPR.hasMany(MPRITEM, {
  foreignKey: 'idMpr',
  targetKey: 'id',
});
MPRITEM.belongsTo(MPR, {
  foreignKey: 'idMpr',
  targetKey: 'id',
});

WOMODULE.hasMany(MPRITEM, {
  foreignKey: 'idHeader',
});
MPRITEM.belongsTo(WOMODULE, {
  foreignKey: 'idHeader',
  targetKey: 'id',
});

WO.hasMany(WOITEM, {
  foreignKey: 'idWo',
});
WOITEM.belongsTo(WO, {
  foreignKey: 'idWo',
  targetKey: 'id',
});

WO.hasMany(Wmr, {
  foreignKey: 'idWo',
});
Wmr.belongsTo(WO, {
  foreignKey: 'idWo',
  targetKey: 'id',
});

Wmr.hasMany(WOITEM, {
  foreignKey: 'idWmr',
});
WOITEM.belongsTo(Wmr, {
  foreignKey: 'idWmr',
  targetKey: 'id',
});

Wmr.hasMany(MPRITEM, {
  foreignKey: 'idWmr',
});
MPRITEM.belongsTo(Wmr, {
  foreignKey: 'idWmr',
  targetKey: 'id',
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
  Employer,
  Material,
  Wmr,
};
