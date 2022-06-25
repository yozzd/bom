import gql from 'graphql-tag';

export const DeleteSupplier = gql`
  mutation deleteSupplier($input: [DeleteSupplierInput]) {
    deleteSupplier(input: $input) {
      suplierID
    }
  }
`;

export const empty = null;
