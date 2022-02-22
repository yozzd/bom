const typeDefs = `
  extend type Query {
    me: User
  }

  type User {
    name: String
    group: String
    section: String
  }
`;

module.exports = { typeDefs };
