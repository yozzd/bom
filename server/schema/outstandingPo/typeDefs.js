const typeDefs = `
  extend type Query {
    getAllOutstandingPo(zone: Int): [OUTSTANDINGPO]
  }

  type OUTSTANDINGPO {
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
    poRemarksFinance: String
    poRemarksWarehouse: String
    colorClass: String
  }
`;

module.exports = { typeDefs };
