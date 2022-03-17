import gql from 'graphql-tag';

export const GetAllMPR = gql`
  query getAllMPR {
    getAllMPR {
      id
      no
      woNo
      model
      product
      projectName
      unit
      category
      dor
      idWo
      packing
    }
  }
`;

export const fake = {};
