import gql from 'graphql-tag';

export default gql`
  query me {
    me {
      name
      group
      department
      section
      fullname
      isManager
    }
  }
`;
