import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Client from './components/Client';
import Product from './components/Product';
import Vendor from './components/Vendor';
import Sales from './components/Sales';
import Home from './components/Home'; // Importar el componente Home
import './App.css'; // Importar el archivo CSS

const App = () => {
  return (
    <Router>
      <div>
        <ul className="nav-menu">
          <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/client"><i className="fas fa-users"></i> Clientes</Link></li>
          <li><Link to="/product"><i className="fas fa-box"></i> Productos</Link></li>
          <li><Link to="/vendor"><i className="fas fa-truck"></i> Proveedores</Link></li>
          <li><Link to="/sales"><i className="fas fa-shopping-cart"></i> Ventas</Link></li>
        </ul>
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/client" element={<Client />} />
            <Route path="/product" element={<Product />} />
            <Route path="/vendor" element={<Vendor />} />
            <Route path="/sales" element={<Sales />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;