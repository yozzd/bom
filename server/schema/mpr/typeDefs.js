const typeDefs = `
  extend type Query {
    getAllMPR(status: Int): [MPR]
    getOneMPR(id: Int): MPR
  }

  type MPR {
    id: Int
    no: String
    woNo: String
    model: String
    product: String
    projectName: String
    unit: Int
    category: Int
    dor: String
    idWo: Int
    packing: Int
    requestorName: String
    requestorTimestamp: String
    managerApproved: Int
    managerTimestamp: String
    whApproved: Int
    whTimestamp: String
    bomApproved: Int
    bomTimestamp: String
    attachment: String
    attachmentCheck: Boolean
    remark: String
    wo: WO
    modules: [MPRMODULE]
    items: [MPRITEM]
  }

  type WO {
    idLt: Int
  }

  type MPRMODULE {
    id: Int
    moduleChar: String
    moduleName: String
    idMpr: Int
    items: [MPRITEM]
  }

  type MPRITEM {
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
    bomSupplier: String
    bomPoDate: String
    bomPoNo: String
    bomRemarks: String
    priority: String
    bomEtaStatus: String
    sr: Int
    isMpr: Int
    packing: Int
    hold: Int
    cancel: Int
    colorClass: String
    module: WOMODULE
  }
`;

module.exports = { typeDefs };
