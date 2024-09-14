const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cors());

// Replace <username>, <password>, and <clustername> with your MongoDB Atlas credentials
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Connect to MongoDB (Local or Atlas)
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Define the Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

// Create a Product Model
const Product = mongoose.model('Product', productSchema);

// Create a new product (POST)
app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all products (GET)
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a product by ID (PUT)
app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a product by ID (DELETE)
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send('Product deleted');
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
