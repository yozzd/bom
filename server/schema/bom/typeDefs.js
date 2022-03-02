const typeDefs = `
  extend type Query {
    getLTAll(status: Int): [LT]
    getLTOne(idLt: Int, status: Int): LT
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
    budget: Float
    status: Int
    items: [WOITEM]
  }
  
  type WOITEM {
    id: Int
    bomDescription: String
    bomSpecification: String
  }
`;

module.exports = { typeDefs };
