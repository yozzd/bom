const typeDefs = `
  extend type Query {
    getAllWmr: [Wmr]
    getWmrByWo(idWo: Int): [Wmr]
  }

  extend type Mutation {
    addWmr(input: AddWmrInput): Wmr
    addItemsToWmr(input: [AddItemsToWmrInput]): [WOITEM]
  }

  type Wmr {
    id: Int
    no: String
    requestById: String
    requestBy: String
    requestByTimestamp: String
    authorizedById: String
    authorizedBy: String
    authorizedByTimestamp: String
    department: Int
    section: Int
    idWo: Int
    wo: WO
  }
  
  input AddWmrInput {
    requestById: String
    requestBy: String
    authorizedById: String
    authorizedBy: String
    idWo: Int
  }
  
  input AddItemsToWmrInput {
    id: Int
    isMpr: Int
    idWmr: Int
  }
`;

module.exports = { typeDefs };
