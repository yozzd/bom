const { GraphQLScalarType } = require('graphql');
const { format } = require('date-fns');

const DateFormat = new GraphQLScalarType({
  name: 'DateFormat',
  serialize(value) {
    return format(new Date(value), 'yyyy-MM-dd');
  },
  parseValue(value) {
    return value;
  },
});

module.exports = {
  DateFormat,
};
