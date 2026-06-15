// client/src/pages/SummaryDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { summaryAPI } from '../api/api.js';
import Button from '../components/UI/Button.jsx';

// A lightweight, performant zero-dependency custom Markdown-to-HTML parser 
const parseMarkdown = (markdownText) => {
  if (!markdownText) return '';
  
  let html = markdownText
    // Escape HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h4 style="margin-top: 20px; margin-bottom: 8px; font-weight: 700; color: var(--text-primary); font-family: var(--font-secondary);">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="margin-top: 24px; margin-bottom: 12px; font-weight: 700; color: var(--text-primary); font-family: var(--font-secondary);">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="margin-top: 32px; margin-bottom: 16px; font-weight: 800; color: var(--text-primary); font-family: var(--font-secondary); border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">$1</h2>');

  // Blockquotes (e.g. > [!NOTE] or general quotes)
  html = html.replace(/^&gt; \[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*$)/gim, (_, type, content) => {
    const colorMap = {
      NOTE: 'var(--accent-primary)',
      TIP: 'var(--success)',
      IMPORTANT: 'var(--accent-secondary)',
      WARNING: 'var(--warning)',
      CAUTION: 'var(--error)',
    };
    const borderCol = colorMap[type] || 'var(--accent-primary)';
    return `<div style="margin: 16px 0; padding: 14px 20px; border-left: 4px solid ${borderCol}; background-color: rgba(255,255,255,0.02); border-radius: 0 var(--radius-md) var(--radius-md) 0;"><strong style="color: ${borderCol}; text-transform: uppercase; font-size: 12px; font-family: var(--font-secondary); display: block; margin-bottom: 4px;">${type}</strong>${content}</div>`;
  });
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote style="margin: 16px 0; padding: 10px 20px; border-left: 4px solid var(--accent-primary); background-color: rgba(255,255,255,0.01); color: var(--text-secondary);">$1</blockquote>');

  // Code blocks (multiline)
  html = html.replace(/```([\s\S]*?)```/gm, '<pre style="background-color: var(--bg-secondary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow-x: auto; margin: 16px 0; font-family: monospace; font-size: 13px; color: var(--highlight); line-height: 1.5;"><code>$1</code></pre>');

  // Inline Code
  html = html.replace(/`([^`]+)`/g, '<code style="background-color: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: var(--accent-primary);">$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 700;">$1</strong>');

  // Bullet Lists
  html = html.replace(/^\- (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 6px; color: var(--text-secondary); list-style-type: disc;">$1</li>');

  // Paragraph lines (not already headers, code or lists)
  // Splits by double newline and wraps block texts
  const paragraphs = html.split('\n\n');
  const compiled = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<pre') || trimmed.startsWith('<li')) {
      return trimmed;
    }
    return `<p style="margin-bottom: 14px; color: var(--text-secondary); text-align: justify;">${trimmed}</p>`;
  }).join('\n');

  return compiled;
};

const SummaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [summaryText, setSummaryText] = useState('');
  const [status, setStatus] = useState('PENDING'); // PENDING | PROCESSING | DONE | FAILED
  const [errorMsg, setErrorMsg] = useState('');
  const [streamConnecting, setStreamConnecting] = useState(false);
  const eventSourceRef = useRef(null);
  const streamEndRef = useRef(null);

  const fetchStaticSummary = async () => {
    try {
      const data = await summaryAPI.get(id);
      setSummary(data);
      setSummaryText(data.summaryText || '');
      setStatus(data.status);
      setErrorMsg(data.errorMsg || '');
      
      // If still processing, connect EventSource to start streaming
      if (data.status === 'PENDING' || data.status === 'PROCESSING') {
        connectSSE();
      }
    } catch (err) {
      addToast('Failed to retrieve study guide details.', 'error');
      navigate('/dashboard');
    }
  };

  const connectSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setStreamConnecting(true);
    const sseUrl = summaryAPI.getStreamUrl(id);
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.onopen = () => {
      setStreamConnecting(false);
      setStatus('PROCESSING');
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.chunk) {
          setSummaryText((prev) => prev + data.chunk);
          // Scroll dynamically to stream end during live printing
          streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (data.done) {
          es.close();
          setStatus('DONE');
          addToast('Study guide compiled successfully!', 'success');
        }
        
        if (data.error) {
          es.close();
          setStatus('FAILED');
          setErrorMsg(data.error);
          addToast('AI Generation failed.', 'error');
        }
      } catch (err) {
        console.error('[SSE Parse Error]', err);
      }
    };

    es.onerror = (err) => {
      console.error('[SSE Connection Error]', err);
      setStreamConnecting(false);
      // Let EventSource retry automatically or close if connection dropped
    };
  };

  useEffect(() => {
    fetchStaticSummary();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [id]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summaryText);
    addToast('Study guide copied to clipboard!', 'success');
  };

  const handleDownloadMd = () => {
    if (!summaryText) return;
    const blob = new Blob([summaryText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${summary?.fileName.replace('.pdf', '')}_study_guide.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Markdown guide downloaded!', 'success');
  };

  const getStatusText = () => {
    switch (status) {
      case 'PENDING': return 'Waiting in queue...';
      case 'PROCESSING': return 'AI summarizing in progress...';
      case 'FAILED': return 'Compilation Failed';
      case 'DONE': return 'Ready';
      default: return '';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Info Details */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          &larr; Return to Dashboard
        </button>
        <div style={styles.headerRight}>
          <span style={{
            ...styles.badge,
            ...styles[`badge_${status}`],
          }}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {summary && (
        <div style={styles.metaBox}>
          <h2 style={styles.title}>{summary.fileName}</h2>
          <div style={styles.metaGrid}>
            <div>
              <span style={styles.metaLabel}>Target Exam: </span>
              <span style={styles.metaValue}>{summary.examTime}</span>
            </div>
            <div>
              <span style={styles.metaLabel}>Summary Style: </span>
              <span style={styles.metaValue}>{summary.summaryType}</span>
            </div>
            {summary.focusTopic && (
              <div>
                <span style={styles.metaLabel}>Focus Area: </span>
                <span style={styles.metaValue}>{summary.focusTopic}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Viewer Panel */}
      <div style={styles.viewerPanel}>
        {(status === 'PENDING' || status === 'PROCESSING') && (
          <div style={styles.processingIndicator}>
            <div style={styles.spinner}></div>
            <div style={styles.processingText}>
              <h4>Synthesizing Study Guides</h4>
              <p>Gemini is scanning terms, outlining steps, and constructing cheat sheets.</p>
            </div>
          </div>
        )}

        {status === 'FAILED' && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--error)' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </span>
            <h4 style={styles.errorTitle}>Study Guide Generation Failed</h4>
            <p style={styles.errorDesc}>{errorMsg || 'An unexpected error occurred during processing.'}</p>
            <Button onClick={connectSSE} style={{ marginTop: '16px' }}>
              Retry Connection
            </Button>
          </div>
        )}

        {/* Live Text stream console */}
        {summaryText && (
          <div style={styles.contentCard}>
            <div style={styles.toolbar}>
              <span style={styles.toolbarTitle}>AI Study Guide notes</span>
              <div style={styles.toolbarActions}>
                <Button variant="secondary" onClick={handleCopyToClipboard} style={styles.toolBtn}>
                  Copy Content
                </Button>
                <Button variant="outline" onClick={handleDownloadMd} style={styles.toolBtn}>
                  Download Markdown (.md)
                </Button>
              </div>
            </div>
            
            <div 
              style={styles.markdownBody}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(summaryText) }}
            />
            
            {status === 'PROCESSING' && (
              <span style={styles.cursorBlink}>▋</span>
            )}
            <div ref={streamEndRef} />
          </div>
        )}

        {!summaryText && (status === 'PENDING' || status === 'PROCESSING') && (
          <div style={styles.skeletons}>
            <div className="skeleton" style={{ height: '28px', width: '40%', marginBottom: '16px' }} />
            <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '10px' }} />
            <div className="skeleton" style={{ height: '18px', width: '90%', marginBottom: '10px' }} />
            <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '24px' }} />
            <div className="skeleton" style={{ height: '28px', width: '30%', marginBottom: '16px' }} />
            <div className="skeleton" style={{ height: '18px', width: '85%', marginBottom: '10px' }} />
            <div className="skeleton" style={{ height: '18px', width: '60%' }} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '40px',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'color var(--transition-fast)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
  },
  badge_PENDING: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--warning)',
  },
  badge_PROCESSING: {
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    color: 'var(--accent-primary)',
    animation: 'pulse 1.5s infinite ease-in-out',
  },
  badge_DONE: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: 'var(--success)',
  },
  badge_FAILED: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--error)',
  },
  metaBox: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    marginBottom: '28px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '12px',
    fontFamily: 'var(--font-secondary)',
  },
  metaGrid: {
    display: 'flex',
    gap: '32px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    flexWrap: 'wrap',
  },
  metaLabel: {
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  metaValue: {
    fontWeight: '600',
    color: 'var(--text-primary)',
    textTransform: 'capitalize',
  },
  viewerPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  processingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: 'rgba(192, 132, 252, 0.05)',
    border: '1px solid rgba(192, 132, 252, 0.1)',
    borderRadius: 'var(--radius-md)',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(192, 132, 252, 0.1)',
    borderRadius: '50%',
    borderTopColor: 'var(--accent-primary)',
    animation: 'spin 1s ease-in-out infinite',
    flexShrink: 0,
  },
  processingText: {
    textAlign: 'left',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  errorBox: {
    padding: '40px 24px',
    textAlign: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
    border: '1px solid rgba(239, 68, 68, 0.12)',
    borderRadius: 'var(--radius-lg)',
  },
  errorIcon: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '12px',
  },
  errorTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--error)',
    marginBottom: '4px',
  },
  errorDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    maxWidth: '440px',
    margin: '0 auto',
  },
  contentCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  toolbarTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  toolbarActions: {
    display: 'flex',
    gap: '12px',
  },
  toolBtn: {
    padding: '6px 12px',
    fontSize: '12px',
  },
  markdownBody: {
    padding: '32px 40px',
    fontSize: '15px',
    lineHeight: '1.75',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-primary)',
  },
  cursorBlink: {
    display: 'inline-block',
    marginLeft: '6px',
    color: 'var(--accent-primary)',
    animation: 'pulse 0.8s infinite ease-in-out',
    paddingBottom: '32px',
    paddingLeft: '40px',
  },
  skeletons: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
  },
};

export default SummaryDetail;
