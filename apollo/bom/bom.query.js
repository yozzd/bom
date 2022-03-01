import gql from 'graphql-tag';

export const GetLT = gql`
  query getLT($status: Int) {
    getLT(status: $status) {
      id
      ltNo
      customer
      wos {
        id
        woNo
        status
      }
    }
  }
`;

export const GetWO = gql`
  query getWO($idLt: Int, $status: Int) {
    getWO(idLt: $idLt, status: $status) {
      id
      woNo
      status
    }
  }
`;
