// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { summaryAPI } from '../api/api.js';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import Modal from '../components/UI/Modal.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, fetchMe } = useAuth();
  const { addToast } = useToast();

  const [summaries, setSummaries] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Upload Wizard states
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); // 1: Select File, 2: Configure Options
  const [pdfFile, setPdfFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Configurations
  const [examTime, setExamTime] = useState('next-week');
  const [summaryType, setSummaryType] = useState('comprehensive');
  const [focusTopic, setFocusTopic] = useState('');
  const [uploading, setUploading] = useState(false);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSummaries = async () => {
    try {
      const data = await summaryAPI.list();
      setSummaries(data);
    } catch (err) {
      addToast('Could not load study guides.', 'error');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  // Drag-and-drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        addToast('Only PDF files are supported.', 'error');
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        addToast('File exceeds maximum 12MB limit.', 'error');
        return;
      }
      setPdfFile(file);
      setWizardStep(2);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        addToast('Only PDF files are supported.', 'error');
        return;
      }
      setPdfFile(file);
      setWizardStep(2);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile || !examTime || !summaryType) return;

    // Daily limit guard
    if (user && user.dailyRequestCount >= user.dailyLimit) {
      addToast('Daily limit reached. Resets at midnight.', 'warning');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('examTime', examTime);
    formData.append('summaryType', summaryType);
    if (focusTopic.trim()) {
      formData.append('focusTopic', focusTopic.trim());
    }

    try {
      const result = await summaryAPI.summarize(formData);
      addToast('PDF accepted. Starting AI processing...', 'success');
      
      // Update user counts
      await fetchMe();
      
      // Close wizard and redirect to the Live Streaming Detail Page
      setShowWizard(false);
      navigate(`/summary/${result.summaryId}`);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to upload PDF.';
      addToast(errMsg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const triggerDelete = (summary) => {
    setSelectedSummary(summary);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSummary) return;
    setDeleting(true);
    try {
      await summaryAPI.delete(selectedSummary.id);
      addToast('Study guide deleted.', 'success');
      setSummaries(prev => prev.filter(s => s.id !== selectedSummary.id));
      setShowDeleteModal(false);
    } catch (err) {
      addToast('Failed to delete study guide.', 'error');
    } finally {
      setDeleting(false);
      setSelectedSummary(null);
    }
  };

  const formatSummaryType = (type) => {
    switch (type) {
      case 'concise': return 'Concise Guide';
      case 'comprehensive': return 'Comprehensive Summary';
      case 'cheat-sheet': return 'Exam Cheat Sheet';
      case 'qa': return 'Q&A Format';
      default: return type;
    }
  };

  const formatExamTime = (time) => {
    switch (time) {
      case 'tomorrow': return 'Tomorrow';
      case 'next-week': return 'Next Week';
      case 'next-month': return 'Next Month';
      case 'reference': return 'General Reference';
      default: return time;
    }
  };

  return (
    <div>
      {/* Statistics Dashboard grid */}
      <section style={styles.statsGrid}>
        <div style={styles.statCard} className="interactive-hover">
          <div style={styles.statIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Total Study Guides</span>
            <span style={styles.statVal}>{summaries.length}</span>
          </div>
        </div>

        <div style={styles.statCard} className="interactive-hover">
          <div style={styles.statIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Usage Limit Used</span>
            <span style={styles.statVal}>
              {user ? user.dailyRequestCount : 0} <span style={styles.statValMuted}>/ {user ? user.dailyLimit : 10}</span>
            </span>
          </div>
        </div>

        <div style={styles.statCard} className="interactive-hover">
          <div style={styles.statIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success)' }}>
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Mock Exams Completed</span>
            <span style={styles.statVal}>4</span>
          </div>
        </div>

        <div style={styles.statCard} className="interactive-hover">
          <div style={styles.statIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--highlight)' }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
            </svg>
          </div>
          <div style={styles.statContent}>
            <span style={styles.statLabel}>Learning Certificates</span>
            <span style={styles.statVal}>2</span>
          </div>
        </div>
      </section>

      {/* Main Action Bar */}
      <div style={styles.actionBar}>
        <h3 style={styles.sectionTitle}>Active Study Guides</h3>
        <Button onClick={() => {
          setPdfFile(null);
          setWizardStep(1);
          setFocusTopic('');
          setShowWizard(true);
        }} className="button-shine">
          Create Study Guide
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </Button>
      </div>

      {/* Active Summaries Table */}
      <div style={styles.tableCard}>
        {loadingList ? (
          <div style={styles.loadingList}>
            <div className="skeleton" style={{ height: '44px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '44px', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '44px' }} />
          </div>
        ) : summaries.length === 0 ? (
          <div style={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <path d="M2 10h20"></path>
            </svg>
            <h4 style={styles.emptyTitle}>No study guides created yet</h4>
            <p style={styles.emptySubtitle}>Upload a study material PDF to generate study notes and prep materials.</p>
            <Button
              variant="outline"
              onClick={() => {
                setPdfFile(null);
                setWizardStep(1);
                setFocusTopic('');
                setShowWizard(true);
              }}
              style={{ marginTop: '16px' }}
            >
              Upload Your First Material
            </Button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Material Name</th>
                  <th style={styles.th}>Study Style</th>
                  <th style={styles.th}>Exam Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Created On</th>
                  <th style={styles.thAction}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((s) => (
                  <tr key={s.id} style={styles.tr} className="table-row-hover">
                    <td style={styles.tdFilename} onClick={() => navigate(`/summary/${s.id}`)}>
                      {s.fileName}
                    </td>
                    <td style={styles.td}>{formatSummaryType(s.summaryType)}</td>
                    <td style={styles.td}>{formatExamTime(s.examTime)}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        ...styles[`badge_${s.status}`],
                      }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(s.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td style={styles.tdActions}>
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/summary/${s.id}`)}
                        style={styles.actionBtn}
                      >
                        Read Guide
                      </Button>
                      <button
                        onClick={() => triggerDelete(s)}
                        style={styles.deleteBtn}
                        title="Delete Guide"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PDF UPLOAD WIZARD MODAL */}
      <Modal
        show={showWizard}
        onClose={() => !uploading && setShowWizard(false)}
        title={wizardStep === 1 ? "Step 1: Upload Study PDF" : "Step 2: Configure AI Study Guide"}
      >
        {wizardStep === 1 ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            style={{
              ...styles.dragArea,
              ...(dragActive ? styles.dragAreaActive : {}),
            }}
          >
            <div style={styles.dragContent}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p style={styles.dragText}>Drag and drop your syllabus or chapter PDF here</p>
              <span style={styles.dragMuted}>Supports PDFs up to 12MB</span>
              <div style={styles.uploadBtnWrapper}>
                <Button onClick={() => document.getElementById('pdfInput').click()}>
                  Browse File
                </Button>
                <input
                  id="pdfInput"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUploadSubmit} style={styles.wizardForm}>
            {pdfFile && (
              <div style={styles.selectedFileBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)', marginRight: '6px' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div style={styles.selectedFileText}>
                  <span style={styles.selectedFileName}>{pdfFile.name}</span>
                  <span style={styles.selectedFileSize}>
                    {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setPdfFile(null);
                    setWizardStep(1);
                  }}
                  style={styles.changeFileBtn}
                >
                  Change
                </button>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Target Exam Horizon</label>
              <select
                value={examTime}
                onChange={(e) => setExamTime(e.target.value)}
                disabled={uploading}
                style={styles.select}
              >
                <option value="tomorrow">Tomorrow (Ultra Concise Focus)</option>
                <option value="next-week">Next Week (Balanced Prep)</option>
                <option value="next-month">Next Month (Deep Concept Guides)</option>
                <option value="reference">General Reference (Textbook Notes)</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>AI Summary Target Style</label>
              <select
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                disabled={uploading}
                style={styles.select}
              >
                <option value="comprehensive">Comprehensive Lecture Summary</option>
                <option value="concise">Bullet Outline & Key Takeaways</option>
                <option value="cheat-sheet">Cheat Sheet (Formulae & Definitions)</option>
                <option value="qa">Practice Q&A & Interview Questions</option>
              </select>
            </div>

            <Input
              label="Focus Topic / Weak Area (Optional)"
              type="text"
              placeholder="e.g. Krebs cycle steps, Quick sort time complexity"
              value={focusTopic}
              onChange={(e) => setFocusTopic(e.target.value)}
              disabled={uploading}
            />

            <div style={styles.wizardActions}>
              <Button
                variant="secondary"
                disabled={uploading}
                onClick={() => setWizardStep(1)}
              >
                Back
              </Button>
              <Button type="submit" loading={uploading} className="button-shine">
                Generate Study Guide
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                  <polyline points="22 2 15 22 11 13 2 9 22 2"></polyline>
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                </svg>
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        show={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="Delete Study Guide"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Are you sure you want to permanently delete the study guide for{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {selectedSummary?.fileName}
          </strong>
          ? This action is irreversible.
        </p>
        <div style={styles.deleteModalActions}>
          <Button
            variant="secondary"
            disabled={deleting}
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleting}
            onClick={handleDeleteConfirm}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all var(--transition-fast)',
  },
  statIconWrapper: {
    fontSize: '28px',
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.02)',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statVal: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-secondary)',
    marginTop: '2px',
  },
  statValMuted: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  tableCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  loadingList: {
    padding: '24px',
  },
  emptyState: {
    padding: '60px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  emptySubtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    maxWidth: '360px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '14px',
  },
  th: {
    padding: '16px 24px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
  },
  thAction: {
    padding: '16px 24px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    textAlign: 'right',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color var(--transition-fast)',
  },
  tdFilename: {
    padding: '16px 24px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    cursor: 'pointer',
    maxWidth: '280px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'color var(--transition-fast)',
  },
  td: {
    padding: '16px 24px',
    color: 'var(--text-secondary)',
  },
  tdActions: {
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  actionBtn: {
    padding: '6px 12px',
    fontSize: '12px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    display: 'inline-flex',
    letterSpacing: '0.02em',
  },
  badge_PENDING: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--warning)',
  },
  badge_PROCESSING: {
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    color: 'var(--accent-primary)',
  },
  badge_DONE: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: 'var(--success)',
  },
  badge_FAILED: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--error)',
  },
  dragArea: {
    border: '2px dashed var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    padding: '40px 24px',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  dragAreaActive: {
    borderColor: 'var(--accent-primary)',
    backgroundColor: 'var(--accent-glow)',
  },
  dragContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: '36px',
    marginBottom: '16px',
  },
  dragText: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '4px',
    textAlign: 'center',
  },
  dragMuted: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  uploadBtnWrapper: {
    position: 'relative',
  },
  wizardForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  selectedFileBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
  },
  fileIcon: {
    fontSize: '20px',
  },
  selectedFileText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'left',
    overflow: 'hidden',
  },
  selectedFileName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  selectedFileSize: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  changeFileBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--error)',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  select: {
    padding: '12px 14px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
  },
  wizardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
  },
  deleteModalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
};

export default Dashboard;
