const typeDefs = `
  extend type Query {
    getAllLT(status: Int): [LT]
    getOneLT(id: Int, status: Int): LTGroup
    getOneWO(idLt:Int, id: Int): WODetail
  }

  type LTGroup {
    lt: LT
    ltMpr: LTMPR
  }

  type WODetail {
    lt: LT
    wo: WO
  }
  
  type LT {
    id: Int
    ltNo: String
    customer: customerType
    totalBudget: Float
    totalPriceWO: Float
    wos: [WO]
  }
  
  type WO {
    id: Int
    woNo: String
    idLt: Int
    unit: Int
    cat: String
    model: String
    product: String
    picName: String
    rndic: String
    stage: Int
    issued: String
    sgd: Float
    idr: Float
    euro: Float
    gbp: Float
    myr: Float
    budget: Float
    refer: String
    status: Int
    totalIncoming: Int
    totalValidation: Int
    totalItems: Int
    percentIncoming: Float
    percentValidation: Float
    totalPricePerUnit: Float
    totalPricePerWO: Float
    difference: Float
    totalMaterialsProcessed: Float
    totalYetToPurchase: Float
    totalDeviation: Float
    totalPackingPerUnit: Float
    totalPackingPerWO: Float
    modules: [WOMODULE]
  }
  
  type WOMODULE {
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
    bomSupplier: String
    bomPoDate: String
    bomPoNo: String
    bomRemarks: String
    priority: String
    bomEtaStatus: String
    colorClass: String
  }

  type customerType {
    name: String
    contractDeadLine: String
    productionDeadLine: String
  }
  
  type LTMPR {
    id: Int
    ltNo: String
    customer: customerType
    totalBudget: Float
    totalPriceWO: Float
    wos: [WOMPR]
  }
  
  type WOMPR {
    id: Int
    woNo: String
    unit: Int
    totalIncoming: Int
    totalValidation: Int
    totalItems: Int
    percentIncoming: Float
    percentValidation: Float
    totalPricePerUnit: Float
    totalPricePerWO: Float
    totalMaterialsProcessed: Float
    totalYetToPurchase: Float
    totalPackingPerUnit: Float
    totalPackingPerWO: Float
    mprs: [MPR]
  }
`;

module.exports = { typeDefs };
