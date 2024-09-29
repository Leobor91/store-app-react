import React from 'react';

const VendorDetails = ({ vendors, onRowClick }) => {
  if (!vendors || vendors.length === 0) {
    return <div>No vendor data available</div>;
  }

  console.log('VendorDetails props:', vendors); // Log para verificar los props recibidos
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>NIT</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Fecha de creación</th>
            <th>Fecha de actualización</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            vendor && vendor.id && ( // Verificar que vendor no sea null o undefined y tenga un id
              <tr key={vendor.id} onClick={() => onRowClick(vendor)}>
                <td>{vendor.name}</td>
                <td>{vendor.nit}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone}</td>
                <td>{new Date(parseInt(vendor.createdDate)).toLocaleDateString()}</td>
                <td>{new Date(parseInt(vendor.updatedDate)).toLocaleDateString()}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorDetails; // Asegúrate de exportar por defecto