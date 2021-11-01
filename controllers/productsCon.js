const Product = require("../models/Product");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getAllProducts = async (req, res) => {
  const { featured, company, name, filters, sort, fields } = req.query;
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
  if (filters) {
    const options = ["price", "rating"];
    const operatorMap = {
      ">": "gt",
      ">=": "$gte",
      "=": "$eq",
      "<=": "$lte",
      "<": "$lt",
    };
    const re = /\b(<|>|<=|=|>=)\b/;
    //filters=price>=30,rarting>3
    let newFilters = filters.replace(re, (match) => `-${operatorMap[match]}-`);
    //filters= prce-$gtr-30,ratinh-$gt-3
    newFilters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      //field = price
      //operatir = $gte
      //value = 30
      if (options.includes(field)) {
        queryObject[field] = {
          [operator]: +value,
        };
      }
    });
  }

  let results = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    results = results.sort(sortList);
  } else {
    results = results.sort("CreatedAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    results = results.select(fieldsList);
  }
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 5;
  const skip = +(page - 1) * limit;
  results = results.skip(skip).limit(limit);

  const products = await results;
  res.json({
    status: 200,
    msg: "success",
    results: products,
    nbHits: products.length,
  });
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
