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
      issuedById
      issuedBy
      issuedByTimestamp
      receivedById
      receivedBy
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
      issuedBy
      receivedBy
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
        wmrPrRemarks
        wmrWhRemarks
        stockReady
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

export const PrintWmr = gql`
  query printWmr($id: Int) {
    printWmr(id: $id) {
      status
    }
  }
`;

export const GetWmrNotifications = gql`
  query getWmrNotifications($date: String) {
    getWmrNotifications(date: $date) {
      id
      no
      requestedBy
      requestedByTimestamp
      authorizedBy
      authorizedByTimestamp
      issuedBy
      issuedByTimestamp
    }
  }
`;
