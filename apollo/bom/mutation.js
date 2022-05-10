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
      bomQtyRqd
      bomQtyBalance
      bomQtyStock
      bomEta
      bomQtyRec
      bomDateRec
      bomCurrSizeC
      bomCurrSizeV
      bomCurrEaC
      bomCurrEaV
      bomUsdEa
      bomUsdUnit
      bomUsdTotal
      materialsProcessed
      yetToPurchase
      bomSupplier
      bomPoDate
      bomPoNo
      bomRemarks
      priority
      bomEtaStatus
      sr
      isMpr
      packing
      hold
      cancel
      colorClass
    }
  }
`;

export const DeleteItem = gql`
  mutation deleteItem($input: [DeleteItemInput]) {
    deleteItem(input: $input) {
      id
    }
  }
`;
