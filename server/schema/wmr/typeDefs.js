const typeDefs = `
  extend type Query {
    getAllWmr: [Wmr]
    getOneWmr(id: Int): Wmr
    getWmrByWo(idWo: Int): [Wmr]
  }

  extend type Mutation {
    addWmr(input: AddWmrInput): Wmr
    addItemsToWmr(input: [AddItemsToWmrInput]): [WOITEM]
    approveWmr(input: ApproveWmrInput): Wmr
    disapproveWmr(input: ApproveWmrInput): Wmr
    deleteWmr(input: [DeleteWmrInput]): [Wmr]
    stockWmrItem(input: [StockWmrItemInput]): [WOITEM]
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
    department: Int
    section: Int
    idWo: Int
    wo: WO
    items: [WOITEM]
  }
  
  input AddWmrInput {
    requestedById: String
    requestedBy: String
    authorizedById: String
    authorizedBy: String
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
`;

module.exports = { typeDefs };
