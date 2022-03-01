const typeDefs = `
  extend type Query {
    getLT(status: Int): [LT]
    getWO(idLt: Int, status: Int): [WO]
  }

  type LT {
    id: Int
    ltNo: String
    customer: String
    wos: [WO]
  }
  
  type WO {
    id: Int
    woNo: String
    status: Int
  }
`;

module.exports = { typeDefs };
