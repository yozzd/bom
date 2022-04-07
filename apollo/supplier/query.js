import gql from 'graphql-tag';

export default gql`
  query getAllSupplier {
    getAllSupplier {
      suplierID
      suplierNM
    }
  }
`;

