import gql from 'graphql-tag';

export const UpdateOutPo = gql`
  mutation updateOutPo($input: UpdateOutPoInput) {
    updateOutPo(input: $input) {
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
  }
`;

export const empty = null;
