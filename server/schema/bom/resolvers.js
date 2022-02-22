const { Lt, Wo } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getLt: isAuthenticated(async () => {
      const lt = await Lt.findAll({
        attributes: ['id', 'ltNo'],
        include: [{
          model: Wo,
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
