const arrayToString = (data: any): string => {
  // check if data is array or not
  if (data === undefined) {
    return "";
  }
  if (Array.isArray(data)) {
    if (data.length == 0) return "";
    else {
      return data
        .map(function (a) {
          return "'" + a.replace("'", "''") + "'";
        })
        .join();
    }
  }
  if (data != "") {
    return `'${data}'`;
  }
  return "";
};

export default arrayToString;
