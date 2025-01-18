import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminInventory.css';

const AdminInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', voucherNeeded: 0, stockQuantity: 0 });
  const [productPicture, setProductPicture] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductPicture, setEditingProductPicture] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch products
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/products`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handlePictureChange = (e) => {
    setProductPicture(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!newProduct.name.trim() || !newProduct.description.trim()) {
      setError('Product name and description are required.');
      return;
    }

    if (newProduct.voucherNeeded <= 0 || newProduct.stockQuantity <= 0) {
      setError('Voucher value and stock quantity must be greater than 0.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('voucherNeeded', newProduct.voucherNeeded);
    formData.append('stockQuantity', newProduct.stockQuantity);
    if (productPicture) {
      formData.append('productPicture', productPicture);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Error adding product');
      }

      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({ name: '', description: '', voucherNeeded: 0, stockQuantity: 0 });
      setProductPicture(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('description', editingProduct.description);
    formData.append('voucherNeeded', editingProduct.voucherNeeded);
    formData.append('stockQuantity', editingProduct.stockQuantity);
    if (editingProductPicture) {
      formData.append('productPicture', editingProductPicture);
    }

    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/products/${editingProduct._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(products.map((product) => (product._id === data._id ? data : product)));
        setEditingProduct(null);
        setEditingProductPicture(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteProduct = (productId) => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then(() => {
        setProducts(products.filter((product) => product._id !== productId));
      })
      .catch((err) => console.error(err));
  };

  const handleInputChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handlePictureChangeEdit = (e) => {
    setEditingProductPicture(e.target.files[0]);
  };

  return (
    <div className="admin-inventory-container">
      <header className="common-header">
        <div className="header-buttons">
          <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
        </div>
        <h1 className='heading'>Inventory</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <main className="admin-inventory-main">
      <section className="products-section">
        <h2>Products</h2>
        <ul className="product-list" style={{ listStyle: 'none', padding: 0 }}>
          {products.map((product) => (
            <li
              key={product._id}
              className="product-item"
              style={{
                display: 'flex',
                alignItems: 'flex-start', // Align items to the top
                marginBottom: '20px', // Space between product items
                borderBottom: '1px solid #ccc', // Optional separator
                paddingBottom: '10px',
              }}
            >
              {/* Display product image */}
              <img
                src={`${process.env.REACT_APP_BACKEND_BASEURL}/assets/${product.productPicturePath}`}
                alt={product.name}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '10px', // Slight curve for edges
                  marginRight: '20px', // Space between image and text
                }}
              />

              {/* Product details */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px', textAlign: 'left' }}>{product.name}</h3>
                <p style={{ margin: '0 0 5px', textAlign: 'left' }}>{product.description}</p>
                <p style={{ margin: '0 0 5px', textAlign: 'left' }}>
                  <strong>Vouchers Needed:</strong> {product.voucherNeeded}
                </p>
                <p style={{ margin: '0 0 10px', textAlign: 'left' }}>
                  <strong>Stock Quantity:</strong> {product.stockQuantity}
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '20px' }}>
                <button
                  className="edit-button"
                  onClick={() => handleEditProduct(product)}
                  style={{
                    padding: '5px 10px',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product._id)}
                  style={{
                    padding: '5px 10px',
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

        {editingProduct && (
          <div className="edit-popup">
            <div className="edit-popup-content">
              <h2>Edit {editingProduct.name}</h2>
              <label>
                Product Name:
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleInputChangeEdit}
                  placeholder="Product Name"
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChangeEdit}
                  placeholder="Product Description"
                />
              </label>
              <label>
                Voucher Needed:
                <input
                  type="number"
                  name="voucherNeeded"
                  value={editingProduct.voucherNeeded}
                  onChange={handleInputChangeEdit}
                  placeholder="Voucher Needed"
                />
              </label>
              <label>
                Stock Quantity:
                <input
                  type="number"
                  name="stockQuantity"
                  value={editingProduct.stockQuantity}
                  onChange={handleInputChangeEdit}
                  placeholder="Stock Quantity"
                />
              </label>
              <label>
                Product Picture:
                <input
                  type="file"
                  onChange={handlePictureChangeEdit}
                />
              </label>
              <button onClick={handleUpdateProduct}>Update</button>
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </div>
        )}
        <section className="add-product-section">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            <label>
              Product Name:
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product Name"
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Product Description"
              />
            </label>
            <label>
              Voucher Needed:
              <input
                type="number"
                name="voucherNeeded"
                value={newProduct.voucherNeeded}
                onChange={handleInputChange}
                placeholder="Voucher Needed"
              />
            </label>
            <label>
              Stock Quantity:
              <input
                type="number"
                name="stockQuantity"
                value={newProduct.stockQuantity}
                onChange={handleInputChange}
                placeholder="Stock Quantity"
              />
            </label>
            <label>
              Product Picture:
              <input
                type="file"
                onChange={handlePictureChange}
              />
            </label>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Add Product</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminInventory;