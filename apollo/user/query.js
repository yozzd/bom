import gql from 'graphql-tag';

const Me = gql`
  query me {
    me {
      name
      group
      department
      section
      fullname
    }
  }
`;

export default Me;
