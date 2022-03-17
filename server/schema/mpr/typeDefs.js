const typeDefs = `
  extend type Query {
    getAllMPR(status: Int): [MPR]
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
  }
`;

module.exports = { typeDefs };
