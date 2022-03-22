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
  }
`;

export const GetOneWO = gql`
  query getOneWO($id: Int) {
    getOneWO(id: $id) {
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
      sgd
      idr
      euro
      gbp
      myr
      budget
      refer
      status
      totalPricePerWO
      difference
      totalMaterialsProcessed
      totalYetToPurchase
      totalPackingPerUnit
      totalPackingPerWO
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
          colorClass
        }
      }
    }
  }
`;
