const { Op } = require('sequelize');

const cond1 = {
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

const whereCategory = (category) => {
  let where = null;

  if (category === 1) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['C', 'T', 'HK'] } },
        cond1,
      ],
    };
  } else if (category === 2) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['S'] } },
        cond1,
      ],
    };
  } else if (category === 3) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.notIn]: ['C', 'T', 'HK', 'S', 'OL', 'L'] } },
        cond1,
      ],
    };
  } else if (category === 4) {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['OL'] } },
        cond1,
      ],
    };
  } else {
    where = {
      [Op.and]: [
        { poCancel: 0 },
        { poZone: { [Op.in]: ['L'] } },
        cond1,
      ],
    };
  }

  return where;
};

const whereStatus = (status) => {
  let where = null;

  if (status === 0) {
    where = {
      [Op.and]: [
        { poFinance: { [Op.is]: null } },
        { poArrival: { [Op.not]: null } },
        { poStatus: { [Op.eq]: 'Complete' } },
      ],
    };
  }

  return where;
};

module.exports = { whereCategory, whereStatus };
