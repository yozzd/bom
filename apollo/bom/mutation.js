import gql from 'graphql-tag';

export const UpdateItem = gql`
  mutation updateItem($input: UpdateItemInput) {
    updateItem(input: $input) {
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
