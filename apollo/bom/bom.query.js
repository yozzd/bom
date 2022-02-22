import gql from 'graphql-tag';

const GetLt = gql`
  query getLt {
    getLt {
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

export default GetLt;
