const unixToString = (unixTimestamp: number) =>
  new Date(unixTimestamp).toISOString().split("T")[0];

export default unixToString;
