const { Op } = require('sequelize');
const { LT, WO } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getLT: isAuthenticated(async (_, { status }) => {
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
    getWO: isAuthenticated(async (_, { idLt, status }) => {
      const wo = await WO.findAll({
        attributes: ['id', 'woNo', 'status'],
        where: {
          [Op.and]: [
            { idLt },
            { status },
          ],
        },
      });

      return wo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
