import gql from 'graphql-tag';

export const AddWmr = gql`
  mutation addWmr($input: AddWmrInput) {
    addWmr(input: $input) {
      id
      no
    }
  }
`;

export const AddItemsToWmr = gql`
  mutation addItemsToWmr($input: [AddItemsToWmrInput]) {
    addItemsToWmr(input: $input) {
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
      idHeader
      idModule
      colorClass
      mpr {
        id
        no
      }
      wmr3 {
        id
        no
      }
    }
  }
`;

export const ApproveWmr = gql`
  mutation approveWmr($input: ApproveWmrInput) {
    approveWmr(input: $input) {
      id
      no
      requestedById
      requestedBy
      requestedByTimestamp
      authorizedById
      authorizedBy
      authorizedByApproved
      authorizedByTimestamp
      wo {
        id
        woNo
        idLt
      }
    }
  }
`;

export const DisapproveWmr = gql`
  mutation disapproveWmr($input: ApproveWmrInput) {
    disapproveWmr(input: $input) {
      id
      no
      requestedById
      requestedBy
      requestedByTimestamp
      authorizedById
      authorizedBy
      authorizedByApproved
      authorizedByTimestamp
      wo {
        id
        woNo
        idLt
      }
    }
  }
`;

export const DeleteWmr = gql`
  mutation deleteWmr($input: [DeleteWmrInput]) {
    deleteWmr(input: $input) {
      id
    }
  }
`;
