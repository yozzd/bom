const typeDefs = `
  extend type Query {
    getSearchItems(key: String): [Material]
  }
  
  type Material {
    MaterialCD: Int
    MaterialNM: String
    MaterialDesc: String
    Model: String
    Brand: String
    unit: String
  }
`;

module.exports = { typeDefs };
