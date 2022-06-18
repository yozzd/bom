import gql from 'graphql-tag';

export const AddWmr = gql`
  mutation addWmr($input: AddWmrInput) {
    addWmr(input: $input) {
      id
      no
    }
  }
`;

export const empty = null;
