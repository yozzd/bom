import gql from 'graphql-tag';

export const GetAllSupplier = gql`
  query getAllSupplier {
    getAllSupplier {
      suplierID
      suplierNM
      ContactPerson
      Address
      Country
      PostCode
      OfficePhone
      Email
      HomePage
      Remark
    }
  }
`;

export const SearchSupplier = gql`
  query searchSupplier($key: String) {
    searchSupplier(key: $key) {
      suplierID
      suplierNM
    }
  }
`;
