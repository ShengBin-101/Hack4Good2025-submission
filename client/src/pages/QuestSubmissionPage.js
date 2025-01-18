import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/QuestSubmissionPage.css';

const QuestSubmissionPage = () => {
    const [proofImage, setProofImage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedQuest } = location.state;

    const handleProofImageChange = (e) => {
        setProofImage(e.target.files[0]);
    };

    const handleSubmitQuest = (e) => {
        e.preventDefault();
        if (!proofImage) {
            alert('Proof image is required.');
            return;
        }

        const formData = new FormData();
        formData.append('userId', JSON.parse(localStorage.getItem('user'))._id);
        formData.append('questId', selectedQuest._id);
        formData.append('proofImage', proofImage);

        const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/quest-submissions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                navigate('/user-dashboard', { state: { activeTab: 'quests' } }); // Navigate back to the quest tab
            })
            .catch((err) => console.error('Error submitting quest:', err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="quest-submission-page">
            <header className="user-header">
                <h1>Quest Submission</h1>
                <button className="nav-button" onClick={() => navigate('/user-dashboard')}>Back to Dashboard</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>
            <main className="quest-submission-main">
                <section className="submit-quest-section">
                    <h2>Submit Quest</h2>
                    <form onSubmit={handleSubmitQuest}>
                        <label>Quest Name:</label>
                        <p>{selectedQuest.name}</p>
                        <label>Proof Image:</label>
                        <input type="file" accept="image/*" onChange={handleProofImageChange} />
                        <button type="submit">Submit Quest</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default QuestSubmissionPage;