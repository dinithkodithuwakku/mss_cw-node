const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser({ attrkey: "ATTR" });

module.exports = function (fileName, queryTag) {
  let xml_string = fs.readFileSync(
    __dirname + `/query/${fileName}.xml`,
    "utf8"
  );

  let query = null;
  parser.parseString(xml_string, function (error, result) {
    if (error === null) {
      // console.log(result);
      // console.log(
      //   result[fileName.charAt(0).toUpperCase() + fileName.slice(1)][queryTag]
      // );

      query = result[fileName.charAt(0).toUpperCase() + fileName.slice(1)][
        queryTag
      ][0].replace("\r\n", " ");
    } else {
      console.log(error);
    }
  });
  return query;
};
