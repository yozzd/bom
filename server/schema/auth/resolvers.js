const passport = require('passport');

const authLocal = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('local', async (err, user, info) => {
    const error = err || info;
    if (error) {
      reject(new Error(error.message));
    }
    if (!user) {
      reject(new Error('Something went wrong, please try again'));
    }
    const { name, group } = user;
    const token = await res.jwtSign({ name, group });
    resolve({ name, token });
  })(req, res);
});

const resolvers = {
  Query: {
    auth: async (_, { username, password }, ctx) => {
      ctx.req.body = { username, password };
      const authenticate = await authLocal(ctx.req, ctx.res);
      return authenticate;
    },
  },
};

module.exports = { resolvers };
