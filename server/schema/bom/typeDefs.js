const typeDefs = `
  extend type Query {
    getLT(status: Int): [LT]
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
