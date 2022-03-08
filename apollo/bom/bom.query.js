import gql from 'graphql-tag';

export const GetAllLT = gql`
  query getAllLT($status: Int) {
    getAllLT(status: $status) {
      id
      ltNo
      customer
      wos {
        id
        woNo
        status
      }
    }
  }
`;

export const GetOneLT = gql`
  query getOneLT($idLt: Int, $status: Int) {
    getOneLT(idLt: $idLt, status: $status) {
      id
      ltNo
      customer
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
        totalIncoming
        totalItems
        percentIncoming
        totalPricePerUnit
        totalPricePerWO
        difference
        totalYetToPurchase
        totalPackingPerUnit
        totalPackingPerWO
      }
    }
  }
`;
