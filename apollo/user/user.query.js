import gql from 'graphql-tag';

const Me = gql`
  query me {
    me {
      name
      group
      section
    }
  }
`;

export default Me;
