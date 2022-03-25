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
      requestorName
      requestorTimestamp
      managerApproved
      managerTimestamp
      whApproved
      whTimestamp
      bomApproved
      bomTimestamp
      remark
      wo {
        idLt
      }
    }
  }
`;

export const fake = {};
