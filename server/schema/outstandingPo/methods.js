const { Op } = require('sequelize');

const whereZone = (zone) => {
  let where = null;
  if (zone === 1) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['C', 'T', 'HK'] } },
      ],
    };
  } else if (zone === 2) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['S'] } },
      ],
    };
  } else if (zone === 3) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.notIn]: ['C', 'T', 'HK', 'S', 'OL', 'L'] } },
      ],
    };
  } else if (zone === 4) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['OL'] } },
      ],
    };
  } else {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['L'] } },
      ],
    };
  }

  return where;
};

module.exports = { whereZone };
