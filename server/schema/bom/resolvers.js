const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const {
  LT, WO, WOHEADER, WOITEM,
} = require('./model');
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
        group: ['wos.id'],
        where: { id: idLt },
        include: [{
          model: WO,
          attributes: [
            'id', 'woNo', 'unit', 'budget',
            [sequelize.literal('SUM(`wos->headers->items`.bom_usd_total) / wos.unit'), 'totalPricePerUnit'],
            [sequelize.literal('SUM(`wos->headers->items`.bom_usd_total)'), 'totalPricePerWO'],
          ],
          where: { status },
          include: [{
            model: WOHEADER,
            attributes: [],
            include: [{
              model: WOITEM,
              attributes: [],
              where: {
                [Op.and]: [
                  { cancel: 0 },
                  { idHeader: { [Op.not]: null } },
                ],
              },
            }],
          }],
        }],
      });

      return wo;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
