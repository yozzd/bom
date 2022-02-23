const { LT, WO } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getLT: isAuthenticated(async () => {
      const lt = await LT.findAll({
        attributes: ['id', 'ltNo'],
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'status'],
          where: { status: 0 },
        }],
      });
      return lt;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
