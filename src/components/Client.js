import React, { useState, useEffect } from 'react';
import ClientDetails from './ClientDetails';

const API_URL = process.env.REACT_APP_API_URL;
const CLIENTS_LIST_ENDPOINT = process.env.REACT_APP_CLIENTS_LIST_ENDPOINT;
const CLIENTS_CREATE_ENDPOINT = process.env.REACT_APP_CLIENTS_CREATE_ENDPOINT;
const CLIENTS_UPDATE_ENDPOINT = process.env.REACT_APP_CLIENTS_UPDATE_ENDPOINT;
const CLIENTS_DELETE_ENDPOINT_DOCUMENT_TYPE = process.env.REACT_APP_CLIENTS_DELETE_ENDPOINT_DOCUMENT_TYPE;
const CLIENTS_DELETE_ENDPOINT_DOCUMENT_NUMBER = process.env.REACT_APP_CLIENTS_DELETE_ENDPOINT_DOCUMENT_NUMBER;

const Client = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({
    id: '', // Asegurarse de que el id tenga un valor inicial válido
    name: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    email: '',
    phone: '',
    createdDate: '',
    updatedDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log('API_URL:', API_URL, 'REACT_APP_API_URL:', process.env.REACT_APP_API_URL); // Imprimir valores de API_URL y REACT_APP_API_URL

    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_URL}${CLIENTS_LIST_ENDPOINT}`);
        const data = await response.json();
        console.log('Fetched clients:', data); // Log para verificar los datos obtenidos
        setClients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verificar que todos los campos estén completos
    if (
      !newClient.name ||
      !newClient.lastName ||
      !newClient.documentType ||
      !newClient.documentNumber ||
      !newClient.email ||
      !newClient.phone
    ) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${CLIENTS_CREATE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newClient)
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {
          setErrorMessage('Cliente ya existe. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setClients(prevClients => [...prevClients, data.object]);
          handleClear();
        }
      } else {
        alert('Error al guardar el cliente: ' + data.message);
      }
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      alert('Error al guardar el cliente');
    }
  };

  const handleEdit = async () => {
    // Verificar que todos los campos estén completos
    if (
      !newClient.name ||
      !newClient.lastName ||
      !newClient.documentType ||
      !newClient.documentNumber ||
      !newClient.email ||
      !newClient.phone
    ) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${CLIENTS_UPDATE_ENDPOINT}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newClient)
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {
          setErrorMessage('Cliente no encontrado. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setClients(prevClients => prevClients.map(client => 
            client.id === data.object.id ? data.object : client
          ));
          handleClear();
        }
      } else {
        alert('Error al actualizar el cliente: ' + data.message);
      }
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      alert('Error al actualizar el cliente');
    }
  };

  const handleDelete = async () => {
    if (!newClient.documentType || !newClient.documentNumber) {
      alert('Por favor, seleccione un cliente para eliminar.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${CLIENTS_DELETE_ENDPOINT_DOCUMENT_TYPE}/${newClient.documentType}${CLIENTS_DELETE_ENDPOINT_DOCUMENT_NUMBER}/${newClient.documentNumber}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        if (data.object === null) {
          setErrorMessage('Cliente no encontrado. Por favor, verifique los datos.');
        } else {
          setSuccessMessage(data.message);
          setClients(prevClients => prevClients.filter(client => client.id !== data.object.id));
          handleClear();
        }
      } else {
        alert('Error al eliminar el cliente: ' + data.message);
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      alert('Error al eliminar el cliente');
    }
  };

  const handleRowClick = (client) => {
    setNewClient(client);
    setIsEditing(true);
  };

  const handleClear = () => {
    setNewClient({
      id: '', // Asegurarse de que el id tenga un valor inicial válido
      name: '',
      lastName: '',
      documentType: '',
      documentNumber: '',
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
      <h2>Clientes</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="client-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newClient.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={newClient.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="documentType"
          placeholder="Tipo de Documento"
          value={newClient.documentType}
          onChange={handleChange}
          required
          readOnly={isEditing}
        />
        <input
          type="text"
          name="documentNumber"
          placeholder="Numero de Documento"
          value={newClient.documentNumber}
          onChange={handleChange}
          required
          readOnly={isEditing}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={newClient.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefono"
          value={newClient.phone}
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
        <ClientDetails clients={clients} onRowClick={handleRowClick} />
      )}
    </div>
  );
};

export default Client;