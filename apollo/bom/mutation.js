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
      idHeader
      idModule
      colorClass
      module {
        id
        hid
        header
      }
      mpr {
        id
        no
      }
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

export const AddWoItems = gql`
  mutation addWoItems($input: [AddWoItemsInput]) {
    addWoItems(input: $input) {
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
    }
  }
`;

export const UpdateWoModule = gql`
  mutation updateWoModule($input: UpdateWoModuleInput) {
    updateWoModule(input: $input) {
      id
      hid
      header
      items {
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
      }
    }
  }
`;

export const DeleteWoModule = gql`
  mutation deleteWoModule($id: Int) {
    deleteWoModule(id: $id) {
      id
    }
  }
`;

export const ImportWo = gql`
  mutation importWo($input: ImportWoInput) {
    importWo(input: $input) {
      id
      ltNo
      customer {
        name
        contractDeadLine
        productionDeadLine
      }
      wos {
        id
        woNo
        status
      }
    }
  }
`;

export const DeleteLt = gql`
  mutation deleteLt($id: Int) {
    deleteLt(id: $id) {
      id
    }
  }
`;

export const CloneWo = gql`
  mutation cloneWo($input: CloneWoInput) {
    cloneWo(input: $input) {
      id
      ltNo
      customer {
        name
        contractDeadLine
        productionDeadLine
      }
      wos {
        id
        woNo
        status
      }
    }
  }
`;
