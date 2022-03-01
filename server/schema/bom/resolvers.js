const { LT, WO } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getLTAll: isAuthenticated(async (_, { status }) => {
      const lt = await LT.findAll({
        attributes: ['id', 'ltNo', 'customer'],
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'status'],
          where: { status },
        }],
      });

      return lt;
    }),
    getLTOne: isAuthenticated(async (_, { idLt, status }) => {
      const wo = await LT.findOne({
        attributes: ['id', 'ltNo', 'customer'],
        where: { id: idLt },
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'status'],
          where: { status },
        }],
      });

      return wo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
