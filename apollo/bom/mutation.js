import gql from 'graphql-tag';

export const UpdateITEM = gql`
  mutation updateITEM($input: UpdateItemInput) {
    updateITEM(input: $input) {
      id
      idMaterial
      bomDescription
      bomSpecification
      bomModel
      bomBrand
      bomQty
      bomUnit
      bomQtyStock
      bomEta
      bomQtyRec
      bomDateRec
      bomCurrSizeC
      bomCurrSizeV
      bomCurrEaC
      bomCurrEaV
      bomSupplier
      bomPoDate
      bomPoNo
      bomRemarks
    }
  }
`;

export const empty = null;
