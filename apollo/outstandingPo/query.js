import gql from 'graphql-tag';

export const GetAllOutstandingPo = gql`
  query getAllOutstandingPo($zone: Int) {
    getAllOutstandingPo(zone: $zone) {
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
      poRemarksFinance
      poRemarksWarehouse
      colorClass
    }
  }
`;

export const fake = {};
