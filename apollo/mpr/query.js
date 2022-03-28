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
      attachment
      attachmentCheck
      remark
      wo {
        idLt
      }
    }
  }
`;

export const GetOneMPR = gql`
  query getOneMPR($id: Int) {
    getOneMPR(id: $id) {
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
    }
  }
`;
