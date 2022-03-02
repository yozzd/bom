const { Op } = require('sequelize');
const { LT, WO, WOITEM } = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    getLTAll: isAuthenticated(async (_, { status }) => {
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
    getLTOne: isAuthenticated(async (_, { idLt, status }) => {
      const wo = await LT.findOne({
        attributes: ['id', 'ltNo', 'customer'],
        where: { id: idLt },
        include: [{
          model: WO,
          attributes: ['id', 'woNo', 'budget'],
          where: { status },
          include: [{
            model: WOITEM,
            attributes: ['id', 'bomDescription', 'bomSpecification'],
            where: {
              [Op.and]: [
                { cancel: 0 },
                { idHeader: { [Op.not]: null } },
              ],
            },
          }],
        }],
      });

      return wo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
