const User = require('./model');
const { isAuthenticated } = require('../auth/service');

const resolvers = {
  Query: {
    me: isAuthenticated(async (_, args, ctx) => {
      const user = await User.findOne({
        attributes: [
          'name', 'group', 'department', 'section',
          'fullname', 'isManager',
        ],
        where: { name: ctx.req.user.name },
      });
      return user;
    }),
  },
  Mutation: {},
};

module.exports = { resolvers };
