const { Op } = require('sequelize');

const status = {
  [Op.or]: [
    { poStatus: { [Op.is]: null } },
    { poStatus: { [Op.ne]: 'Complete' } },
    {
      [Op.and]: [
        { poFinance: { [Op.is]: null } },
        { poStatus: { [Op.eq]: 'Complete' } },
      ],
    },
  ],
};

const whereZone = (zone) => {
  let where = null;
  if (zone === 1) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['C', 'T', 'HK'] } },
        status,
      ],
    };
  } else if (zone === 2) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['S'] } },
        status,
      ],
    };
  } else if (zone === 3) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.notIn]: ['C', 'T', 'HK', 'S', 'OL', 'L'] } },
        status,
      ],
    };
  } else if (zone === 4) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['OL'] } },
        status,
      ],
    };
  } else {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['L'] } },
        status,
      ],
    };
  }

  return where;
};

module.exports = { whereZone };
