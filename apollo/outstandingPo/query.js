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
      totalPoPaidUsd
      totalPoBalanceUsd
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

export const GetAllOutstandingPoByPoNo = gql`
  query getAllOutstandingPoByPoNo($poNo: String) {
    getAllOutstandingPoByPoNo(poNo: $poNo) {
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

export const GetProposedPoNo = gql`
  query getProposedPoNo {
    getProposedPoNo {
      poNo
    }
  }
`;

export const CheckPo = gql`
  query checkPo($poNo: String) {
    checkPo(poNo: $poNo) {
      status
    }
  }
`;

export const GenOutXLS = gql`
  query genOutXLS($input: GenOutXLSInput) {
    genOutXLS(input: $input) {
      status
    }
  }
`;
