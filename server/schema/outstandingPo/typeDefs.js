const typeDefs = `
  extend type Query {
    getZones: [zones]
    getAllOutstandingPoByCategory(category: Int): outstandingPo
    getAllOutstandingPoByStatus(status: Int): outstandingPo
    getAllOutstandingPoByZones(zone: String): outstandingPo
    getAllOutstandingPoByPoNo(poNo: String): outstandingPo
    getProposedPoNo: [poNum]
    checkPo(poNo: String): GenStatus
    genOutXLS(input: GenOutXLSInput): GenStatus
  }

  extend type Mutation {
    createOutPo(input: CreateOutPoInput): item
    updateOutPo(input: UpdateOutPoInput): item
    deleteOutPo(input: [DeleteOutPoInput]): [item]
  }

  type outstandingPo {
    items: [item]
    totals: [total]
  }
  
  type item {
    id: Int
    poIssue: String
    poZone: String
    poNo: String
    poSupplier: String
    poDescription: String
    poKvalue: String
    poValue: Float
    poLt: String
    poLpayment: String
    poBom: String
    poAdmin: String
    poFinance: String
    poEta: String
    poArrival: String
    poStatus: String
    approvalDate: String
    comp: String
    hse: String
    poValueUsd: Float
    poPaidUsd: Float
    poBalanceUsd: Float
    arrivalStatus: String
    poRemarks: String
    poRemarksBom: String
    poRemarksAdmin: String
    poRemarksFinance: String
    poRemarksWarehouse: String
    poCancel: Int
    colorClass: String
  }

  type total {
    totalPoValueUsd: Float
    totalPoPaidUsd: Float
    totalPoBalanceUsd: Float
  }

  type zones {
    zone: String
  }

  type poNum {
    poNo: String
  }

  input CreateOutPoInput {
    poIssue: String
    poZone: String
    poNo: String
    poSupplier: String
    poDescription: String
    poKvalue: String
    poValue: Float
    poLt: String
    poLpayment: String
    poEta: String
    poRemarks: String
  }

  input UpdateOutPoInput {
    id: Int
    poIssue: String
    approvalDate: String
    poZone: String
    poNo: String
    poSupplier: String
    poDescription: String
    poKvalue: String
    poValue: Float
    poValueUsd: Float
    poPaidUsd: Float
    poLt: String
    poLpayment: String
    poBom: String
    poAdmin: String
    poFinance: String
    poEta: String
    poArrival: String
    poStatus: String
    comp: String
    hse: String
    poCancel: Int
    poRemarks: String
    poRemarksBom: String
    poRemarksAdmin: String
    poRemarksFinance: String
    poRemarksWarehouse: String
  }

  input DeleteOutPoInput {
    id: Int
  }
  
  input GenOutXLSInput {
    mode: Int
    category: Int
    status: Int
    zone: String
    header: String
  }
`;

module.exports = { typeDefs };
