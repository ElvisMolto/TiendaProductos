class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    addProduct(product) {
      if (!this.isProductValid(product)) {
        console.log('Error: Todos los campos del producto son obligatorios.');
        return;
      }
  
      if (this.isDuplicateCode(product.code)) {
        console.log('Error: Ya existe un producto con el mismo código.');
        return;
      }
  
      product.id = this.productIdCounter++;
      this.products.push(product);
    }
  
    isProductValid(product) {
      return (
        product.title &&
        product.description &&
        product.price &&
        product.thumbnail &&
        product.code &&
        product.stock
      );
    }
  
    isDuplicateCode(code) {
      return this.products.some(product => product.code === code);
    }
  
    getProduct() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
  
      if (!product) {
        console.log('Not Found');
        return;
      }
  
      return product;
    }
  }
  module.exports = ProductManager;
  
  // Ejemplo de uso
/*const manager = new ProductManager();
  
  manager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del Producto 1',
    price: 10.99,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'P1',
    stock: 10
  });
  
  manager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del Producto 2',
    price: 19.99,
    thumbnail: 'ruta/imagen2.jpg',
    code: 'P2',
    stock: 5
  });
  
  console.log(manager.getProduct());
  console.log(manager.getProductById(1));
  console.log(manager.getProductById(3));*/
