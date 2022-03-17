import gql from 'graphql-tag';

export const GetAllMPR = gql`
  query getAllMPR {
    getAllMPR {
      id
      no
      woNo
      category
      dor
    }
  }
`;

export const fake = {};
