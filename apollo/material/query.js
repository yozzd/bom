import gql from 'graphql-tag';

export const GetSearchItems = gql`
  query getSearchItems($key: String) {
    getSearchItems(key: $key) {
      MaterialCD
      MaterialNM
      MaterialDesc
      Model
      Brand
      unit
    }
  }
`;

export const empty = null;
