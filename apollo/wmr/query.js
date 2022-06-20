import gql from 'graphql-tag';

export const GetAllWmr = gql`
  query getAllWmr {
    getAllWmr {
      id
      no
      requestById
      requestBy
      requestByTimestamp
      authorizedById
      authorizedBy
      authorizedTimestamp
    }
  }
`;

export const GetWmrByWo = gql`
  query getWmrByWo($idWo: Int) {
    getWmrByWo(idWo: $idWo) {
      id
      no
    }
  }
`;
