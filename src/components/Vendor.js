import React, { useState, useEffect } from 'react';
import VendorDetails from './VendorDetails';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;
const VENDORS_LIST_ENDPOINT = process.env.REACT_APP_VENDORS_LIST_ENDPOINT;
const VENDORS_CREATE_ENDPOINT = process.env.REACT_APP_VENDORS_CREATE_ENDPOINT;
const VENDORS_UPDATE_ENDPOINT = process.env.REACT_APP_VENDORS_UPDATE_ENDPOINT;
const VENDORS_DELETE_ENDPOINT = process.env.REACT_APP_VENDORS_DELETE_ENDPOINT;

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVendor, setNewVendor] = useState({
    id: '',
    name: '',
    nit: '',
    email: '',
    phone: '',
    createdDate: '',
    updatedDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${API_URL}${VENDORS_LIST_ENDPOINT}`);
        const data = await response.json();
        setVendors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setLoading(false);
        toast.error('Error al obtener la lista de proveedores');
      }
    };

    fetchVendors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVendor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verificar que todos los campos estén completos
    if (
      !newVendor.name ||
      !newVendor.nit ||
      !newVendor.email ||
      !newVendor.phone
    ) {
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${VENDORS_CREATE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newVendor)
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {
          toast.error('Proveedor ya existe. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setVendors(prevVendors => [...prevVendors, data.object]);
          handleClear();
          toast.success('Proveedor guardado con éxito');
        }
      } else {
        toast.error('Error al guardar el proveedor: ' + data.message);
      }
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
      toast.error('Error al guardar el proveedor');
    }
  };

  const handleEdit = async () => {
    // Verificar que todos los campos estén completos
    if (
      !newVendor.name ||
      !newVendor.nit ||
      !newVendor.email ||
      !newVendor.phone
    ) {
      toast.error('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${VENDORS_UPDATE_ENDPOINT}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newVendor)
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {
          toast.error('Proveedor no encontrado. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setVendors(prevVendors => prevVendors.map(vendor => 
            vendor.id === data.object.id ? data.object : vendor
          ));
          handleClear();
          toast.success('Proveedor actualizado con éxito');
        }
      } else {
        toast.error('Error al actualizar el proveedor: ' + data.message);
      }
    } catch (error) {
      console.error('Error al actualizar el proveedor:', error);
      toast.error('Error al actualizar el proveedor');
    }
  };

  const handleDelete = async () => {
    if (!newVendor.id) {
      toast.error('Por favor, seleccione un proveedor para eliminar.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${VENDORS_DELETE_ENDPOINT}/${newVendor.nit}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {          
          toast.error('Proveedor no encontrado. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setVendors(prevVendors => prevVendors.filter(vendor => vendor.id !== data.object.id));
          handleClear();
          toast.success('Proveedor eliminado con éxito');
        }
      } else {
        toast.error('Error al eliminar el proveedor: ' + data.message);
      }
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
      toast.error('Error al eliminar el proveedor');
    }
  };

  const handleRowClick = (vendor) => {
    setNewVendor(vendor);
    setIsEditing(true);
  };

  const handleClear = () => {
    setNewVendor({
      id: '',
      name: '',
      nit: '',
      email: '',
      phone: '',
      createdDate: '',
      updatedDate: ''
    });
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div>
      <h2>Proveedores</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="vendor-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newVendor.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nit"
          placeholder="NIT"
          value={newVendor.nit}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={newVendor.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={newVendor.phone}
          onChange={handleChange}
          required
        />
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
        <VendorDetails vendors={vendors} onRowClick={handleRowClick} />
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

export default Vendor;