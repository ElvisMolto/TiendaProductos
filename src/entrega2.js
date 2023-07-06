const { promises: fs } = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.loadProductsFromDisk().then(() => {
      console.log("Productos cargados");
    }); // Cargar los productos desde el archivo
  }

  // Método para cargar los productos desde el archivo en disco
  async loadProductsFromDisk() {
    try {
      // Leer el archivo de productos
      const data = await fs.readFile(this.path);
      // Parsear el contenido del archivo como JSON
      this.products = JSON.parse(data);
    } catch(error) {
      console.log("No se pudo leer el archivo de productos, se cargará un arreglo vacío.");
      // Si ocurre un error, iniciar con un arreglo vacío
      this.products = [];
      // Crear el archivo productos.json si no existe
      await fs.writeFile(this.path, '[]');
    }
  }

  // Método para guardar los productos en el archivo en disco
  async saveProductsToDisk() {
    try {
      // Convertir los productos a JSON
      const data = JSON.stringify(this.products);
      // Guardar los productos en el archivo
      await fs.writeFile(this.path, data);
    } catch(error) {
      console.log("No se pudo guardar el archivo de productos.");
    }
  }

  // Método para agregar un nuevo producto
  async addProduct(product) {
    // Validar campos obligatorios
    if (!product || !product.title || !product.description || !product.price) {
        console.error("Fields validation failed!");
        return;
    }

    // Obtener el último ID de la lista de productos
    const lastProduct = this.products[this.products.length - 1];
    let nextId = 1;
    if (lastProduct) {
      nextId = lastProduct.id + 1;
    }

    // Asignar el ID autoincrementable al nuevo producto
    const newProduct = { id: nextId, ...product };
    // Agregar el nuevo producto a la lista de productos
    this.products.push(newProduct);
    // Guardar la lista actualizada de productos en el archivo
    await this.saveProductsToDisk();
    // Mostrar una confirmación del producto agregado
    console.log("Producto agregado:", newProduct);
  }

  // Método para obtener todos los productos
  getProducts() {
    return this.products || [];
  }

  // Método para obtener un producto por su ID
  async getProductById(id) {
    await this.loadProductsFromDisk();
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      // Mostrar un error si el producto no se encuentra
      console.error("Producto no encontrado");
      return;
    }
    return product;
  }

  // Método para actualizar un producto
  async updateProduct(id, updatedFields) {
    // Buscar el producto por ID
    const product = await this.getProductById(id);
    if (!product) {
      return;
    }

    // Actualizar los campos del producto con los nuevos valores
    Object.keys(updatedFields).forEach((key) => {
      product[key] = updatedFields[key];
    });
    // Guardar los productos actualizados en el archivo
    await this.saveProductsToDisk();
    // Mostrar una confirmación del producto actualizado
    console.log("Producto actualizado:", product);
  }

  // Método para eliminar un producto por su ID
  async deleteProduct(id) {
    // Buscar el índice del producto por su ID
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return;
    }
    // Eliminar el producto de la lista
    this.products.splice(index, 1);
    // Guardar los productos actualizados en el archivo
    await this.saveProductsToDisk();
    // Mostrar una confirmación del producto eliminado
    console.log(`Producto con ID ${id} ha sido eliminado.`);
  }
}

// #######################################################################################

// PRUEBAS

// Ejemplo de uso de la clase ProductManager
const manager = new ProductManager("./productos.json");

(async function() {
  // Esperar a que los productos se carguen desde el archivo antes de continuar
  await manager.loadProductsFromDisk();

  // Agregar dos productos utilizando el método addProduct
  manager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 99.9,
    thumbnail: "thumbnail1.jpg",
    code: "PRD001",
    stock: 10,
  });

  manager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 199.9,
    thumbnail: "thumbnail2.jpg",
    code: "PRD002",
    stock: 5,
  });

  // Obtener todos los productos utilizando el método getProducts
  console.log("Todos los productos:", manager.getProducts());

  // Obtener un producto por su ID utilizando el método getProductById
  console.log("Producto con ID 2:", await manager.getProductById(2));

  // Buscar un producto que no existe
  console.log("Producto con ID 3:", await manager.getProductById(3));

  // Eliminar un producto utilizando el método deleteProduct
  await manager.deleteProduct(1);
})();

