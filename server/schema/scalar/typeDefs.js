const typeDefs = `
  extend type Query {
    getAllSupplier(): [Supplier]
  }

  type Supplier {
    suplierID: Int
    suplierNM: String
  }
`;

module.exports = { typeDefs };
