const typeDefs = `
  extend type Query {
    getLT: [LT]
  }

  type LT {
    id: Int
    ltNo: String
    wos: [WO]
  }
  
  type WO {
    id: Int
    woNo: String
    status: Int
  }
`;

module.exports = { typeDefs };
