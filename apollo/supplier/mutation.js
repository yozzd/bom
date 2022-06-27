import gql from 'graphql-tag';

export const AddSupplier = gql`
  mutation addSupplier($input: AddSupplierInput) {
    addSupplier(input: $input) {
      suplierID
      suplierNM
      ContactPerson
      Address
      Country
      PostCode
      OfficePhone
      FaxNo
      Email
      HomePage
      Remark
    }
  }
`;

export const DeleteSupplier = gql`
  mutation deleteSupplier($input: [DeleteSupplierInput]) {
    deleteSupplier(input: $input) {
      suplierID
    }
  }
`;

export const empty = null;
