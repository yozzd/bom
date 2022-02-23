import gql from 'graphql-tag';

const GetLT = gql`
  query getLT {
    getLT {
      id
      ltNo
      wos {
        id
        woNo
        status
      }
    }
  }
`;

export default GetLT;
