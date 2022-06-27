const { Op } = require('sequelize');
const { isAuthenticated } = require('../auth/service');
const { Material } = require('../relations');

const resolvers = {
  Query: {
    getSearchItems: isAuthenticated(async (_, { key }) => {
      const attributes = [
        'MaterialCD', 'MaterialNM', 'MaterialDesc', 'Model', 'Brand',
        'unit',
      ];
      const where = {
        [Op.or]: [
          { MaterialNM: { [Op.substring]: key } },
          { MaterialDesc: { [Op.substring]: key } },
        ],
      };

      const items = await Material.findAll({
        attributes,
        where,
      });

      return items;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
