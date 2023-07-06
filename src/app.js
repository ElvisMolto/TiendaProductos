const fs = require('fs');
const express = require('express');
const ProductManager = require('./entrega');

const app = express();
const port = 3000;
const ruta = '../productos.json';
const productosData = fs.readFileSync(ruta);
const productos = JSON.parse(productosData);


const productManager = new ProductManager();
productManager.productos = productos;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
app.use('/products',ruta);

app.get('/products', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  
    try {
      const products = await productManager.getProducts();
      const limitedProducts = limit ? products.slice(0, limit) : products;
      res.json(limitedProducts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
  

app.get('/products/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);

  try {
    const product = await productManager.getProductById(pid);

    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

