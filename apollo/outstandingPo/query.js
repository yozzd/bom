import gql from 'graphql-tag';

export const GetAllOutstandingPo = gql`
  query getAllOutstandingPo($category: Int) {
    getAllOutstandingPo(category: $category) {
      id
      poIssue
      poZone
      poNo
      poSupplier
      poDescription
      poKvalue
      poValue
      poLt
      poLpayment
      poBom
      poAdmin
      poFinance
      poEta
      poArrival
      poStatus
      approvalDate
      comp
      hse
      poValueUsd
      poPaidUsd
      poBalanceUsd
      arrivalStatus
      poRemarks
      poRemarksBom
      poRemarksAdmin
      poRemarksFinance
      poRemarksWarehouse
      colorClass
    }
  }
`;

export const fake = {};
