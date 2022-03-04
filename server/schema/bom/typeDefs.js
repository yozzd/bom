const typeDefs = `
  extend type Query {
    getLTAll(status: Int): [LT]
    getLTOne(idLt: Int, status: Int): LT
  }

  type LT {
    id: Int
    ltNo: String
    customer: String
    totalPriceWO: Float
    wos: [WO]
  }
  
  type WO {
    id: Int
    woNo: String
    unit: Int
    budget: Float
    status: Int
    totalPricePerUnit: Float
    totalPricePerWO: Float
    headers: [WOHEADER]
  }
  
  type WOHEADER {
    id: Int
    hid: String
    header: String
    items: [WOITEM]
  }
  
  type WOITEM {
    id: Int
    bomDescription: String
    bomSpecification: String
  }
`;

module.exports = { typeDefs };
