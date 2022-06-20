const { Wmr } = require('../relations');
const { wmrSerial } = require('./method');
const { dateNow } = require('../mpr/resolvers');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllWmr: isAuthenticated(async (_, { department }) => {
      console.log(department);
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
      obj.department = ctx.req.user.department;
      obj.section = ctx.req.user.section;

      const newWmr = new Wmr(obj);
      const save = await newWmr.save();

      return save;
    }),
  },
};

module.exports = { resolvers };
