const { LT, WO } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getLT: isAuthenticated(async (_, { status }) => {
      const lt = await LT.findAll({
        attributes: ['id', 'ltNo'],
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'status'],
          where: { status },
        }],
      });
      return lt;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
