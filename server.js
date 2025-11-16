const http = require('http');
const { sendError } = require('../vanilla-node-rest-api/utils');
const { getProducts, getProduct, createProduct, updateProduct,deleteProduct } = require('./controllers/productController');

const server = http.createServer((req, res) => {
  if (req.url === '/api/products' && req.method === 'GET') {
    getProducts(req, res);

  } else if (req.url.match(/\/api\/products\/([A-Za-z0-9\-]+)/) && req.method === 'GET') {
    const id = req.url.split('/')[3];
    getProduct(req, res, id);

  } else if (req.url === '/api/products' && req.method === 'POST') {
    createProduct(req, res);

  } else if (req.url.match(/\/api\/products\/([A-Za-z0-9\-]+)/) && req.method === 'PUT') {
    const id = req.url.split('/')[3];
    updateProduct(req, res, id);

  }  else if (req.url.match(/\/api\/products\/([A-Za-z0-9\-]+)/) && req.method === 'DELETE') {
    const id = req.url.split('/')[3];
    deleteProduct(req, res, id);

  }else {
  return sendError(res, 404, 'Route not found');
}
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
