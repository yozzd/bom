const { typeDefs: Auth } = require('./auth/typeDefs');
const { typeDefs: Bom } = require('./bom/typeDefs');
const { typeDefs: Material } = require('./material/typeDefs');
const { typeDefs: Mpr } = require('./mpr/typeDefs');
const { typeDefs: Supplier } = require('./supplier/typeDefs');
const { typeDefs: OutstandingPo } = require('./outstandingPo/typeDefs');
const { typeDefs: Wmr } = require('./wmr/typeDefs');
const { typeDefs: User } = require('./user/typeDefs');

const { resolvers: authResolvers } = require('./auth/resolvers');
const { resolvers: bomResolvers } = require('./bom/resolvers');
const { resolvers: materialResolvers } = require('./material/resolvers');
const { resolvers: mprResolvers } = require('./mpr/resolvers');
const { resolvers: supplierResolvers } = require('./supplier/resolvers');
const { resolvers: outstandingPoResolvers } = require('./outstandingPo/resolvers');
const { resolvers: wmrResolvers } = require('./wmr/resolvers');
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
  typeDefs: [Query, Auth, Bom, Material, Mpr, Supplier, OutstandingPo, Wmr, User],
  resolvers: [
    authResolvers, bomResolvers, materialResolvers, mprResolvers, supplierResolvers,
    outstandingPoResolvers, wmrResolvers, userResolvers,
  ],
};
