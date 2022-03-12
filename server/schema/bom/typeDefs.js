const typeDefs = `
  extend type Query {
    getAllLT(status: Int): [LT]
    getOneLT(id: Int, status: Int): LT
    getOneWO(id: Int): WO
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
    stage: Int
    status: Int
    totalIncoming: Int
    totalValidation: Int
    totalItems: Int
    percentIncoming: Float
    percentValidation: Float
    totalPricePerUnit: Float
    totalPricePerWO: Float
    difference: Float
    totalYetToPurchase: Float
    totalDeviation: Float
    totalPackingPerUnit: Float
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
    idMaterial: Int
    bomDescription: String
    bomSpecification: String
    bomModel: String
    bomBrand: String
    bomQty: Float
    bomUnit: String
    bomQtyRqd: Float
    bomQtyBalance: Float
    bomQtyStock: Float
    bomEta: String
    bomQtyRec: Float
    bomDateRec: String
    bomCurrSizeC: String
    bomCurrSizeV: Float
    bomCurrEaC: String
    bomCurrEaV: Float
    bomUsdEa: Float
    bomUsdUnit: Float
    bomUsdTotal: Float
    materialsProcessed: Float
    yetToPurchase: Float
  }
`;

module.exports = { typeDefs };
