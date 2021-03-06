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
      wmr3 {
        id
        no
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
        wmr3 {
          id
          no
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
        wmr3 {
          id
          no
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
      oIdModule
      colorClass
      module {
        id
        hid
        header
      }
      wmr3 {
        id
        no
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

export const DisapproveMpr = gql`
  mutation disapproveMpr($input: ApproveMprInput) {
    disapproveMpr(input: $input) {
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

export const ImportMpr = gql`
  mutation importMpr($input: ImportMprInput) {
    importMpr(input: $input) {
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
      requestorName
      packing
      hold
      cancel
      wo {
        id
        euro
        gbp
        myr
        idr
        sgd
      }
      modules {
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
          wmr3 {
            id
            no
          }
        }
      }
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
        wmr3 {
          id
          no
        }
      }
    }
  }
`;
