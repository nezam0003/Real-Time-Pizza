const getAllProducts = async (req, res) => {
  res.send("all products");
};

const getSingleProduct = async (req, res) => {
  res.send("single product");
};

const createProduct = async (req, res) => {
  res.send("create Product");
};

const updateProduct = async (req, res) => {
  res.send("update product");
};

const deleteProduct = async (req, res) => {
  res.send("delete product");
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
