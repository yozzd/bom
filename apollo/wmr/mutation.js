import gql from 'graphql-tag';

export const AddWmr = gql`
  mutation addWmr($input: AddWmrInput) {
    addWmr(input: $input) {
      id
      no
    }
  }
`;

export const EditWmr = gql`
  mutation editWmr($input: EditWmrInput) {
    editWmr(input: $input) {
      id
      no
      requestedById
      requestedBy
      requestedByTimestamp
      authorizedById
      authorizedBy
      authorizedByApproved
      authorizedByTimestamp
      issuedById
      issuedBy
      issuedByTimestamp
      receivedById
      receivedBy
      wo {
        id
        woNo
        idLt
      }
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
      qtyIssued
      wmrPrRemarks
      wmrWhRemarks
      stockReady
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
      issuedById
      issuedBy
      issuedByTimestamp
      receivedById
      receivedBy
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
      issuedById
      issuedBy
      issuedByTimestamp
      receivedById
      receivedBy
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

export const StockWmrItem = gql`
  mutation stockWmrItem($input: [StockWmrItemInput]) {
    stockWmrItem(input: $input) {
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
      qtyIssued
      wmrPrRemarks
      wmrWhRemarks
      stockReady
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

export const UpdateWmrWhItem = gql`
  mutation updateWmrWhItem($input: UpdateWmrWhItemInput) {
    updateWmrWhItem(input: $input) {
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
      qtyIssued
      wmrPrRemarks
      wmrWhRemarks
      stockReady
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

export const UpdateWmrPrItem = gql`
  mutation updateWmrPrItem($input: UpdateWmrPrItemInput) {
    updateWmrPrItem(input: $input) {
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
      qtyIssued
      wmrPrRemarks
      wmrWhRemarks
      stockReady
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
