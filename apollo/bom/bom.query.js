import gql from 'graphql-tag';

export const GetLTAll = gql`
  query getLTAll($status: Int) {
    getLTAll(status: $status) {
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
        totalPricePerUnit
        totalPricePerWO
        difference
        totalYetToPurchase
      }
    }
  }
`;
