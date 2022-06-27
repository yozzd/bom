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
  Mutation: {
    addSupplier: isAuthenticated(async (_, { input }) => {
      const newSupplier = new Supplier(input);
      const save = await newSupplier.save();

      return save;
    }),
    deleteSupplier: isAuthenticated(async (_, { input }) => {
      await Promise.all(
        input.map(async (v) => {
          await Supplier.destroy({
            where: { suplierID: v.suplierID },
          });
        }),
      );

      return input;
    }),
  },
};

module.exports = { resolvers };
