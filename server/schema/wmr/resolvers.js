const {
  Wmr, WO, WOITEM, MPR, MPRITEM,
} = require('../relations');
const { wmrSerial } = require('./method');
const { dateNow } = require('../mpr/resolvers');
const { isAuthenticated } = require('../auth/service');
const { itemAttributes } = require('../bom/resolvers');

const resolvers = {
  Query: {
    getAllWmr: isAuthenticated(async (_, args, ctx) => {
      const where = {
        department: ctx.req.user.department,
      };

      const wmr = await Wmr.findAll({
        attributes: [
          'id', 'no', 'requestById', 'requestBy', 'requestByTimestamp',
          'authorizedById', 'authorizedBy', 'authorizedByTimestamp', 'idWo',
        ],
        where,
        include: [{
          model: WO,
          attributes: ['id', 'woNo'],
        }],
      });

      return wmr;
    }),
    getWmrByWo: isAuthenticated(async (_, { idWo }) => {
      const wmr = await Wmr.findAll({
        attributes: ['id', 'no'],
        where: { idWo },
      });

      return wmr;
    }),
  },
  Mutation: {
    addWmr: isAuthenticated(async (_, { input }, ctx) => {
      const { ...obj } = input;
      const count = await Wmr.count() + 1;

      obj.no = `WMR1-${wmrSerial(count)}`;
      obj.requestByTimestamp = dateNow();
      obj.authorizedByTimestamp = '0000-00-00 00:00:00';
      obj.department = ctx.req.user.department;
      obj.section = ctx.req.user.section;

      const newWmr = new Wmr(obj);
      const save = await newWmr.save();

      return save;
    }),
    addItemsToWmr: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          let item = {};
          const where = { id: v.id };

          if (v.isMpr) {
            item = await MPRITEM.findOne({
              attributes: itemAttributes,
              where,
              include: [{
                model: MPR,
                attributes: ['id', 'no'],
                required: false,
              }, {
                model: Wmr,
                attributes: ['id', 'no'],
              }],
            });
          } else {
            item = await WOITEM.findOne({
              attributes: itemAttributes,
              where,
              include: [{
                model: Wmr,
                attributes: ['id', 'no'],
              }],
            });
          }

          item.idWmr = item.idWmr ? null : v.idWmr;

          const save = await item.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
  },
};

module.exports = { resolvers };
