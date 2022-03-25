import gql from 'graphql-tag';

export const GetAllMPR = gql`
  query getAllMPR($status: Int) {
    getAllMPR(status: $status) {
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
      managerApproved
      managerTimestamp
      whApproved
      whTimestamp
      bomApproved
      bomTimestamp
      wo {
        idLt
      }
    }
  }
`;

export const fake = {};
