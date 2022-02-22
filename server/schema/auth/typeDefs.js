const typeDefs = `
  extend type Query {
    auth(username: String!, password: String!): Auth
  }
  
  type Auth {
    name: String
    token: String
  }
`;

module.exports = { typeDefs };
