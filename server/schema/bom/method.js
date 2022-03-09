const { Op } = require('sequelize');

const wherePic = (status, ctx) => {
  const { group, department, isManager } = ctx.req.user;
  let where = null;

  if (group === 15 || (department === 170 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [2, 8] } },
      ],
    };
  } else if (group === 16 || (department === 120 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [3, 8] } },
      ],
    };
  } else if (group === 17 || (department === 110 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [1, 8] } },
      ],
    };
  } else if (group === 19 || (department === 320 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 9 },
      ],
    };
  } else if (group === 20 || (department === 140 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 4 },
      ],
    };
  } else if (group === 21 || (department === 510 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: { [Op.in]: [5, 6] } },
      ],
    };
  } else if (group === 22 || (department === 140 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 7 },
      ],
    };
  } else if (group === 25 || (department === 130 && isManager)) {
    where = {
      [Op.and]: [
        { status },
        { pic: 10 },
      ],
    };
  } else {
    where = { status };
  }

  return where;
};

module.exports = { wherePic };
