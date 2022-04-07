const { Supplier } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllSupplier: isAuthenticated(async () => {
      const supplier = await Supplier.findAll({
        attributes: ['suplierID', 'suplierNM'],
        order: ['suplierNM'],
      });

      return supplier;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
