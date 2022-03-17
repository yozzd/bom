const { typeDefs: Auth } = require('./auth/typeDefs');
const { typeDefs: Bom } = require('./bom/typeDefs');
const { typeDefs: Mpr } = require('./mpr/typeDefs');
const { typeDefs: OutstandingPo } = require('./outstandingPo/typeDefs');
const { typeDefs: User } = require('./user/typeDefs');

const { resolvers: authResolvers } = require('./auth/resolvers');
const { resolvers: bomResolvers } = require('./bom/resolvers');
const { resolvers: mprResolvers } = require('./mpr/resolvers');
const { resolvers: outstandingPoResolvers } = require('./outstandingPo/resolvers');
const { resolvers: userResolvers } = require('./user/resolvers');

const Query = `
  type Query {
    _empty: String
  }
  
  type Mutation {
    _empty: String
  }
`;

module.exports = {
  typeDefs: [Query, Auth, Bom, Mpr, OutstandingPo, User],
  resolvers: [authResolvers, bomResolvers, mprResolvers, outstandingPoResolvers, userResolvers],
};
