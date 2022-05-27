const typeDefs = `
  scalar Upload

  extend type Query {
    getAllLT(status: Int): [LT]
    getOneLT(id: Int, status: Int): LT
    getOneWO(idLt:Int, id: Int): WODetail
    getWoModules(idWo: Int): [WOMODULE]
    getAllWoRunning(key: String): [WO]
    getAllWoModules(key: String): [WO]
    getSearchItems(key: String): [WOITEM]
    getSearchModules(idHeader: Int): [WOITEM]
  }

  extend type Mutation {
    updateItem(input: UpdateItemInput): WOITEM
    deleteItem(input: [DeleteItemInput]): [WOITEM]
    addWoItems(input: [AddWoItemsInput]): [WOITEM]
    updateWoModule(input: UpdateWoModuleInput): WOMODULE
    deleteWoModule(id: Int): WOMODULE
    importWo(input: ImportWoInput): LT
    deleteLt(id: Int): LT
    cloneWo(input: CloneWoInput): LT
    deleteWo(id: Int): WO
    validateWoItem(input: [ValidateWoItemInput]): [WOITEM]
    updateWo(input: UpdateWoInput): WO
  }

  type WODetail {
    lt: LT
    wo: WO
    mpr: WOMPR
  }
  
  type LT {
    id: Int
    ltNo: String
    customer: customerType
    totalBudget: Float
    totalPriceWO: Float
    totalPrice: Float
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
    pic: Int
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
    totalIncomingItems: Int
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
    bomIncoming: Float
    mprIncoming: Float
    bomPercentIncoming: Float
    mprPercentIncoming: Float
    bomValidation: Float
    mprValidation: Float
    bomPercentValidation: Float
    mprPercentValidation: Float
    totalMpr: Int
    lt: LT
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
    sr: Int,
    isMpr: Int
    packing: Int
    hold: Int
    cancel: Int
    idHeader: Int
    idModule: Int
    colorClass: String
    mpr: MPR
    wo: WO
    module: WOMODULE
  }

  type customerType {
    name: String
    contractDeadLine: String
    productionDeadLine: String
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
    totalMpr: Int
    mprs: [MPR]
  }

  input UpdateItemInput {
    id: Int
    idMaterial: Int
    bomDescription: String
    bomSpecification: String
    bomModel: String
    bomBrand: String
    bomQty: Float
    bomUnit: String
    bomQtyStock: Float
    bomEta: String
    bomQtyRec: Float
    bomDateRec: String
    bomCurrSizeC: String
    bomCurrSizeV: Float
    bomCurrEaC: String
    bomCurrEaV: Float
    bomSupplier: String
    bomPoDate: String
    bomPoNo: String
    bomRemarks: String
    priority: String
    sr: Int
    isMpr: Int
    packing: Int
    hold: Int
    cancel: Int
    idHeader: Int
    idModule: Int
    unit: Int
    sgd: Float
    idr: Float
    euro: Float
    gbp: Float
    myr: Float
    fromMpr: Boolean
  }

  input DeleteItemInput {
    id: Int
    isMpr: Int
    idModule: Int
  }

  input AddWoItemsInput {
    id: Int
    isMpr: Int
    idWo: Int
    idHeader: Int
    idLt: Int
  }

  input UpdateWoModuleInput {
    id: Int
    hid: String
    header: String
  }

  input ImportWoInput {
    file: Upload
  }
  
  input CloneWoInput {
    id: Int
    ltNo: String
    woNo: String
    unit: Int
    eta: String
    fill: Int
    complete: Int
  }

  input ValidateWoItemInput {
    id: Int
    isMpr: Int
    validasi: Int
  }
  
  input UpdateWoInput {
    id: Int
    issued: String
    cat: String
    model: String
    product: String
    pic: Int
    rndic: String
    unit: Int
    budget: Int
    refer: String
    stage: Int
    status: Int
  }
`;

module.exports = { typeDefs };
