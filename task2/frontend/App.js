import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const addProduct = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/products', { name, price, description })
      .then(response => {
        setProducts([...products, response.data]);
        setName('');
        setPrice('');
        setDescription('');
      })
      .catch(error => console.error(error));
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:5000/products/${id}`)
      .then(() => setProducts(products.filter(product => product._id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>E-commerce CRUD</h1>

      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} - ${product.price}
            <button onClick={() => deleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
