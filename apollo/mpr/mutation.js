import gql from 'graphql-tag';

export const CreateMpr = gql`
  mutation createMpr($input: CreateMprInput) {
    createMpr(input: $input) {
      id
      status
      no
      woNo
      model
      product
      projectName
      unit
      category
      dor
      idWo
      requestorName
      requestorTimestamp
      managerApproved
      managerTimestamp
      whApproved
      whTimestamp
      bomApproved
      bomTimestamp
      attachment
      attachmentCheck
      remark
      packing
      hold
      cancel
      wo {
        idLt
      }
    }
  }
`;

export const UpdateMpr = gql`
  mutation updateMpr($input: UpdateMprInput) {
    updateMpr(input: $input) {
      id
      status
      no
      woNo
      model
      product
      projectName
      unit
      category
      dor
      idWo
      requestorName
      requestorTimestamp
      managerApproved
      managerTimestamp
      whApproved
      whTimestamp
      bomApproved
      bomTimestamp
      attachment
      attachmentCheck
      remark
      packing
      hold
      cancel
      wo {
        idLt
      }
    }
  }
`;

export const DeleteMpr = gql`
  mutation deleteMpr($input: [DeleteMprInput]) {
    deleteMpr(input: $input) {
      id
    }
  }
`;
