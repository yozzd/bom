import gql from 'graphql-tag';

const GetLT = gql`
  query getLT($status: Int) {
    getLT(status: $status) {
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
