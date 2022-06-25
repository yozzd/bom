import gql from 'graphql-tag';

export default gql`
  query searchSupplier($key: String) {
    searchSupplier(key: $key) {
      suplierID
      suplierNM
    }
  }
`;
