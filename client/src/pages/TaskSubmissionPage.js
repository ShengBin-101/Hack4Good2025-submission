import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/TaskSubmission.css';

const TaskSubmission = () => {
  const [taskCategories, setTaskCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPicture, setTaskPicture] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);

    // Fetch task categories
    fetchTaskCategories();

    // Check if a category was pre-selected
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory._id);
    }
  }, [location.state]);

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

  const handleTaskPictureChange = (e) => {
    setTaskPicture(e.target.files[0]);
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (!selectedCategory || !taskDescription || !taskPicture) {
      setError('All fields are required.');
      return;
    }

    const selectedCategoryObj = taskCategories.find((category) => category._id === selectedCategory);
    const voucherRequest = selectedCategoryObj ? selectedCategoryObj.voucherValue : 0;
    const dateCompleted = new Date().toISOString();

    const formData = new FormData();
    formData.append('userId', JSON.parse(localStorage.getItem('user'))._id);
    formData.append('taskDescription', taskDescription);
    formData.append('voucherRequest', voucherRequest);
    formData.append('dateCompleted', dateCompleted);
    formData.append('picture', taskPicture);

    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate('/user-dashboard', { state: { activeTab: 'tasks' } }); // Navigate back to the tasks tab
      })
      .catch((err) => {
        console.error(err);
        setError('Error submitting task.');
      });
  };

  return (
    <div className="form-container">
      <h1>Submit Task</h1>
      <form onSubmit={handleSubmitTask}>
        <label>Task Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {taskCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <label>Task Description:</label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Describe the task you completed"
        />
        <label>Task Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleTaskPictureChange}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="button-container">
          <button type="submit">Submit Task</button>
          <button type="button" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
        </div>
      </form>
    </div>
  );
};

export default TaskSubmission;
