import {
  routeOption,
  getMatchedComponents,
  normalizePath,
  userRoles,
} from '../auth/utilities';

export default function auth(ctx) {
  if (routeOption(ctx.route, 'auth', false)) {
    return;
  }

  const matches = [];
  const Components = getMatchedComponents(ctx.route, matches);
  if (!Components.length) {
    return;
  }

  const { login, callback } = ctx.app.$auth.options.redirect;

  if (ctx.app.$auth.$state.loggedIn) {
    const checkMeta = ctx.route.meta.length > 2 ? ctx.route.meta[2].guard : '';

    if (!login || normalizePath(ctx.route.path) === normalizePath(login)) {
      ctx.app.$auth.redirect('home');
    } else if (
      userRoles.indexOf(checkMeta)
      > userRoles.indexOf(ctx.store.state.auth.user.group)
    ) {
      ctx.app.$auth.redirect('guard');
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (
      !callback
      || normalizePath(ctx.route.path) !== normalizePath(callback)
    ) {
      ctx.app.$auth.redirect('login');
    }
  }
}
