import React from 'react';

const ProductDetails = ({ products, vendors, onRowClick }) => {
  if (!products || products.length === 0) {
    return <div>No hay datos de productos disponibles</div>;
  }

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : 'Desconocido';
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Precio Costo</th>
            <th>Precio Venta</th>
            <th>Proveedor</th> {/* Cambiar "ID del Proveedor" a "Proveedor" */}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} onClick={() => onRowClick(product)}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.status ? 'Activo' : 'Inactivo'}</td>
              <td>{product.precio_costo.toFixed(2)}</td>
              <td>{product.precio_venta.toFixed(2)}</td>
              <td>{getVendorName(product.vendor_id)}</td> {/* Mostrar nombre del proveedor */}
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="placeholder">No hay productos disponibles</div>
      )}
    </div>
  );
};

export default ProductDetails;