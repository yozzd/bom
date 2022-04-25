import gql from 'graphql-tag';

export const CreateMpr = gql`
  mutation createMpr($input: CreateMprInput) {
    createMpr(input: $input) {
      id
      no
      woNo
      model
      product
      projectName
      unit
      category
      dor
      idWo
      packing
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
      wo {
        idLt
      }
    }
  }
`;

export const empty = null;
