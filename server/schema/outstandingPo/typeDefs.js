const typeDefs = `
  extend type Query {
    getAllOutstandinPo: [OUTSTANDINGPO]
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
    approvalDate: String
    comp: String
    hse: String
    poValueUsd: Float
    poPaidUsd: Float
    poBalanceUsd: Float
  }
`;

module.exports = { typeDefs };
