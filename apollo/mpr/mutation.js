import gql from 'graphql-tag';

export const CreateMpr = gql`
  mutation createMpr($input: CreateMprInput) {
    createMpr(input: $input) {
      id
      status
      no
      woNo
      model
      product
      projectName
      unit
      category
      dor
      idWo
      requestorName
      requestorTimestamp
      managerApproved
      managerTimestamp
      whApproved
      whTimestamp
      bomApproved
      bomTimestamp
      attachment
      attachmentCheck
      remark
      packing
      hold
      cancel
      wo {
        idLt
      }
    }
  }
`;

export const UpdateMpr = gql`
  mutation updateMpr($input: UpdateMprInput) {
    updateMpr(input: $input) {
      id
      status
      no
      woNo
      model
      product
      projectName
      unit
      category
      dor
      idWo
      requestorName
      requestorTimestamp
      managerApproved
      managerTimestamp
      whApproved
      whTimestamp
      bomApproved
      bomTimestamp
      attachment
      attachmentCheck
      remark
      packing
      hold
      cancel
      wo {
        idLt
      }
    }
  }
`;

export const DeleteMpr = gql`
  mutation deleteMpr($input: [DeleteMprInput]) {
    deleteMpr(input: $input) {
      id
    }
  }
`;

export const AddMprItems = gql`
  mutation addMprItems($input: [AddMprItemsInput]) {
    addMprItems(input: $input) {
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
      idMpr
      idHeader
      idModule
      colorClass
      module {
        id
        hid
        header
      }
    }
  }
`;

export const AddMprModule = gql`
  mutation addMprModule($input: AddMprModuleInput) {
    addMprModule(input: $input) {
      id
      moduleChar
      moduleName
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
        module {
          id
          hid
          header
        }
      }
    }
  }
`;

export const UpdateMprModule = gql`
  mutation updateMprModule($input: UpdateMprModuleInput) {
    updateMprModule(input: $input) {
      id
      moduleChar
      moduleName
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
        module {
          id
          hid
          header
        }
      }
    }
  }
`;

export const MoveToModule = gql`
  mutation moveToModule($input: [MoveToModuleInput]) {
    moveToModule(input: $input) {
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
      idMpr
      idHeader
      idModule
      colorClass
      module {
        id
        hid
        header
      }
    }
  }
`;

export const ApproveMpr = gql`
  mutation approveMpr($input: ApproveMprInput) {
    approveMpr(input: $input) {
      id
      status
      no
      woNo
      model
      product
      projectName
      unit
      category
      dor
      idWo
      requestorName
      requestorTimestamp
      managerApproved
      managerTimestamp
      whApproved
      whTimestamp
      bomApproved
      bomTimestamp
      attachment
      attachmentCheck
      remark
      packing
      hold
      cancel
      wo {
        idLt
      }
    }
  }
`;

export const DeleteModule = gql`
  mutation deleteModule($id: Int) {
    deleteModule(id: $id) {
      id
    }
  }
`;
