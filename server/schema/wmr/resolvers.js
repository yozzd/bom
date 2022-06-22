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
      let where = {};

      if (ctx.req.user.section === 213) {
        where = {
          authorizedByApproved: 1,
        };
      } else {
        where = {
          department: ctx.req.user.department,
        };
      }

      const wmr = await Wmr.findAll({
        attributes: [
          'id', 'no', 'requestedById', 'requestedBy', 'requestedByTimestamp',
          'authorizedById', 'authorizedBy', 'authorizedByApproved', 'authorizedByTimestamp',
          'idWo',
        ],
        where,
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'idLt'],
        }],
      });

      return wmr;
    }),
    getOneWmr: isAuthenticated(async (_, { id }) => {
      const wmr = await Wmr.findOne({
        attributes: [
          'id', 'no', 'requestedBy', 'authorizedBy',
        ],
        where: { id },
        include: [{
          model: WOITEM,
          attributes: itemAttributes,
          include: [{
            model: Wmr,
            attributes: ['id', 'no'],
          }],
        }, {
          model: WO,
          attributes: ['id', 'woNo', 'idLt'],
        }],
      });

      const wmrMpr = await Wmr.findOne({
        attributes: [
          'id', 'no', 'requestedBy', 'authorizedBy',
        ],
        where: { id },
        include: [{
          model: MPRITEM,
          attributes: itemAttributes,
          include: [{
            model: Wmr,
            attributes: ['id', 'no'],
          }],
        }],
      });

      wmr.items.push(...wmrMpr.items);

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
      obj.requestedByTimestamp = dateNow();
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
    approveWmr: isAuthenticated(async (_, { input }) => {
      const wmr = await Wmr.findOne({
        attributes: [
          'id', 'no', 'requestedById', 'requestedBy', 'requestedByTimestamp',
          'authorizedById', 'authorizedBy', 'authorizedByApproved', 'authorizedByTimestamp',
          'idWo',
        ],
        where: { id: input.id },
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'idLt'],
        }],
      });

      if (input.type === 'authorized') {
        wmr.authorizedByApproved = 1;
        wmr.authorizedByTimestamp = dateNow();
      }

      const save = await wmr.save();
      return save;
    }),
    disapproveWmr: isAuthenticated(async (_, { input }) => {
      const wmr = await Wmr.findOne({
        attributes: [
          'id', 'no', 'requestedById', 'requestedBy', 'requestedByTimestamp',
          'authorizedById', 'authorizedBy', 'authorizedByApproved', 'authorizedByTimestamp',
          'idWo',
        ],
        where: { id: input.id },
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'idLt'],
        }],
      });

      if (input.type === 'authorized') {
        wmr.authorizedByApproved = 0;
        wmr.authorizedByTimestamp = '0000-00-00 00:00:00';
      }

      const save = await wmr.save();
      return save;
    }),
    deleteWmr: isAuthenticated(async (_, { input }) => {
      await Promise.all(
        input.map(async (v) => {
          await WOITEM.update(
            { idWmr: null },
            { where: { idWmr: v.id } },
          );

          await MPRITEM.update(
            { idWmr: null },
            { where: { idWmr: v.id } },
          );

          await Wmr.destroy({
            where: { id: v.id },
          });
        }),
      );

      return input;
    }),
    stockWmrItem: isAuthenticated(async (_, { input }) => {
      const saved = [];

      await Promise.all(
        input.map(async (v) => {
          let item = {};
          const where = { id: v.id };
          const include = [{
            model: Wmr,
            attributes: ['id', 'no'],
          }];

          if (v.isMpr) {
            item = await MPRITEM.findOne({
              attributes: itemAttributes,
              where,
              include,
            });
          } else {
            item = await WOITEM.findOne({
              attributes: itemAttributes,
              where,
              include,
            });
          }

          if (v.type === 0) {
            item.qtyIssued = 0;
          } else {
            item.qtyIssued = item.bomQty;
          }

          const save = await item.save();
          saved.push(save);
        }),
      );

      return saved;
    }),
    updateWmrWhItem: isAuthenticated(async (_, { input }) => {
      let item = {};
      const where = { id: input.id };
      const include = [{
        model: Wmr,
        attributes: ['id', 'no'],
      }];

      if (input.isMpr) {
        item = await MPRITEM.findOne({
          attributes: itemAttributes,
          where,
          include,
        });
      } else {
        item = await WOITEM.findOne({
          attributes: itemAttributes,
          where,
          include,
        });
      }

      item.qtyIssued = input.qtyIssued;
      item.wmrWhRemarks = input.wmrWhRemarks;

      const save = await item.save();
      return save;
    }),
  },
};

module.exports = { resolvers };
