import gql from 'graphql-tag';

export const GetAllMPR = gql`
  query getAllMPR($status: Int) {
    getAllMPR(status: $status) {
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

export const GetOneMPR = gql`
  query getOneMPR($id: Int) {
    getOneMPR(id: $id) {
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
      whApproved
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
          mpr {
            id
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
        mpr {
          id
        }
      }
    }
  }
`;

export const GetMprModules = gql`
  query getMprModules($idMpr: Int) {
    getMprModules(idMpr: $idMpr) {
      id
      moduleChar
      moduleName
    }
  }
`;

export const GetMprNotifications = gql`
  query getMprNotifications($date: String) {
    getMprNotifications(date: $date) {
      id
      requestorTimestamp
      managerTimestamp
      whTimestamp
      bomTimestamp
    }
  }
`;
