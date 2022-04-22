import gql from 'graphql-tag';

export const CreateOutPo = gql`
  mutation createOutPo($input: CreateOutPoInput) {
    createOutPo(input: $input) {
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

export const DeleteOutPo = gql`
  mutation deleteOutPo($input: [DeleteOutPoInput]) {
    deleteOutPo(input: $input) {
      id
    }
  }
`;
