const Product = require("../models/Product");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getAllProducts = async (req, res) => {
  const { featured, company, name, numericFilters } = req.query;
  let queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const options = ["price", "rating"];
    const operatorMap = {
      ">": "gt",
      ">=": "$gte",
      "=": "$eq",
      "<=": "$lte",
      "<": "$lt",
    };
    const re = /\b(<|>|<=|=|>=)\b/;

    let filters = numericFilters.replace(
      re,
      (match) => `-${operatorMap[match]}`
    );
  }
  let results = await Product.find(queryObject);

  res.json({ status: 200, msg: "success", results: results });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getAllProductsStatic = async (req, res) => {
  //   throw new Error("testing async errors");
  const products = await Product.find({}).select("name price");

  res.json({ status: 200, msg: "static", results: products });
};

module.exports = { getAllProducts, getAllProductsStatic };
