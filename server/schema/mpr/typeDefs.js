const typeDefs = `
  extend type Query {
    getAllMPR: [MPR]
  }

  type MPR {
    id: Int
    no: String
    woNo: String
    category: Int
    dor: String
  }
`;

module.exports = { typeDefs };
