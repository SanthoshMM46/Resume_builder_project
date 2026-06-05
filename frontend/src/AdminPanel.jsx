import React, { useState, useEffect } from 'react';

function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError('Failed to fetch user data. Access denied.');
        }
      } catch (err) {
        setError('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>🛡️ Admin Dashboard</h2>
      {error && <div className="auth-error">{error}</div>}
      
      {!error && (
        <div className="section-card">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: '#F9FAFB' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Username</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Resume Saved?</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{u.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{u.username}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="skill-badge" style={{ backgroundColor: u.is_admin ? '#FEF3C7' : '#EEF2FF', color: u.is_admin ? '#D97706' : 'var(--primary)' }}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {u.has_resume ? '✅ Yes' : '❌ No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p style={{ padding: '1rem', textAlign: 'center' }}>No users found.</p>}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
