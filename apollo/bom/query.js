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
      lt {
        id
        ltNo
        customer {
          name
          contractDeadLine
          productionDeadLine
        }
        totalBudget
        totalPriceWO
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
        }
      }
      ltMpr {
        id
        ltNo
        totalBudget
        totalPriceWO
        wos {
          id
          woNo
          unit
          totalIncoming
          totalValidation
          totalItems
          percentIncoming
          percentValidation
          totalPricePerUnit
          totalPricePerWO
          totalYetToPurchase
          totalPackingPerUnit
          totalPackingPerWO
          totalMpr
        }
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
            isMpr
            colorClass
          }
        }
      }
      ltMpr {
        id
        ltNo
        wos {
          unit
          totalPricePerUnit
          totalPricePerWO
          totalMaterialsProcessed
          totalYetToPurchase
          totalPackingPerUnit
          totalPackingPerWO
        }
      }
      mpr {
        id
        woNo
        mprs {
          id
          no
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
              isMpr
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
            isMpr
            colorClass
          }
        }
      }
    }
  }
`;
