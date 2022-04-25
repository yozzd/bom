const typeDefs = `
  extend type Query {
    me: User
  }

  type User {
    name: String
    group: Int
    department: Int
    section: Int
    fullname: String
    isManager: Int
  }
`;

module.exports = { typeDefs };
