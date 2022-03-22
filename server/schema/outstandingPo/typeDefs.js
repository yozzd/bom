const typeDefs = `
  extend type Query {
    getZones: [zones]
    getAllOutstandingPoByCategory(category: Int): outstandingPo
    getAllOutstandingPoByStatus(status: Int): outstandingPo
    getAllOutstandingPoByZones(zone: String): outstandingPo
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
`;

module.exports = { typeDefs };
