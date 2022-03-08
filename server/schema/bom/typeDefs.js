const typeDefs = `
  extend type Query {
    getAllLT(status: Int): [LT]
    getOneLT(idLt: Int, status: Int): LT
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
    totalIncoming: Int
    totalItems: Int
    percentIncoming: Float
    totalPricePerUnit: Float
    totalPricePerWO: Float
    difference: Float
    totalYetToPurchase: Float
    totalPackingPerWO: Float
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
