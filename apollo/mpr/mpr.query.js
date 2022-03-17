import gql from 'graphql-tag';

export const GetAllMPR = gql`
  query getAllMPR($status: Int) {
    getAllMPR(status: $status) {
      id
      no
      woNo
      category
      dor
    }
  }
`;

export const fake = {};
