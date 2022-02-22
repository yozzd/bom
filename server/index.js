const fastify = require('fastify')({ logger: true });
const mercurius = require('mercurius');
const MercuriusGQLUpload = require('mercurius-upload');
const cors = require('fastify-cors');
const jwt = require('fastify-jwt');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { typeDefs, resolvers } = require('./schema');

const authPassport = require('./schema/auth/passport');
const User = require('./schema/user/model');
const { secret } = require('./config');

authPassport.setup(User);

fastify.register(cors);

fastify.register(jwt, { secret: secret.session, sign: { expiresIn: '15h' } });

fastify.register(MercuriusGQLUpload);

fastify.addHook('onRequest', async (req) => {
  try {
    if (req.headers.authorization) {
      await req.jwtVerify();
    }
  } catch (err) {
    throw new mercurius.ErrorWithProps(err);
  }
});

fastify.register(mercurius, {
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  context: (req, res) => ({ req, res }),
  graphiql: true,
});

const start = async () => {
  try {
    await fastify.listen(5001, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
