import gql from 'graphql-tag';

export const GetAllMPR = gql`
  query getAllMPR($status: Int) {
    getAllMPR(status: $status) {
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
      packing
      requestorName
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
          colorClass
        }
      }
    }
  }
`;
