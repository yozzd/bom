const wmrSerial = (count) => {
  if (count < 10) return `00000${count}`;
  if (count < 100) return `0000${count}`;
  if (count < 1000) return `000${count}`;
  if (count < 10000) return `00${count}`;
  if (count < 100000) return `0${count}`;
  return count;
};

module.exports = { wmrSerial };
