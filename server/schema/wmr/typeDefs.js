const typeDefs = `
  extend type Query {
    getAllWmr: [Wmr]
    getOneWmr(id: Int): Wmr
    getWmrByWo(idWo: Int): [Wmr]
  }

  extend type Mutation {
    addWmr(input: AddWmrInput): Wmr
    addItemsToWmr(input: [AddItemsToWmrInput]): [WOITEM]
    deleteWmr(input: [DeleteWmrInput]): [Wmr]
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
  
  input DeleteWmrInput {
    id: Int
  }
`;

module.exports = { typeDefs };
