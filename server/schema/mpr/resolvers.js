const {
  MPR,
} = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllMPR: isAuthenticated(async () => {
      const mpr = await MPR.findAll({
        attributes: [
          'id', 'no', 'woNo', 'model', 'product', 'projectName',
          'unit', 'category', 'dor', 'idWo', 'packing'
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
