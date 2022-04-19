import gql from 'graphql-tag';

export const GetAllLT = gql`
  query getAllLT($status: Int) {
    getAllLT(status: $status) {
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

export const GetOneLT = gql`
  query getOneLT($id: Int, $status: Int) {
    getOneLT(id: $id, status: $status) {
      id
      ltNo
      customer {
        name
        contractDeadLine
        productionDeadLine
      }
      totalBudget
      totalPrice
      wos {
        id
        woNo
        model
        product
        issued
        unit
        budget
        stage
        totalIncoming
        totalIncomingItems
        totalValidation
        totalItems
        percentIncoming
        percentValidation
        totalPricePerUnit
        totalPricePerWO
        difference
        totalYetToPurchase
        totalDeviation
        totalPackingPerUnit
        totalPackingPerWO
        bomIncoming
        mprIncoming
        bomPercentIncoming
        mprPercentIncoming
        bomValidation
        mprValidation
        bomPercentValidation
        mprPercentValidation
        totalMpr
      }
    }
  }
`;

export const GetOneWO = gql`
  query getOneWO($idLt: Int, $id: Int) {
    getOneWO(idLt: $idLt, id: $id) {
      lt {
        id
        ltNo
        customer {
          name
          contractDeadLine
          productionDeadLine
        }
        wos {
          budget
          totalPricePerWO
          difference
          totalMaterialsProcessed
          totalYetToPurchase
          totalDeviation
          totalPackingPerUnit
          totalPackingPerWO
        }
      }
      wo {
        id
        woNo
        idLt
        unit
        cat
        model
        product
        picName
        rndic
        stage
        issued
        sgd
        idr
        euro
        gbp
        myr
        refer
        status
        modules {
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
            colorClass
            mpr {
              id
              no
            }
          }
        }
      }
      mpr {
        id
        woNo
        mprs {
          id
          no
          unit
          requestorName
          bomTimestamp
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
              colorClass
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
            colorClass
          }
        }
      }
    }
  }
`;
