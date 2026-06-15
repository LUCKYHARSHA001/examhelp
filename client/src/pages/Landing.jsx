// client/src/pages/Landing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/UI/Button.jsx';

// Inline Custom SVGs for landing features (no emojis)
const SVGShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const SVGPaper = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const SVGLightning = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const SVGAward = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const SVGClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Interactive PDF demo states
  const [demoStep, setDemoStep] = useState(0); // 0: Idle, 1: Uploading, 2: Parsing, 3: Completed
  const [demoProgress, setDemoProgress] = useState(0);

  // Interactive Exam states
  const [selectedOption, setSelectedOption] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // PDF demo simulation trigger
  const runPdfDemo = () => {
    if (demoStep > 0) return;
    setDemoStep(1);
    setDemoProgress(0);
  };

  useEffect(() => {
    let interval;
    if (demoStep === 1) {
      interval = setInterval(() => {
        setDemoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDemoStep(2);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    } else if (demoStep === 2) {
      const timer = setTimeout(() => {
        setDemoStep(3);
      }, 1500);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [demoStep]);

  const handleResetPdfDemo = () => {
    setDemoStep(0);
    setDemoProgress(0);
  };

  const handleOptionClick = (index) => {
    if (examSubmitted) return;
    setSelectedOption(index);
  };

  return (
    <div style={styles.landingWrapper}>
      {/* Navigation Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <SVGLightning />
          </div>
          <span style={styles.logoText}>StudySnap</span>
        </div>
        <div style={styles.navActions}>
          {user ? (
            <Button onClick={() => navigate('/dashboard')} className="button-shine">
              Portal Dashboard
            </Button>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} style={styles.textBtn}>
                Sign In
              </button>
              <Button onClick={() => navigate('/auth')} className="button-shine">
                Get Started Free
              </Button>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION WITH SPUN ORBITS & DRIFTING PARTICLES */}
      <section style={{...styles.heroSection, position: 'relative'}} className="animate-slide-up">
        {/* Concentric spinning radar orbits in background */}
        <div className="cyber-orbit-container">
          <div className="cyber-orbit-ring ring-1 animate-spin-slow"></div>
          <div className="cyber-orbit-ring ring-2 animate-spin-reverse"></div>
          <div className="cyber-orbit-ring ring-3 animate-spin-slow"></div>
        </div>

        {/* Local tech particles drifting around title */}
        <div className="tech-particle" style={{ top: '-10%', left: '-15%', animation: 'float-particle-1 12s ease-in-out infinite', fontSize: '20px', opacity: 0.35 }}>+</div>
        <div className="tech-particle" style={{ top: '20%', right: '-20%', animation: 'float-particle-2 16s ease-in-out infinite', fontSize: '15px', opacity: 0.25 }}>◇</div>
        <div className="tech-particle" style={{ bottom: '20%', left: '-10%', animation: 'float-particle-3 10s ease-in-out infinite', fontSize: '13px', opacity: 0.4 }}>⚡</div>
        <div className="tech-particle" style={{ bottom: '5%', right: '-12%', animation: 'float-particle-1 14s ease-in-out infinite', fontSize: '18px', opacity: 0.45 }}>+</div>
        <div className="tech-particle" style={{ top: '45%', left: '-25%', animation: 'float-particle-2 18s ease-in-out infinite', fontSize: '11px', opacity: 0.3 }}>▪</div>

        <div style={styles.badgeWrapper} className="interactive-hover">
          <span style={styles.pillBadge}>
            <span style={styles.badgePulse}></span>
            AI-Powered Student Portal v2.0
          </span>
        </div>
        
        <h1 style={styles.heroTitle}>
          Smarter Study Guides.<br />
          <span className="gradient-text">Instant Exam Preparation.</span>
        </h1>
        
        <p style={styles.heroSubtitle}>
          Upload syllabus chapters and textbooks to generate lecture outlines, formula sheets, and timed interactive practice exams in seconds.
        </p>

        <div style={styles.heroCTAs}>
          <Button size="large" onClick={() => navigate('/auth')} className="button-shine" style={styles.heroMainBtn}>
            Start Learning Free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </Button>
          <a href="#demo" style={styles.secondaryHeroBtn} className="interactive-hover">
            Explore Interactive Demo
          </a>
        </div>
      </section>

      {/* CORE FEATURE GRID */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Everything You Need to Ace Your Exams</h2>
          <p style={styles.sectionSubtitle}>Engineered for students who value structural clarity, fast recall, and high-performance credentials.</p>
        </div>

        <div style={styles.featuresGrid}>
          <div style={styles.featureCard} className="glass-card">
            <div style={{ ...styles.featureIcon, color: 'var(--accent-primary)' }}>
              <SVGPaper />
            </div>
            <h3 style={styles.featureTitle}>AI Study Guide notes</h3>
            <p style={styles.featureDesc}>Extract structures from lengthy slides or research papers into bullet reviews, glossary cards, and summaries.</p>
          </div>

          <div style={styles.featureCard} className="glass-card">
            <div style={{ ...styles.featureIcon, color: 'var(--accent-secondary)' }}>
              <SVGClock />
            </div>
            <h3 style={styles.featureTitle}>Timed Practice Exams</h3>
            <p style={styles.featureDesc}>Simulate biology, computer science, or mathematics tests with customized questions, live timers, and checks.</p>
          </div>

          <div style={styles.featureCard} className="glass-card">
            <div style={{ ...styles.featureIcon, color: 'var(--success)' }}>
              <SVGAward />
            </div>
            <h3 style={styles.featureTitle}>Credited Certificates</h3>
            <p style={styles.featureDesc}>Complete mock modules with high scores to earn inline vectorized certificates verifying your core topics.</p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO PLAYGROUND */}
      <section id="demo" style={styles.demoSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Interactive Sandbox Playground</h2>
          <p style={styles.sectionSubtitle}>Experience the core platform mechanics directly below before creating an account.</p>
        </div>

        <div style={styles.demoLayout}>
          {/* MOCK PDF CONVERTER DEMO */}
          <div style={styles.demoCard} className="glass-card">
            <div style={styles.demoCardHeader}>
              <h3 style={styles.demoCardTitle}>1. Live PDF Concept Parser</h3>
              <p style={styles.demoCardSub}>Upload or drag files to test the AI outline engine.</p>
            </div>

            <div style={styles.demoSandbox}>
              {demoStep === 0 && (
                <div style={styles.mockUploadBox} onClick={runPdfDemo} className="interactive-hover">
                  <div style={styles.uploadIconWrapper}>
                    <SVGPaper />
                  </div>
                  <span style={styles.mockUploadTitle}>Click to Analyze Sample PDF</span>
                  <span style={styles.mockUploadSub}>Simulates "Cellular_Mitosis_Review.pdf" (3.4 MB)</span>
                </div>
              )}

              {demoStep === 1 && (
                <div style={styles.mockProcessing}>
                  <div style={styles.progressBarWrapper}>
                    <div style={styles.progressBarHeader}>
                      <span>Scanning PDF Pages...</span>
                      <span>{demoProgress}%</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div style={{ ...styles.progressBarFill, width: `${demoProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {demoStep === 2 && (
                <div style={styles.mockProcessing}>
                  <div style={styles.spinner}></div>
                  <span style={styles.processingText}>Gemini AI is structuring concept map definitions...</span>
                </div>
              )}

              {demoStep === 3 && (
                <div style={styles.mockResultContainer}>
                  <div style={styles.mockResultHeader}>
                    <span>Mitosis_Review_StudyGuide.md</span>
                    <button onClick={handleResetPdfDemo} style={styles.resetBtn}>Reset Demo</button>
                  </div>
                  <div style={styles.mockResultBody}>
                    <h4 style={styles.parsedHeader}># Cellular Mitosis: Key Concepts</h4>
                    <p style={styles.parsedText}>Mitosis is a process of nuclear division in eukaryotic cells that occurs when a parent cell divides to produce two identical daughter cells.</p>
                    <ul style={styles.parsedList}>
                      <li><strong>Prophase:</strong> Chromatin condenses into visible chromosomes. The nuclear envelope breaks down.</li>
                      <li><strong>Metaphase:</strong> Chromosomes align along the metaphase plate in the center.</li>
                      <li><strong>Anaphase:</strong> Sister chromatids are pulled apart by spindle fibers.</li>
                      <li><strong>Telophase:</strong> New nuclear membranes form around the two sets of chromosomes.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOCK TIMED EXAM MODULE DEMO */}
          <div style={styles.demoCard} className="glass-card">
            <div style={styles.demoCardHeader}>
              <h3 style={styles.demoCardTitle}>2. Timed Practice Exam Preview</h3>
              <p style={styles.demoCardSub}>Solve review questions and check detailed AI keys.</p>
            </div>

            <div style={styles.demoSandbox}>
              <div style={styles.mockQuestionBox}>
                <div style={styles.mockQuestionHeader}>
                  <span style={styles.questionNum}>Question 4 of 10</span>
                  <span style={styles.questionTimer}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    14:32 remaining
                  </span>
                </div>
                <p style={styles.questionPrompt}>Which of the following cellular phases is characterized by the alignment of chromosomes along the central equator plane of the cell?</p>
                
                <div style={styles.optionsList}>
                  {['Prophase', 'Metaphase', 'Anaphase', 'Telophase'].map((option, idx) => {
                    let optionStyle = styles.optionItem;
                    if (selectedOption === idx) {
                      if (examSubmitted) {
                        optionStyle = idx === 1 ? styles.optionCorrect : styles.optionIncorrect;
                      } else {
                        optionStyle = styles.optionSelected;
                      }
                    } else if (examSubmitted && idx === 1) {
                      optionStyle = styles.optionCorrect;
                    }

                    return (
                      <div 
                        key={idx} 
                        onClick={() => handleOptionClick(idx)}
                        style={optionStyle}
                      >
                        <span style={styles.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                        <span>{option}</span>
                      </div>
                    );
                  })}
                </div>

                {!examSubmitted ? (
                  <Button 
                    disabled={selectedOption === null}
                    onClick={() => setExamSubmitted(true)}
                    style={styles.submitExamBtn}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <div style={styles.explanationCard} className="animate-slide-up">
                    <div style={styles.explanationHeader}>
                      <span style={{ color: selectedOption === 1 ? 'var(--success)' : 'var(--error)' }}>
                        {selectedOption === 1 ? '✓ Correct Answer' : '✗ Incorrect'}
                      </span>
                    </div>
                    <p style={styles.explanationBody}>
                      <strong>Explanation:</strong> During <strong>Metaphase</strong>, the cell's chromosomes align along the center equator (metaphase plate) of the spindle apparatus, allowing sister chromatids to separate cleanly in the next stage.
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedOption(null);
                        setExamSubmitted(false);
                      }} 
                      style={styles.resetBtn}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section style={styles.ctaSection} className="animate-pulse-glow">
        <h2 style={styles.ctaTitle}>Ready to Accelerate Your Academic Learning?</h2>
        <p style={styles.ctaSubtitle}>Join thousands of students who have optimized their study workflows with AI outlines and interactive practice examinations.</p>
        <Button size="large" onClick={() => navigate('/auth')} className="button-shine" style={styles.ctaBtn}>
          Get Started For Free Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
            <polyline points="22 2 15 22 11 13 2 9 22 2"></polyline>
            <line x1="22" y1="2" x2="11" y2="13"></line>
          </svg>
        </Button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.footerText}>&copy; 2026 StudySnap Inc. Designed under premium Fortune 50 architectural guidelines.</span>
      </footer>
    </div>
  );
};

const styles = {
  landingWrapper: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    position: 'relative',
    padding: '0 40px',
    fontFamily: 'var(--font-primary)',
    overflowX: 'hidden',
  },
  blurGlowLeft: {
    position: 'absolute',
    top: '10%',
    left: '-10%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(192, 132, 252, 0.12) 0%, transparent 70%)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  blurGlowRight: {
    position: 'absolute',
    top: '30%',
    right: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  header: {
    height: 'var(--navbar-height)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-glow)',
    color: '#FFFFFF',
  },
  logoText: {
    fontFamily: 'var(--font-secondary)',
    fontSize: '20px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FFFFFF, var(--highlight))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.03em',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  textBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'color var(--transition-fast)',
    outline: 'none',
  },
  heroSection: {
    maxWidth: '800px',
    margin: '120px auto 80px auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  badgeWrapper: {
    marginBottom: '24px',
  },
  pillBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '20px',
    backgroundColor: 'rgba(192, 132, 252, 0.08)',
    border: '1px solid rgba(192, 132, 252, 0.2)',
    color: 'var(--accent-primary)',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.02em',
  },
  badgePulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    boxShadow: '0 0 8px var(--accent-primary)',
    animation: 'pulse 1.5s infinite ease-in-out',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '900',
    lineHeight: '1.15',
    color: 'var(--text-primary)',
    marginBottom: '24px',
    letterSpacing: '-0.03em',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '36px',
    maxWidth: '640px',
  },
  heroCTAs: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroMainBtn: {
    padding: '14px 28px',
    fontSize: '16px',
  },
  secondaryHeroBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    padding: '12px 24px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  featuresSection: {
    maxWidth: '1200px',
    margin: '80px auto',
    position: 'relative',
    zIndex: 10,
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  sectionSubtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '520px',
    margin: '0 auto',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    padding: '36px 30px',
    borderRadius: 'var(--radius-lg)',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  featureIcon: {
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    border: '1px solid var(--border-color)',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.01)',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  demoSection: {
    maxWidth: '1200px',
    margin: '100px auto',
    position: 'relative',
    zIndex: 10,
  },
  demoLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '32px',
    marginTop: '40px',
  },
  demoCard: {
    borderRadius: 'var(--radius-xl)',
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
  },
  demoCardHeader: {
    textAlign: 'left',
    marginBottom: '28px',
  },
  demoCardTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  demoCardSub: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  demoSandbox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    minHeight: '320px',
  },
  mockUploadBox: {
    border: '2px dashed var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: 'rgba(255,255,255,0.01)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconWrapper: {
    color: 'var(--accent-primary)',
    marginBottom: '16px',
    transform: 'scale(1.2)',
  },
  mockUploadTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  mockUploadSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  mockProcessing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  progressBarWrapper: {
    width: '100%',
    textAlign: 'left',
  },
  progressBarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    fontWeight: '500',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--accent-primary)',
    borderRadius: '3px',
    transition: 'width 0.1s linear',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '2px solid rgba(192, 132, 252, 0.1)',
    borderRadius: '50%',
    borderTopColor: 'var(--accent-primary)',
    animation: 'spin 0.8s ease-in-out infinite',
  },
  processingText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  mockResultContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    textAlign: 'left',
  },
  mockResultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '10px',
    marginBottom: '14px',
    fontWeight: '600',
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-primary)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
  },
  mockResultBody: {
    overflowY: 'auto',
    maxHeight: '220px',
  },
  parsedHeader: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  parsedText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
  },
  parsedList: {
    paddingLeft: '16px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  mockQuestionBox: {
    textAlign: 'left',
  },
  mockQuestionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px',
  },
  questionNum: {
    color: 'var(--accent-primary)',
  },
  questionTimer: {
    color: 'var(--text-muted)',
  },
  questionPrompt: {
    fontSize: '14px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    backgroundColor: 'var(--bg-primary)',
  },
  optionSelected: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--accent-primary)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    backgroundColor: 'rgba(192, 132, 252, 0.04)',
  },
  optionCorrect: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--success)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    cursor: 'default',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
  },
  optionIncorrect: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--error)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    cursor: 'default',
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
  },
  optionLetter: {
    fontWeight: '700',
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  submitExamBtn: {
    width: '100%',
    padding: '10px',
    fontSize: '13px',
  },
  explanationCard: {
    padding: '14px',
    backgroundColor: 'rgba(255,255,255,0.01)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    marginTop: '12px',
  },
  explanationHeader: {
    fontSize: '12px',
    fontWeight: '700',
    marginBottom: '6px',
    textAlign: 'left',
  },
  explanationBody: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '10px',
    textAlign: 'left',
  },
  ctaSection: {
    maxWidth: '900px',
    margin: '100px auto 120px auto',
    textAlign: 'center',
    padding: '60px 40px',
    borderRadius: 'var(--radius-xl)',
    backgroundColor: 'rgba(30, 34, 45, 0.5)',
    border: '1px solid var(--border-color)',
    position: 'relative',
    zIndex: 10,
  },
  ctaTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  ctaSubtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '520px',
    margin: '0 auto 28px auto',
    lineHeight: '1.6',
  },
  ctaBtn: {
    padding: '14px 32px',
    fontSize: '15px',
  },
  footer: {
    borderTop: '1px solid var(--border-color)',
    padding: '32px 0',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 10,
  },
  footerText: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: '500',
    letterSpacing: '0.02em',
  },
};

export default Landing;
