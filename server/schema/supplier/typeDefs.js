const typeDefs = `
  extend type Query {
    searchSupplier(key: String): [Supplier]
  }
  
  type Supplier {
    suplierID: Int
    suplierNM: String
  }
`;

module.exports = { typeDefs };
