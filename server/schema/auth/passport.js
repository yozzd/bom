const passport = require('passport');
const { Strategy } = require('passport-local');

const localAuthenticate = async (User, username, password, done) => {
  const user = await User.findOne({
    attributes: [
      'name', 'password', 'group', 'department',
      'section', 'fullname', 'isManager',
    ],
    where: { name: username },
  });

  if (!user) {
    return done(null, false, { message: 'Invalid Username or Password' });
  }
  const authPassword = await user.authenticate(password);
  if (!authPassword) {
    return done(null, false, { message: 'Invalid Username or Password' });
  }
  return done(null, user);
};

exports.setup = (User) => {
  passport.use(
    new Strategy(
      { usernameField: 'username', passwordField: 'password' },
      (username, password, done) => localAuthenticate(User, username, password, done),
    ),
  );
};
