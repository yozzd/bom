const typeDefs = `
  extend type Query {
    getAllSupplier(key: String): [Supplier]
  }
  
  type Supplier {
    suplierID: Int
    suplierNM: String
  }
`;

module.exports = { typeDefs };
