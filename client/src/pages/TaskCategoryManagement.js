import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskCategoryManagement.css';

const TaskCategoryManagement = () => {
    const [taskCategories, setTaskCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', voucherValue: 0, description: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTaskCategories();
    }, []);

    const fetchTaskCategories = () => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/task-categories`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setTaskCategories(data))
            .catch((err) => console.error(err));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'voucherValue' && value < 0) {
            return; // Prevent negative values
        }
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleAddCategory = () => {
        if (newCategory.voucherValue === 0) {
            setError('Voucher value must be greater than 0');
            return;
        }

        if (newCategory.name.trim() === '') {
            setError('Category name is required');
            return;
        }

        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/task-categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newCategory),
        })
            .then((res) => res.json())
            .then((data) => {
                setTaskCategories([...taskCategories, data]);
                setNewCategory({ name: '', voucherValue: 0, description: '' });
                setError('');
            })
            .catch((err) => console.error(err));
    };

    const handleDeleteCategory = (categoryId) => {
        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/task-categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error deleting category');
                setTaskCategories(taskCategories.filter(category => category._id !== categoryId));
            })
            .catch((err) => console.error(err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="task-category-management">
            <header className="common-header">
                <button className="nav-button" onClick={() => navigate('/admin-dashboard')}>Back to Dashboard</button>
                <h1>Task Category Management</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <main className="task-category-main">
                <section className="task-categories-section">
                    <h2>Active Tasks</h2>
                    <ul className="task-category-list">
                        {taskCategories.map((category) => (
                            <li key={category._id} className="task-category-item">
                                <div className="task-category-info">
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                    <p>Voucher Value: {category.voucherValue}</p>
                                </div>
                                <button className="delete-button" onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="add-task-category-section">
                    <h2>Create New Task</h2>
                    <label>
                        <span>Category Name:</span>
                        <input
                            type="text"
                            name="name"
                            value={newCategory.name}
                            onChange={handleInputChange}
                            placeholder="Category Name"
                        />
                    </label>
                    <label>
                        <span>Voucher Value:</span>
                        <input
                            type="number"
                            name="voucherValue"
                            value={newCategory.voucherValue}
                            onChange={handleInputChange}
                            placeholder="Voucher Value"
                        />
                    </label>
                    <label>
                        <span>Description:</span>
                        <input
                            type="text"
                            name="description"
                            value={newCategory.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                        />
                    </label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button onClick={handleAddCategory}>Add Category</button>
                </section>
            </main>
        </div>
    );
};

export default TaskCategoryManagement;