const typeDefs = `
  extend type Query {
    getLTAll(status: Int): [LT]
    getLTOne(idLt: Int, status: Int): LT
  }

  type LT {
    id: Int
    ltNo: String
    customer: String
    totalBudget: Float
    totalPriceWO: Float
    wos: [WO]
  }
  
  type WO {
    id: Int
    woNo: String
    model: String
    product: String
    issued: String
    unit: Int
    budget: Float
    status: Int
    totalPricePerUnit: Float
    totalPricePerWO: Float
    difference: Float
    totalYetToPurchase: Float
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
