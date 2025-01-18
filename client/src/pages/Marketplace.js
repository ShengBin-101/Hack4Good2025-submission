import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MarketPlace.css';

const MarketPlace = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [voucherCount, setVoucherCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/products`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    };

    const fetchVoucherCountFromLocalStorage = () => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setVoucherCount(parsedUser.voucher || 0);
      } else {
        setVoucherCount(0);
      }
    };

    fetchProducts();
    fetchVoucherCountFromLocalStorage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleOrderProduct = (product) => {
    setSelectedProduct(product);
    setError('');
    setSuccess('');
  };

  const handlePlaceOrder = async () => {
    if (orderQuantity === 0) {
      setError('Buying quantity must be at least 1.');
      return;
    }

    if (orderQuantity > selectedProduct.stockQuantity) {
      setError('Buying quantity is more than stock quantity.');
      return;
    }

    if (voucherCount < selectedProduct.voucherNeeded * orderQuantity) {
      setError('Not enough vouchers.');
      return;
    }

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user._id,
        productName: selectedProduct.name,
        productQuantity: orderQuantity,
        dateTransaction: new Date().toISOString().split('T')[0],
        timeTransaction: new Date().toISOString().split('T')[1].split('.')[0],
      }),
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      setProducts(
        products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      const newVoucherCount =
        voucherCount - selectedProduct.voucherNeeded * orderQuantity;
      setVoucherCount(newVoucherCount);

      const updatedUser = { ...user, voucher: newVoucherCount };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSelectedProduct(null);
      setOrderQuantity(1);
      setError('');
      setSuccess('Order placed successfully!');
    } else {
      console.error('Failed to place order');
    }
  };

  return (
    <div className="marketplace-container">
      <header className="marketplace-header">
        <div className="voucher-count">Vouchers: {voucherCount}</div>
        <div className="header-buttons">
          <h1 className="marketplace-heading">Marketplace</h1>
          <button className="nav-button" onClick={() => navigate('/user-dashboard')}>
            User Profile
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/user-dashboard', { state: { activeTab: 'quests' } })}
          >
            Quests
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/user-dashboard', { state: { activeTab: 'tasks' } })}
          >
            Tasks
          </button>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main className="marketplace-main">
        <section className="products-section">
          <h2>Products</h2>
          <ul className="product-list" style={{ listStyle: 'none', padding: 0 }}>
            {products.map((product) => (
              <li
                key={product._id}
                className="product-item"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '20px',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '10px',
                }}
              >
                <img
                  src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${product.productPicturePath}`}
                  alt={product.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginRight: '20px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>
                    <strong>Vouchers Needed:</strong> {product.voucherNeeded}
                  </p>
                  <p>
                    <strong>Stock Quantity:</strong> {product.stockQuantity}
                  </p>
                  <button onClick={() => handleOrderProduct(product)}>Order</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {selectedProduct && (
          <div
            className="order-popup"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div
              className="order-popup-content"
              style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '10px',
                width: '400px',
                maxHeight: '90%',
                overflowY: 'auto',
              }}
            >
              <h2>Order {selectedProduct.name}</h2>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <label>
                Quantity:
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  min="1"
                  max={selectedProduct.stockQuantity}
                  style={{ width: '100%', marginTop: '10px', padding: '5px' }}
                />
              </label>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                }}
              >
                <button onClick={handlePlaceOrder} style={{ padding: '10px 20px' }}>
                  Place Order
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{ padding: '10px 20px', background: '#f44336', color: '#fff' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketPlace;
