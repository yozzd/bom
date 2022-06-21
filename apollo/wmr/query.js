import gql from 'graphql-tag';

export const GetAllWmr = gql`
  query getAllWmr {
    getAllWmr {
      id
      no
      requestedById
      requestedBy
      requestedByTimestamp
      authorizedById
      authorizedBy
      authorizedByApproved
      authorizedByTimestamp
      wo {
        id
        woNo
        idLt
      }
    }
  }
`;

export const GetOneWmr = gql`
  query getOneWmr($id: Int) {
    getOneWmr(id: $id) {
      id
      no
      requestedBy
      authorizedBy
      wo {
        id
        woNo
        idLt
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
        qtyIssued
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
`;

export const GetWmrByWo = gql`
  query getWmrByWo($idWo: Int) {
    getWmrByWo(idWo: $idWo) {
      id
      no
    }
  }
`;
