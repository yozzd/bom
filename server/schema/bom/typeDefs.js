const typeDefs = `
  extend type Query {
    getLt: [Lt]
  }

  type Lt {
    id: Int
    ltNo: String
    wos: [Wo]
  }
  
  type Wo {
    id: Int
    woNo: String
  }
`;

module.exports = { typeDefs };
