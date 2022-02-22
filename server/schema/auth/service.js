const { ErrorWithProps } = require('mercurius');
const { userRoles } = require('../../config');

const isAuthenticated = (fn) => async (_, args, ctx) => {
  if (!ctx.req.user) {
    throw new ErrorWithProps('Access Denied / Forbidden');
  } else {
    if (userRoles.indexOf(ctx.req.user.group)) {
      const user = await fn(...[_, args, ctx]);
      return user;
    }
    throw new ErrorWithProps('Access Denied / Forbidden');
  }
};

const hasRole = (group, fn) => async (_, args, ctx) => {
  if (!ctx.req.user) {
    throw new ErrorWithProps('Access Denied / Forbidden');
  } else {
    if (userRoles.indexOf(ctx.req.user.group) >= userRoles.indexOf(group)) {
      const user = await fn(...[_, args, ctx]);
      return user;
    }
    throw new ErrorWithProps('Access Denied / Forbidden');
  }
};

module.exports = { isAuthenticated, hasRole };
