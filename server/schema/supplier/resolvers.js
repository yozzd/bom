const { Op } = require('sequelize');
const { Supplier } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getAllSupplier: isAuthenticated(async () => {
      const supplier = await Supplier.findAll({
        attributes: [
          'suplierID', 'suplierNM', 'ContactPerson', 'Address', 'Country',
          'PostCode', 'OfficePhone', 'Email', 'HomePage', 'Remark',
        ],
        order: ['suplierNM'],
      });

      return supplier;
    }),
    searchSupplier: isAuthenticated(async (_, { key }) => {
      const supplier = await Supplier.findAll({
        attributes: ['suplierID', 'suplierNM'],
        order: ['suplierNM'],
        where: { suplierNM: { [Op.substring]: key } },
      });

      return supplier;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
