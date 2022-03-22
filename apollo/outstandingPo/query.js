import gql from 'graphql-tag';

export const outstandingPoFragment = gql`
  fragment outstandingPo on outstandingPo {
    items {
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
      poCancel
      colorClass
    }
    totals {
      totalPoValueUsd
    }
  }
`;

export const GetAllOutstandingPoByCategory = gql`
  query getAllOutstandingPoByCategory($category: Int) {
    getAllOutstandingPoByCategory(category: $category) {
      ...outstandingPo
    }
  }
  ${outstandingPoFragment}
`;

export const GetAllOutstandingPoByStatus = gql`
  query getAllOutstandingPoByStatus($status: Int) {
    getAllOutstandingPoByStatus(status: $status) {
      ...outstandingPo
    }
  }
  ${outstandingPoFragment}
`;

export const GetAllOutstandingPoByZones = gql`
  query getAllOutstandingPoByZones($zone: String) {
    getAllOutstandingPoByZones(zone: $zone) {
      ...outstandingPo
    }
  }
  ${outstandingPoFragment}
`;

export const GetZones = gql`
  query getZones {
    getZones {
      zone
    }
  }
`;
