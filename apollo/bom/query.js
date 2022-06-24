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
        cat
        pic
        rndic
        refer
        status
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
        euro
        gbp
        myr
        idr
        sgd
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
          totalValidation
          totalItems
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
            wmr3 {
              id
              no
            }
          }
        }
      }
    }
  }
`;

export const GetWoModules = gql`
  query getWoModules($idWo: Int) {
    getWoModules(idWo: $idWo) {
      id
      hid
      header
    }
  }
`;

export const GetAllWoRunning = gql`
  query getAllWoRunning($key: String) {
    getAllWoRunning(key: $key) {
      id
      woNo
      model
      product
      unit
      lt {
        id
        ltNo
      }
    }
  }
`;

export const GetPersonDept = gql`
  query getPersonDept($key: String) {
    getPersonDept(key: $key) {
      nk
      nama
    }
  }
`;

export const GetAllWoModules = gql`
  query getAllWoModules($key: String) {
    getAllWoModules(key: $key) {
      id
      woNo
      modules {
        id
        hid
        header
      }
    }
  }
`;

export const GetSearchItems = gql`
  query getSearchItems($key: String) {
    getSearchItems(key: $key) {
      id
      bomDescription
      bomSpecification
      bomModel
      bomBrand
      bomSupplier
      isMpr
    }
  }
`;

export const GetSearchModules = gql`
  query getSearchModules($idHeader: Int) {
    getSearchModules(idHeader: $idHeader) {
      id
      bomDescription
      bomSpecification
      bomModel
      bomBrand
      bomSupplier
      isMpr
    }
  }
`;

export const GenLtXLS = gql`
  query genLtXLS($id: Int, $status: Int) {
    genLtXLS(id: $id, status: $status) {
      status
    }
  }
`;

export const GenWoXLS = gql`
  query genWoXLS($id: Int) {
    genWoXLS(id: $id) {
      status
    }
  }
`;
