const typeDefs = `
  extend type Query {
    getAllWmr(department: Int): [Wmr]
    getWmrByWo(idWo: Int): [Wmr]
  }

  extend type Mutation {
    addWmr(input: AddWmrInput): Wmr
  }

  type Wmr {
    id: Int
    no: String
    requestById: String
    requestBy: String
    requestByTimestamp: String
    authorizedById: String
    authorizedBy: String
    department: Int
    section: Int
    idWo: Int
  }
  
  input AddWmrInput {
    requestById: String
    requestBy: String
    authorizedById: String
    authorizedBy: String
    idWo: Int
  }
`;

module.exports = { typeDefs };
