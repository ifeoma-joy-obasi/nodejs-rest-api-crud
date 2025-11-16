const Product = require('../models/productModel');
const {getPostData} = require('../utils');
const { sendError } = require('../utils');

// @desc  Get all products
// @route GET /api/products
async function getProducts(req, res){
    try{
        const products = await Product.findAll();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ success: true, data: products }));
    }catch(error){
    console.log(error)
    return sendError(res, 500, 'Server error');
    }
}



// @desc  Get single product
// @route GET /api/product/:id
async function getProduct(req, res, id){
    try{
        const product = await Product.findById(id);
        if(!product){
             return sendError(res, 404, 'Product not found');
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: true, data: product }));
        }
    }catch(error){
        console.log(error);
         return sendError(res, 500, 'Server error');
    }
}


// @desc  Create a product
// @route POST /api/products
async function createProduct(req, res) {
  try {
    const body = await getPostData(req);

    const { name, description, price, category, stockQuantity } = JSON.parse(body);

    // Required fields
    if (!name || !price || !category || !stockQuantity) {
      return sendError(res, 400, 'All fields are required');
    }

    // Data type validation
    if (typeof price !== 'number') {
      return sendError(res, 400, 'Price must be a number');
    }

    if (typeof stockQuantity !== 'number') {
      return sendError(res, 400, 'Stock quantity must be a number');
    }

    // must not be negative
    if (price < 0) {
      return sendError(res, 400, 'Price cannot be negative');
    }

    if (stockQuantity < 0) {
      return sendError(res, 400, 'Stock quantity cannot be negative');
    }

    // Create product
    const product = { name, description, price, category, stockQuantity };
    const newProduct = await Product.create(product);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, data: newProduct }));

  } catch (error) {
    console.log(error);
    return sendError(res, 500, 'Server error');
  }
}


// @desc  Update a product
// @route PUT /api/products/:id
async function updateProduct(req, res, id) {
    try {
        const product = await Product.findById(id);

        if (!product) {
            return sendError(res, 404, 'Product not found');
        }

        const body = await getPostData(req);
        const { name, description, price, category, stockQuantity } = JSON.parse(body);

        // ====== VALIDATION FOR UPDATE ======

        if (name !== undefined && name.trim() === '') {
          return  sendError(res, 400, 'Name cannot be empty');
        }

        if (price !== undefined && typeof price !== 'number') {
            return sendError(res, 400, 'Price must be a number');
        }

        if (category !== undefined && category.trim() === '') {
            return sendError(res, 400, 'Category cannot be empty');
        }

        if (stockQuantity !== undefined && typeof stockQuantity !== 'number') {
            return sendError(res, 400, 'Stock quantity must be a number');
        }

        if (description !== undefined && typeof description !== 'string') {
            return sendError(res, 400, 'Description must be a string');
        }

         if (description !== undefined && description.trim() === '') {
            return sendError(res, 400, 'Description cannot be empty');
        }

        // ====== MERGE DATA ======
        const productData = {
            name: name ?? product.name,
            description: description ?? product.description,
            price: price ?? product.price,
            category: category ?? product.category,
            stockQuantity: stockQuantity ?? product.stockQuantity
        };

        const updatedProduct = await Product.update(id, productData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, data: updatedProduct }));

    } catch (error) {
        console.log(error);
        return sendError(res, 500, 'Server error');
    }
}


// @desc  Delete a product
// @route DELETE /api/products/:id
async function deleteProduct(req, res, id){
    try{
        const product = await Product.findById(id);
        if(!product){
            
            return sendError(res, 404, 'Product not found');
        } else {
            await Product.remove(id);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: true, data: { message: `Product ${id} removed` } }));
            
            
        }
    }catch(error){
        console.log(error);
        return sendError(res, 500, 'Server error');

    }
}



module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};