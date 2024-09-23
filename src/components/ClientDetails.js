import React from 'react';

const ClientDetails = ({ clients, onRowClick }) => {
  if (!clients || clients.length === 0) {
    return <div>No client data available</div>;
  }

  console.log('ClientDetails props:', clients); // Log para verificar los props recibidos
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Tipo de Documento</th>
            <th>Numero de Documento</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>Fecha de creacion</th>
            <th>Fecha de actualizacion</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            client && client.id && ( // Verificar que client no sea null o undefined y tenga un id
              <tr key={client.id} onClick={() => onRowClick(client)}>
                <td>{client.name}</td>
                <td>{client.lastName}</td>
                <td>{client.documentType}</td>
                <td>{client.documentNumber}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{new Date(parseInt(client.createdDate)).toLocaleDateString()}</td>
                <td>{new Date(parseInt(client.updatedDate)).toLocaleDateString()}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientDetails;