const { GraphQLScalarType } = require('graphql');
const { format } = require('date-fns');

const uDateFormat = (d, f) => format(new Date(d.toISOString().slice(0, -1)), f);

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
  DateFormat, uDateFormat,
};
