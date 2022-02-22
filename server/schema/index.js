const { typeDefs: Auth } = require('./auth/typeDefs');
const { typeDefs: User } = require('./user/typeDefs');

const { resolvers: authResolvers } = require('./auth/resolvers');
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
  typeDefs: [Query, Auth, User],
  resolvers: [authResolvers, userResolvers],
};
