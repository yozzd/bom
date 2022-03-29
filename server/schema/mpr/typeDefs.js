const typeDefs = `
  extend type Query {
    getAllMPR(status: Int): [MPR]
    getOneMPR(id: Int): MPR
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
    requestorName: String
    requestorTimestamp: String
    managerApproved: Int
    managerTimestamp: String
    whApproved: Int
    whTimestamp: String
    bomApproved: Int
    bomTimestamp: String
    attachment: String
    attachmentCheck: Boolean
    remark: String
    wo: WO
    modules: [MODULE]
  }

  type WO {
    idLt: Int
  }

  type MODULE {
    id: Int
    moduleChar: String
    moduleName: String
    items: [ITEM]
  }

  type ITEM {
    id: Int
    bomDescription: String
  }
`;

module.exports = { typeDefs };
