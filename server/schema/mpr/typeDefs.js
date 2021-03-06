const typeDefs = `
  scalar Upload

  extend type Query {
    getAllMPR(status: Int): [MPR]
    getOneMPR(id: Int): MPR
    getMprModules(idMpr: Int): [MPRMODULE]
    getMprNotifications(date: String): [MPR]
  }

  extend type Mutation {
    createMpr(input: CreateMprInput): MPR
    updateMpr(input: UpdateMprInput): MPR
    deleteMpr(input: [DeleteMprInput]): [MPR]
    approveMpr(input: ApproveMprInput): MPR
    disapproveMpr(input: ApproveMprInput): MPR
    addMprItems(input: [AddMprItemsInput]): [MPRITEM]
    addMprModule(input: AddMprModuleInput): MPRMODULE
    updateMprModule(input: UpdateMprModuleInput): MPRMODULE
    moveToModule(input: [MoveToModuleInput]): [MPRITEM]
    deleteModule(id: Int): MPRMODULE
    importMpr(input: ImportMprInput): MPR
  }

  type MPR {
    id: Int
    status: String
    no: String
    woNo: String
    model: String
    product: String
    projectName: String
    unit: Int
    category: Int
    dor: String
    idWo: Int
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
    packing: Int
    hold: Int
    cancel: Int
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
    idMpr: Int
    idHeader: Int
    idModule: Int
    oIdModule: Int
    idWmr: Int
    qtyIssued: Float
    wmrPrRemarks: String
    wmrWhRemarks: String
    stockReady: String
    colorClass: String
    module: WOMODULE
    mpr: MPR
    wmr3: Wmr
  }

  input CreateMprInput {
    status: String
    woNo: String
    model: String
    product: String
    unit: Int
    category: Int
    dor: String
    remark: String
    packing: Int
    idWo: Int
    idLt: Int
    ltNo: String
  }

  input UpdateMprInput {
    id: Int
    status: String
    woNo: String
    model: String
    product: String
    unit: Int
    category: Int
    dor: String
    remark: String
    packing: Int
    hold: Int
    cancel: Int
    idLt: Int
    file: Upload
    remAttach: Int
  }

  input DeleteMprInput {
    id: Int
  }

  input AddMprItemsInput {
    bomDescription: String,
    bomSpecification: String,
    bomModel: String,
    bomBrand: String,
    bomUnit: String,
    idMpr: Int
    idWo: Int
    idModule: Int
    idMaterial: Int
  }

  input AddMprModuleInput {
    moduleChar: String
    moduleName: String
    idMpr: Int
  }

  input UpdateMprModuleInput {
    id: Int
    moduleChar: String
    moduleName: String
    idMpr: Int
  }

  input MoveToModuleInput {
    id: Int
    isMpr: Int
    idModule: Int
    oIdModule: Int
  }

  input ApproveMprInput {
    id: Int
    type: String
  }
  
  input ImportMprInput {
    idWo: Int
    idMpr: Int
    file: Upload
  }
  
`;

module.exports = { typeDefs };
