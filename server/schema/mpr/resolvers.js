const {
  MPR,
} = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllMPR: isAuthenticated(async () => {
      const mpr = await MPR.findAll({
        attributes: [
          'id', 'no', 'woNo', 'category', 'dor',
        ],
        order: [
          ['category', 'DESC'],
          ['dor', 'ASC'],
        ],
      });

      return mpr;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
