import React, { useState, useEffect } from 'react';
import ProductDetails from './ProductDetails'; // Importar ProductDetails
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;
const PRODUCTS_LIST_ENDPOINT = process.env.REACT_APP_PRODUCTS_LIST_ENDPOINT;
const PRODUCTS_CREATE_ENDPOINT = process.env.REACT_APP_PRODUCTS_CREATE_ENDPOINT;
const PRODUCTS_UPDATE_ENDPOINT = process.env.REACT_APP_PRODUCTS_UPDATE_ENDPOINT;
const PRODUCTS_DELETE_ENDPOINT = process.env.REACT_APP_PRODUCTS_DELETE_ENDPOINT;
const VENDORS_LIST_ENDPOINT = process.env.REACT_APP_VENDORS_LIST_ENDPOINT;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '', // Agregar campo name
    description: '',
    status: 1,
    stock: '',
    precio_costo: '',
    precio_venta: '',
    vendor_id: '',
    image: '' // Agregar campo image
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}${PRODUCTS_LIST_ENDPOINT}`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {        
        setLoading(false);
        toast.error('Error al obtener la lista de productos');
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await fetch(`${API_URL}${VENDORS_LIST_ENDPOINT}`);
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        toast.error('Error al obtener la lista de proveedores');
      }
    };

    fetchProducts();
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct(prevState => ({
        ...prevState,
        image: reader.result
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verificar que todos los campos estén completos
    if (
      !newProduct.name || // Verificar campo name
      !newProduct.description ||
      !newProduct.precio_costo ||
      !newProduct.precio_venta ||
      !newProduct.vendor_id
    ) {
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${PRODUCTS_CREATE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {
          setErrorMessage('Producto ya existe. Por favor, verifique los datos.');
          toast.error('Producto ya existe. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setProducts(prevProducts => [...prevProducts, data.object]);
          handleClear();
          toast.success('Producto guardado con éxito');
        }
      } else {
        toast.error('Error al guardar el producto: ' + data.message);
      }
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleEdit = async () => {
    // Verificar que todos los campos estén completos
    if (
      !newProduct.name || // Verificar campo name
      !newProduct.description ||
      !newProduct.precio_costo ||
      !newProduct.precio_venta ||
      !newProduct.vendor_id
    ) {
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${PRODUCTS_UPDATE_ENDPOINT}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {
          setErrorMessage('Producto no encontrado. Por favor, verifique los datos.');
          toast.error('Producto no encontrado. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setProducts(prevProducts => prevProducts.map(product => 
            product.id === data.object.id ? data.object : product
          ));
          handleClear();
          toast.success('Producto actualizado con éxito');
        }
      } else {
        toast.error('Error al actualizar el producto: ' + data.message);
      }
    } catch (error) {
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDelete = async () => {
    if (!newProduct.id) {
      toast.error('Por favor, seleccione un producto para eliminar.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${PRODUCTS_DELETE_ENDPOINT}/${newProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {          
          toast.error('Producto no encontrado. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setProducts(prevProducts => prevProducts.filter(product => product.id !== data.object.id));
          handleClear();
          toast.success('Producto eliminado con éxito');
        }
      } else {
        toast.error('Error al eliminar el producto: ' + data.message);
      }
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  const handleRowClick = (product) => {
    setNewProduct(product);
    setIsEditing(true);
  };

  const handleClear = () => {
    setNewProduct({
      id: '',
      name: '', // Agregar campo name
      description: '',
      status: 1,
      stock: 0,
      precio_costo: 0.00,
      precio_venta: 0.00,
      vendor_id: '',
      image: '' // Agregar campo image
    });
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div>
      <h2>Productos</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="precio_costo"
          placeholder="Precio Costo"
          value={newProduct.precio_costo}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="precio_venta"
          placeholder="Precio Venta"
          value={newProduct.precio_venta}
          onChange={handleChange}
          required
        />
         <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <select
          name="vendor_id"
          value={newProduct.vendor_id}
          onChange={handleChange}
          required
        >
         
          <option value="">Seleccione un proveedor</option>
          {vendors.map(vendor => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>       
        <div className="form-buttons">
          <button type="submit" className="btn btn-create" disabled={isEditing}>Crear</button>
          <button type="button" className="btn btn-edit" onClick={handleEdit}>Editar</button>
          <button type="button" className="btn btn-delete" onClick={handleDelete}>Eliminar</button>
          <button type="button" className="btn btn-clear" onClick={handleClear}>Limpiar</button>
        </div>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductDetails products={products} vendors={vendors} onRowClick={handleRowClick} />
      )}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Product;