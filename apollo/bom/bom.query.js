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

export const GetLTOne = gql`
  query getLTOne($idLt: Int, $status: Int) {
    getLTOne(idLt: $idLt, status: $status) {
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
        totalIncomings
        totalItems
        totalPricePerUnit
        totalPricePerWO
        difference
        totalYetToPurchase
      }
    }
  }
`;
