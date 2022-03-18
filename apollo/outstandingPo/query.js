import gql from 'graphql-tag';

export const GetAllOutstandingPo = gql`
  query getAllOutstandingPo {
    getAllOutstandingPo {
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
      approvalDate
      comp
      hse
      poValueUsd
      poPaidUsd
      poBalanceUsd
    }
  }
`;

export const fake = {};