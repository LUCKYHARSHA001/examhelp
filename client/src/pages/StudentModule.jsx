// client/src/pages/StudentModule.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/UI/Button.jsx';
import Tabs from '../components/UI/Tabs.jsx';

// Pre-packaged certificates
const INITIAL_CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Advanced Cellular Biology Credential',
    subject: 'Biology & Life Sciences',
    earnedDate: '2026-06-12',
    examScore: '100%',
    hash: 'CS-8394-BL92',
  },
  {
    id: 'cert-2',
    title: 'Data Structures Master Certification',
    subject: 'Computer Science',
    earnedDate: '2026-06-14',
    examScore: '90%',
    hash: 'CS-4830-DS18',
  },
];

const StudentModule = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [certs, setCerts] = useState(INITIAL_CERTIFICATES);

  const tabs = [
    { key: 'profile', label: 'Student Profile' },
    { key: 'analytics', label: 'Performance Analytics' },
    { key: 'certs', label: 'Earned Certifications' },
  ];

  // Dynamically generates a premium SVG Certificate and triggers download
  const handleDownloadCertificate = (cert) => {
    const userName = user ? user.name : 'ExamReady Student';
    
    // SVG Vector template for the certificate
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 595" width="100%" height="100%">
        <!-- Border & Background -->
        <rect width="842" height="595" fill="#0F1117" />
        <rect x="20" y="20" width="802" height="555" fill="none" stroke="#rgba(255,255,255,0.08)" stroke-width="2" />
        <rect x="30" y="30" width="782" height="535" fill="none" stroke="#C084FC" stroke-width="1.5" stroke-dasharray="8 4" />
        
        <!-- Corner Ornaments -->
        <path d="M30 60 L30 30 L60 30" fill="none" stroke="#C084FC" stroke-width="3" />
        <path d="M812 60 L812 30 L782 30" fill="none" stroke="#C084FC" stroke-width="3" />
        <path d="M30 535 L30 565 L60 565" fill="none" stroke="#C084FC" stroke-width="3" />
        <path d="M812 535 L812 565 L782 565" fill="none" stroke="#C084FC" stroke-width="3" />

        <!-- Radial glow effect -->
        <circle cx="421" cy="297" r="250" fill="url(#glowGradient)" opacity="0.1" />
        
        <defs>
          <radialGradient id="glowGradient">
            <stop offset="0%" stop-color="#C084FC" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>
        </defs>

        <!-- Logo -->
        <text x="421" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" fill="#C084FC" text-anchor="middle" letter-spacing="4">EXAMREADY PORTAL</text>
        <line x1="360" y1="110" x2="482" y2="110" stroke="rgba(255,255,255,0.15)" stroke-width="1" />

        <!-- Header -->
        <text x="421" y="170" font-family="'Inter', sans-serif" font-size="16" font-weight="600" fill="#B4B8C5" text-anchor="middle" letter-spacing="2">CERTIFICATE OF ACHIEVEMENT</text>
        <text x="421" y="210" font-family="'Inter', sans-serif" font-size="14" font-weight="400" fill="#62677A" text-anchor="middle">This is proudly presented to</text>
        
        <!-- Student Name -->
        <text x="421" y="270" font-family="'Plus Jakarta Sans', sans-serif" font-size="36" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${userName.toUpperCase()}</text>
        <line x1="240" y1="290" x2="602" y2="290" stroke="#C084FC" stroke-width="2" />

        <!-- Description -->
        <text x="421" y="340" font-family="'Inter', sans-serif" font-size="14" font-weight="400" fill="#B4B8C5" text-anchor="middle">for successfully demonstrating proficiency and passing the examination in</text>
        <text x="421" y="380" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700" fill="#E9D5FF" text-anchor="middle">${cert.title}</text>
        <text x="421" y="415" font-family="'Inter', sans-serif" font-size="13" font-weight="500" fill="#62677A" text-anchor="middle">Earned on ${cert.earnedDate} | Exam Grade: ${cert.examScore}</text>

        <!-- Signatures and Verification -->
        <text x="180" y="495" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF" text-anchor="middle">Gemini AI Engine</text>
        <line x1="100" y1="475" x2="260" y2="475" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <text x="180" y="515" font-family="'Inter', sans-serif" font-size="11" fill="#62677A" text-anchor="middle">CREDENTIAL ISSUER</text>

        <text x="660" y="495" font-family="'Inter', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF" text-anchor="middle">ExamReady Platform</text>
        <line x1="580" y1="475" x2="740" y2="475" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <text x="660" y="515" font-family="'Inter', sans-serif" font-size="11" fill="#62677A" text-anchor="middle">VERIFIED AUDITOR</text>
        
        <!-- Verification Hash -->
        <text x="421" y="525" font-family="monospace" font-size="10" fill="rgba(255,255,255,0.15)" text-anchor="middle">VERIFICATION HASH: ${cert.hash}</text>
      </svg>
    `;

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${cert.title.replace(/\s+/g, '_')}_Certificate.svg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Certificate vector SVG downloaded successfully!', 'success');
  };

  return (
    <div style={styles.container}>
      {/* Tab Navigators */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* STUDENT PROFILE VIEW */}
      {activeTab === 'profile' && user && (
        <div style={styles.tabContent} className="animate-fade-in">
          <div style={styles.profileHeaderCard}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} style={styles.largeAvatar} />
            ) : (
              <div style={styles.largeAvatarFallback}>{user.name.charAt(0).toUpperCase()}</div>
            )}
            <div style={styles.profileHeaderDetails}>
              <h2 style={styles.profileName}>{user.name}</h2>
              <p style={styles.profileEmail}>{user.email}</p>
              <span style={styles.joinDate}>
                Student Portal Member since {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div style={styles.cardSection}>
            <h3 style={styles.sectionTitle}>Account Details</h3>
            <div style={styles.detailsList}>
              <div style={styles.detailsItem}>
                <span style={styles.detailsLabel}>Registration Status</span>
                <span style={styles.detailsValue}>Verified Standard Account</span>
              </div>
              <div style={styles.detailsItem}>
                <span style={styles.detailsLabel}>Assigned School Node</span>
                <span style={styles.detailsValue}>Default Central Cloud</span>
              </div>
              <div style={styles.detailsItem}>
                <span style={styles.detailsLabel}>OAuth Linkages</span>
                <span style={styles.detailsValue}>
                  {user.googleId ? 'Google Account Bound' : 'Email & Password Registered'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PERFORMANCE ANALYTICS VIEW */}
      {activeTab === 'analytics' && (
        <div style={styles.tabContent} className="animate-fade-in">
          {/* Core metrics counter bar */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricItem}>
              <span style={styles.metricVal}>95%</span>
              <span style={styles.metricLabel}>Average Quiz Accuracy</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricVal}>1.2 hr</span>
              <span style={styles.metricLabel}>Study Session Time</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricVal}>85%</span>
              <span style={styles.metricLabel}>Concept Retention Rate</span>
            </div>
          </div>

          {/* Progress Bars section */}
          <div style={styles.cardSection}>
            <h3 style={styles.sectionTitle}>Subject Progression</h3>
            
            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Biological & Life Sciences</span>
                <span style={styles.progressValue}>80% Mastered</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: '80%', backgroundColor: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Algorithms & Graph Theory</span>
                <span style={styles.progressValue}>60% Mastered</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: '60%', backgroundColor: 'var(--accent-secondary)' }} />
              </div>
            </div>

            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Textbook Summarizations & Review</span>
                <span style={styles.progressValue}>100% Limit Complete</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: '100%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EARNED CERTIFICATIONS VIEW */}
      {activeTab === 'certs' && (
        <div style={styles.tabContent} className="animate-fade-in">
          <div style={styles.certList}>
            {certs.map((c) => (
              <div key={c.id} style={styles.certCard} className="interactive-hover">
                <div style={styles.certVisualBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
                    <path d="M12 2a7 7 0 0 0-7 7c0 2.65 1.45 4.9 3.59 6h6.82c2.14-1.1 3.59-3.35 3.59-6a7 7 0 0 0-7-7z"></path>
                  </svg>
                </div>
                <div style={styles.certInfo}>
                  <h4 style={styles.certCardTitle}>{c.title}</h4>
                  <p style={styles.certSubject}>{c.subject}</p>
                  <div style={styles.certMetadata}>
                    <span>Earned On: <strong>{c.earnedDate}</strong></span>
                    <span>•</span>
                    <span>Test Score: <strong>{c.examScore}</strong></span>
                  </div>
                </div>
                <Button onClick={() => handleDownloadCertificate(c)} className="button-shine">
                  Download SVG Vector
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '40px',
    textAlign: 'left',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  profileHeaderCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '32px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap',
  },
  largeAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--border-color)',
  },
  largeAvatarFallback: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-secondary)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '32px',
    fontFamily: 'var(--font-secondary)',
    border: '3px solid var(--border-color)',
  },
  profileHeaderDetails: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  profileName: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  profileEmail: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  joinDate: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontWeight: '500',
  },
  cardSection: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    boxShadow: 'var(--shadow-sm)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  detailsItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
    paddingBottom: '8px',
  },
  detailsLabel: {
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  detailsValue: {
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
  },
  metricItem: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  metricVal: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--accent-primary)',
    fontFamily: 'var(--font-secondary)',
    display: 'block',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: '20px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  progressLabel: {
    color: 'var(--text-primary)',
  },
  progressValue: {
    color: 'var(--accent-primary)',
  },
  progressBarBg: {
    height: '8px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
  },
  certList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  certCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap',
  },
  certVisualBox: {
    fontSize: '28px',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certInfo: {
    flex: 1,
    textAlign: 'left',
    minWidth: '240px',
  },
  certCardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  certSubject: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  certMetadata: {
    display: 'flex',
    gap: '10px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '6px',
  },
};

export default StudentModule;
