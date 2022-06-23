const typeDefs = `
  extend type Query {
    getAllWmr: [Wmr]
    getOneWmr(id: Int): Wmr
    getWmrByWo(idWo: Int): [Wmr]
    printWmr(id: Int): WmrStatus
  }

  extend type Mutation {
    addWmr(input: AddWmrInput): Wmr
    editWmr(input: EditWmrInput): Wmr
    addItemsToWmr(input: [AddItemsToWmrInput]): [WOITEM]
    approveWmr(input: ApproveWmrInput): Wmr
    disapproveWmr(input: ApproveWmrInput): Wmr
    deleteWmr(input: [DeleteWmrInput]): [Wmr]
    stockWmrItem(input: [StockWmrItemInput]): [WOITEM]
    updateWmrWhItem(input: UpdateWmrWhItemInput): WOITEM
    updateWmrPrItem(input: UpdateWmrPrItemInput): WOITEM
  }

  type Wmr {
    id: Int
    no: String
    requestedById: String
    requestedBy: String
    requestedByTimestamp: String
    authorizedById: String
    authorizedBy: String
    authorizedByApproved: Int
    authorizedByTimestamp: String
    issuedById: String
    issuedBy: String
    issuedByTimestamp: String
    receivedById: String
    receivedBy: String
    department: Int
    section: Int
    idWo: Int
    wo: WO
    items: [WOITEM]
  }

  type WmrStatus {
    status: Int
  }
  
  input AddWmrInput {
    requestedById: String
    requestedBy: String
    authorizedById: String
    authorizedBy: String
    idWo: Int
  }
  
  input EditWmrInput {
    id: Int
    requestedById: String
    requestedBy: String
    authorizedById: String
    authorizedBy: String
    issuedById: String
    issuedBy: String
    receivedById: String
    receivedBy: String
    idWo: Int
  }
  
  input AddItemsToWmrInput {
    id: Int
    isMpr: Int
    idWmr: Int
  }
  
  input ApproveWmrInput {
    id: Int
    type: String
  }
  
  input DeleteWmrInput {
    id: Int
  }
  
  input StockWmrItemInput {
    id: Int
    isMpr: Int
    type: Int
  }
  
  input UpdateWmrWhItemInput {
    id: Int
    isMpr: Int
    qtyIssued: Float
    wmrWhRemarks: String
  }
  
  input UpdateWmrPrItemInput {
    id: Int
    isMpr: Int
    wmrPrRemarks: String
  }
`;

module.exports = { typeDefs };
