import gql from 'graphql-tag';

export default gql`
  query getAllSupplier($key: String) {
    getAllSupplier(key: $key) {
      suplierID
      suplierNM
    }
  }
`;
