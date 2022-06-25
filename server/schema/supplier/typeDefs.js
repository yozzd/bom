const typeDefs = `
  extend type Query {
    getAllSupplier: [Supplier]
    searchSupplier(key: String): [Supplier]
  }

  extend type Mutation {
    deleteSupplier(input: [DeleteSupplierInput]): [Supplier]
  }
  
  type Supplier {
    suplierID: Int
    suplierNM: String
    ContactPerson: String
    Address: String
    Country: String
    PostCode: String
    OfficePhone: String
    FaxNo: String
    Email: String
    HomePage: String
    Remark: String
  }
  
  input DeleteSupplierInput {
    suplierID: Int
  }
`;

module.exports = { typeDefs };
