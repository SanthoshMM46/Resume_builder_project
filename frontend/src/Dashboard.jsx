import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

function Dashboard({ token }) {
  const [resumeData, setResumeData] = useState({
    personal: { name: '', email: '', phone: '', title: '', summary: '' },
    education: [],
    experience: [],
    skills: [],
    projects: []
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [saveStatus, setSaveStatus] = useState('');
  const resumeRef = useRef(null);

  useEffect(() => {
    // Load resume data
    const loadData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resume', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.data) {
          setResumeData(data.data);
        }
      } catch (err) {
        console.error('Failed to load resume data', err);
      }
    };
    loadData();
  }, [token]);

  const saveResume = async () => {
    setSaveStatus('Saving...');
    try {
      const response = await fetch('http://localhost:5000/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: resumeData })
      });
      if (response.ok) {
        setSaveStatus('Saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to save.');
      }
    } catch (err) {
      setSaveStatus('Error saving.');
    }
  };

  const exportPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin:       0,
      filename:     `${resumeData.personal.name || 'Resume'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [e.target.name]: e.target.value }
    });
  };

  // Helper function for arrays (education, experience, etc.)
  const addArrayItem = (key, emptyItem) => {
    setResumeData({ ...resumeData, [key]: [...resumeData[key], emptyItem] });
  };

  const updateArrayItem = (key, index, field, value) => {
    const newArray = [...resumeData[key]];
    newArray[index][field] = value;
    setResumeData({ ...resumeData, [key]: newArray });
  };

  const removeArrayItem = (key, index) => {
    const newArray = resumeData[key].filter((_, i) => i !== index);
    setResumeData({ ...resumeData, [key]: newArray });
  };

  // Skills input handler
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim());
    setResumeData({ ...resumeData, skills: skillsArray });
  };

  return (
    <div className="builder-container">
      {/* LEFT PANE: FORMS */}
      <div className="form-pane">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Resume Editor</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {saveStatus && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{saveStatus}</span>}
            <button className="btn btn-secondary" onClick={saveResume}>Save Draft</button>
            <button className="btn btn-primary" onClick={exportPDF}>Export PDF</button>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="section-card">
          <div className="section-header" onClick={() => setActiveSection(activeSection === 'personal' ? '' : 'personal')}>
            <h3 className="section-title">👤 Personal Details</h3>
            <span>{activeSection === 'personal' ? '▼' : '▶'}</span>
          </div>
          {activeSection === 'personal' && (
            <div className="section-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" name="name" value={resumeData.personal.name} onChange={handlePersonalChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input type="text" className="form-control" name="title" value={resumeData.personal.title} onChange={handlePersonalChange} />
              </div>
              <div className="flex-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={resumeData.personal.email} onChange={handlePersonalChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Professional Summary</label>
                <textarea className="form-control" name="summary" value={resumeData.personal.summary} onChange={handlePersonalChange} />
              </div>
            </div>
          )}
        </div>

        {/* Experience Section */}
        <div className="section-card">
          <div className="section-header" onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')}>
            <h3 className="section-title">💼 Work Experience</h3>
            <span>{activeSection === 'experience' ? '▼' : '▶'}</span>
          </div>
          {activeSection === 'experience' && (
            <div className="section-body">
              {resumeData.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div className="flex-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Company</label>
                      <input type="text" className="form-control" value={exp.company} onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Role</label>
                      <input type="text" className="form-control" value={exp.role} onChange={(e) => updateArrayItem('experience', index, 'role', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Duration (e.g. Jan 2020 - Present)</label>
                      <input type="text" className="form-control" value={exp.duration} onChange={(e) => updateArrayItem('experience', index, 'duration', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={exp.description} onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)} />
                  </div>
                  <button className="btn btn-danger" onClick={() => removeArrayItem('experience', index)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Remove</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })}>+ Add Experience</button>
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="section-card">
          <div className="section-header" onClick={() => setActiveSection(activeSection === 'education' ? '' : 'education')}>
            <h3 className="section-title">🎓 Education</h3>
            <span>{activeSection === 'education' ? '▼' : '▶'}</span>
          </div>
          {activeSection === 'education' && (
            <div className="section-body">
              {resumeData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #E5E7EB' }}>
                  <div className="flex-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Institution</label>
                      <input type="text" className="form-control" value={edu.institution} onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Degree</label>
                      <input type="text" className="form-control" value={edu.degree} onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input type="text" className="form-control" value={edu.year} onChange={(e) => updateArrayItem('education', index, 'year', e.target.value)} />
                  </div>
                  <button className="btn btn-danger" onClick={() => removeArrayItem('education', index)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Remove</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={() => addArrayItem('education', { institution: '', degree: '', year: '' })}>+ Add Education</button>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="section-card">
          <div className="section-header" onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')}>
            <h3 className="section-title">🛠️ Skills</h3>
            <span>{activeSection === 'skills' ? '▼' : '▶'}</span>
          </div>
          {activeSection === 'skills' && (
            <div className="section-body">
              <div className="form-group">
                <label className="form-label">Comma separated skills (e.g. React, Node.js, Python)</label>
                <input type="text" className="form-control" value={resumeData.skills.join(', ')} onChange={handleSkillsChange} />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANE: LIVE PREVIEW */}
      <div className="preview-pane">
        <div className="resume-document" ref={resumeRef}>
          <div className="resume-header">
            <h1 className="resume-name">{resumeData.personal.name || 'Your Name'}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{resumeData.personal.title || 'Professional Title'}</p>
            <div className="resume-contact">
              {resumeData.personal.email && <span>✉ {resumeData.personal.email}</span>}
              {resumeData.personal.phone && <span>📞 {resumeData.personal.phone}</span>}
            </div>
          </div>

          {resumeData.personal.summary && (
            <div className="resume-section">
              <h2 className="resume-section-title">Summary</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{resumeData.personal.summary}</p>
            </div>
          )}

          {resumeData.experience.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Experience</h2>
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="resume-item">
                  <div className="resume-item-header">
                    <span className="resume-item-title">{exp.role} {exp.company && `at ${exp.company}`}</span>
                    <span className="resume-item-date">{exp.duration}</span>
                  </div>
                  <div className="resume-item-desc" style={{ whiteSpace: 'pre-line' }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {resumeData.education.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              {resumeData.education.map((edu, i) => (
                <div key={i} className="resume-item">
                  <div className="resume-item-header">
                    <span className="resume-item-title">{edu.degree}</span>
                    <span className="resume-item-date">{edu.year}</span>
                  </div>
                  <div className="resume-item-subtitle">{edu.institution}</div>
                </div>
              ))}
            </div>
          )}

          {resumeData.skills.length > 0 && resumeData.skills[0] !== '' && (
            <div className="resume-section">
              <h2 className="resume-section-title">Skills</h2>
              <div className="skills-list">
                {resumeData.skills.map((skill, i) => (
                  skill.trim() && <span key={i} className="skill-badge">{skill.trim()}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
