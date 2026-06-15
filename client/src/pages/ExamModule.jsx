// client/src/pages/ExamModule.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/UI/Button.jsx';

// Premium pre-made practice exams
const DUMMY_EXAMS = [
  {
    id: 'exam-1',
    title: 'Cellular Respiration & Krebs Cycle',
    subject: 'Biology',
    duration: 15, // 15 mins
    questionsCount: 5,
    questions: [
      {
        id: 'q1',
        text: 'Where does glycolysis take place in the cell?',
        options: ['Mitochondrial Matrix', 'Cytoplasm', 'Inner Mitochondrial Membrane', 'Nucleus'],
        correct: 1,
        explanation: 'Glycolysis is the anaerobic process that breaks down glucose in the cytoplasm of cells, producing pyruvate.',
      },
      {
        id: 'q2',
        text: 'What is the net ATP yield of glycolysis per molecule of glucose?',
        options: ['1 ATP', '2 ATP', '4 ATP', '32 ATP'],
        correct: 1,
        explanation: 'Although glycolysis produces 4 ATP, it requires an initial investment of 2 ATP, resulting in a net yield of 2 ATP.',
      },
      {
        id: 'q3',
        text: 'Which molecule acts as the final electron acceptor in the electron transport chain (ETC)?',
        options: ['NADH', 'FADH₂', 'Carbon Dioxide (CO₂)', 'Oxygen (O₂)'],
        correct: 3,
        explanation: 'Oxygen acts as the terminal electron acceptor in aerobic respiration, combining with hydrogen ions to form water.',
      },
      {
        id: 'q4',
        text: 'How many NADH molecules are produced during a single turn of the Krebs Cycle?',
        options: ['2 NADH', '3 NADH', '6 NADH', '10 NADH'],
        correct: 1,
        explanation: 'Each turn of the Krebs cycle produces 3 NADH, 1 FADH₂, and 1 GTP/ATP. (Since 1 glucose yields 2 pyruvates, the total is double, but a single turn yields 3).',
      },
      {
        id: 'q5',
        text: 'Which enzyme synthesizes ATP using the electrochemical proton gradient?',
        options: ['ATP Synthase', 'Hexokinase', 'Pyruvate Dehydrogenase', 'Cytochrome c Oxidase'],
        correct: 0,
        explanation: 'ATP Synthase acts as a molecular turbine, utilizing the flow of protons down their electrochemical gradient to phosphorylate ADP into ATP.',
      },
    ],
  },
  {
    id: 'exam-2',
    title: 'Data Structures - Trees & Graphs',
    subject: 'Computer Science',
    duration: 10,
    questionsCount: 5,
    questions: [
      {
        id: 'q1',
        text: 'What is the worst-case time complexity of searching in a Binary Search Tree (BST) of height h?',
        options: ['O(1)', 'O(log n)', 'O(h)', 'O(n log n)'],
        correct: 2,
        explanation: 'Searching in a BST travels from the root down to a leaf, which takes at most O(h) steps, where h is the tree height. In a skewed tree, h can be O(n).',
      },
      {
        id: 'q2',
        text: 'Which algorithm is commonly used to find the shortest path in a weighted graph without negative cycles?',
        options: ['Kruskal\'s Algorithm', 'Dijkstra\'s Algorithm', 'Prim\'s Algorithm', 'Depth First Search (DFS)'],
        correct: 1,
        explanation: 'Dijkstra\'s algorithm calculates the shortest path from a single source vertex to all other vertices in a weighted graph.',
      },
      {
        id: 'q3',
        text: 'What data structure is typically used to implement Breadth-First Search (BFS)?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Linked List'],
        correct: 1,
        explanation: 'BFS explores vertices level by level, requiring a First-In-First-Out (FIFO) structure, which is a Queue.',
      },
      {
        id: 'q4',
        text: 'Which tree traversal visits nodes in the order: Left, Right, Root?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correct: 2,
        explanation: 'Post-order traversal visits children first (Left, then Right) before visiting the parent (Root).',
      },
      {
        id: 'q5',
        text: 'A graph is tree if and only if it is:',
        options: ['Connected and undirected', 'Directed and acyclic', 'Connected and acyclic', 'Complete and bipartite'],
        correct: 2,
        explanation: 'A tree is defined as an undirected graph that is connected and contains no cycles (acyclic).',
      },
    ],
  },
];

const ExamModule = () => {
  const { addToast } = useToast();
  
  // Page mode: 'list' | 'detail' | 'active' | 'result'
  const [mode, setMode] = useState('list');
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Active exam states
  const [answers, setAnswers] = useState({}); // { questionIndex: optionIndex }
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timerActive, setTimerActive] = useState(false);
  
  // Review result states
  const [expandedExplanation, setExpandedExplanation] = useState({}); // { questionIdx: bool }
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Timer loop
  useEffect(() => {
    let timer = null;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      // Auto-submit when timer expires
      clearInterval(timer);
      setTimerActive(false);
      addToast('Time has expired! Submitting your exam...', 'warning');
      submitExam();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const startExam = (exam) => {
    setSelectedExam(exam);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setTimeLeft(exam.duration * 60);
    setMode('active');
    setTimerActive(true);
    addToast(`Exam "${exam.title}" started. Good luck!`, 'info');
  };

  const selectOption = (optIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < selectedExam.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const submitExam = () => {
    setTimerActive(false);
    
    // Evaluate answers
    let correct = 0;
    selectedExam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / selectedExam.questions.length) * 100);
    setCorrectCount(correct);
    setScore(calculatedScore);
    setMode('result');
    setExpandedExplanation({});
    
    // Display result toast
    if (calculatedScore >= 80) {
      addToast(`Excellent! You scored ${calculatedScore}%!`, 'success');
    } else if (calculatedScore >= 50) {
      addToast(`Passed! You scored ${calculatedScore}%.`, 'warning');
    } else {
      addToast(`You scored ${calculatedScore}%. Keep studying!`, 'error');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExplanation = (idx) => {
    setExpandedExplanation((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div style={styles.container}>
      {/* EXAMS LIST VIEW */}
      {mode === 'list' && (
        <div>
          <div style={styles.introBox}>
            <h3 style={styles.introTitle}>Practice Exam Center</h3>
            <p style={styles.introSubtitle}>Test your concept retention with custom, interactive timed quizzes.</p>
          </div>

          <div style={styles.grid}>
            {DUMMY_EXAMS.map((exam) => (
              <div key={exam.id} style={styles.card} className="interactive-hover">
                <div style={styles.cardHeader}>
                  <span style={styles.subjectTag}>{exam.subject}</span>
                  <span style={styles.timeTag}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {exam.duration} mins
                  </span>
                </div>
                <h4 style={styles.cardTitle}>{exam.title}</h4>
                <p style={styles.cardDesc}>
                  Covers fundamental syllabus definitions, formulae, and concept application.
                </p>
                <div style={styles.cardFooter}>
                  <span style={styles.qCount}>{exam.questionsCount} Multiple Choice Questions</span>
                  <Button onClick={() => {
                    setSelectedExam(exam);
                    setMode('detail');
                  }}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXAM DETAIL OVERVIEW */}
      {mode === 'detail' && selectedExam && (
        <div style={styles.detailCard} className="animate-fade-in">
          <div style={styles.detailHeader}>
            <span style={styles.subjectTag}>{selectedExam.subject}</span>
            <button onClick={() => setMode('list')} style={styles.backBtn}>
              &larr; Back to Exams
            </button>
          </div>
          <h2 style={styles.detailTitle}>{selectedExam.title}</h2>
          
          <div style={styles.bulletList}>
            <div style={styles.bulletItem}>
              <span style={styles.bulletIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </span>
              <div>
                <strong>Format:</strong> {selectedExam.questionsCount} Multiple Choice Questions
              </div>
            </div>
            <div style={styles.bulletItem}>
              <span style={styles.bulletIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-secondary)' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <div>
                <strong>Duration:</strong> {selectedExam.duration} Minutes (automatic submission enabled)
              </div>
            </div>
            <div style={styles.bulletItem}>
              <span style={styles.bulletIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--error)' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <div>
                <strong>Rules:</strong> Strict closed book test. Switching tabs or minimizing is discouraged.
              </div>
            </div>
          </div>

          <div style={styles.detailActions}>
            <Button variant="secondary" onClick={() => setMode('list')}>Cancel</Button>
            <Button onClick={() => startExam(selectedExam)} className="button-shine">
              Launch Exam Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                <polyline points="22 2 15 22 11 13 2 9 22 2"></polyline>
                <line x1="22" y1="2" x2="11" y2="13"></line>
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* ACTIVE EXAM SESSION */}
      {mode === 'active' && selectedExam && (
        <div style={styles.sessionGrid}>
          {/* Main Question Panel */}
          <div style={styles.questionPanel}>
            <div style={styles.panelHeader}>
              <span style={styles.qIndicator}>
                Question {currentQuestionIdx + 1} of {selectedExam.questions.length}
              </span>
              <div style={{
                ...styles.timerBox,
                color: timeLeft <= 60 ? 'var(--error)' : 'var(--text-primary)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {formatTime(timeLeft)}
              </div>
            </div>

            <h3 style={styles.questionText}>
              {selectedExam.questions[currentQuestionIdx].text}
            </h3>

            <div style={styles.optionsList}>
              {selectedExam.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                const isSelected = answers[currentQuestionIdx] === oIdx;
                return (
                  <div
                    key={oIdx}
                    onClick={() => selectOption(oIdx)}
                    style={{
                      ...styles.optionCard,
                      ...(isSelected ? styles.optionCardSelected : {}),
                    }}
                  >
                    <div style={{
                      ...styles.radio,
                      ...(isSelected ? styles.radioSelected : {}),
                    }} />
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            <div style={styles.panelFooter}>
              <Button
                variant="secondary"
                disabled={currentQuestionIdx === 0}
                onClick={handlePrev}
              >
                Previous
              </Button>
              {currentQuestionIdx < selectedExam.questions.length - 1 ? (
                <Button onClick={handleNext}>Next Question</Button>
              ) : (
                <Button variant="primary" onClick={submitExam}>
                  Submit Exam
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar Navigation Panel */}
          <div style={styles.navigationPanel}>
            <h4 style={styles.navTitle}>Question Grid</h4>
            <div style={styles.gridNav}>
              {selectedExam.questions.map((_, idx) => {
                const isCurrent = idx === currentQuestionIdx;
                const isAnswered = answers[idx] !== undefined;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    style={{
                      ...styles.navGridItem,
                      ...(isCurrent ? styles.navGridItemCurrent : {}),
                      ...(isAnswered && !isCurrent ? styles.navGridItemAnswered : {}),
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: 'var(--accent-primary)' }} />
                <span>Current</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, backgroundColor: '#2E303A' }} />
                <span>Answered</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{ ...styles.legendDot, border: '1px solid var(--border-color)' }} />
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXAM SCORE RESULTS */}
      {mode === 'result' && selectedExam && (
        <div style={styles.resultCard} className="animate-fade-in">
          <h2 style={styles.resultHeading}>Exam Completed!</h2>
          
          <div style={styles.scoreRow}>
            {/* Score Ring wrapper */}
            <div style={styles.scoreRing}>
              <span style={styles.scoreNumber}>{score}%</span>
              <span style={styles.scoreLabel}>Final Grade</span>
            </div>
            <div style={styles.statsCol}>
              <div style={styles.statLine}>
                <span style={styles.statName}>Correct Answers</span>
                <span style={styles.statNum}>{correctCount} / {selectedExam.questions.length}</span>
              </div>
              <div style={styles.statLine}>
                <span style={styles.statName}>Accuracy Rate</span>
                <span style={styles.statNum}>{score}%</span>
              </div>
              <div style={styles.statLine}>
                <span style={styles.statName}>Result Status</span>
                <span style={{
                  ...styles.statNum,
                  color: score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)',
                }}>
                  {score >= 80 ? 'Distinction' : score >= 50 ? 'Pass' : 'Failed'}
                </span>
              </div>
            </div>
          </div>

          <h3 style={styles.reviewTitle}>Question Review & Key Keys</h3>
          <div style={styles.reviewList}>
            {selectedExam.questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correct;
              const isExpanded = !!expandedExplanation[idx];

              return (
                <div key={q.id} style={styles.reviewItem}>
                  <div
                    onClick={() => toggleExplanation(idx)}
                    style={styles.reviewHeader}
                  >
                    <span style={{
                      ...styles.resultCheck,
                      color: isCorrect ? 'var(--success)' : 'var(--error)',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      {isCorrect ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      )}
                    </span>
                    <span style={styles.reviewText}>{q.text}</span>
                    <span style={styles.arrowIcon}>{isExpanded ? '▲' : '▼'}</span>
                  </div>

                  {isExpanded && (
                    <div style={styles.reviewBody}>
                      <div style={styles.choicesGrid}>
                        {q.options.map((opt, oIdx) => {
                          const wasSelected = userAnswer === oIdx;
                          const isOptCorrect = q.correct === oIdx;
                          return (
                            <div
                              key={oIdx}
                              style={{
                                ...styles.reviewOption,
                                ...(wasSelected ? styles.reviewOptSelected : {}),
                                ...(isOptCorrect ? styles.reviewOptCorrect : {}),
                              }}
                            >
                              <span>{opt}</span>
                              {isOptCorrect && <span style={styles.badgeCorrect}>Correct Key</span>}
                              {wasSelected && !isOptCorrect && (
                                <span style={styles.badgeIncorrect}>Your Choice</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div style={styles.explanationBox}>
                        <strong>AI Explanation:</strong>
                        <p style={{ marginTop: '4px', fontSize: '13px' }}>{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={styles.resultActions}>
            <Button variant="secondary" onClick={() => setMode('list')}>Back to Quizzes</Button>
            <Button onClick={() => startExam(selectedExam)} className="button-shine">
              Retry Exam
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '40px',
  },
  introBox: {
    textAlign: 'left',
    marginBottom: '32px',
  },
  introTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  introSubtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all var(--transition-fast)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  subjectTag: {
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'var(--accent-glow)',
    color: 'var(--accent-primary)',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  timeTag: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    lineHeight: '1.3',
  },
  cardDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    flex: 1,
    marginBottom: '20px',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  qCount: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  detailCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    maxWidth: '640px',
    margin: '0 auto',
    textAlign: 'left',
    boxShadow: 'var(--shadow-md)',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '24px',
  },
  bulletList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '32px',
  },
  bulletItem: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  bulletIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  detailActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '24px',
  },
  sessionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 280px',
    gap: '24px',
    alignItems: 'start',
  },
  questionPanel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    textAlign: 'left',
    boxShadow: 'var(--shadow-sm)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
  },
  qIndicator: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  timerBox: {
    fontFamily: 'var(--font-secondary)',
    fontSize: '16px',
    fontWeight: '700',
  },
  questionText: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '24px',
    lineHeight: '1.45',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all var(--transition-fast)',
  },
  optionCardSelected: {
    borderColor: 'var(--accent-primary)',
    backgroundColor: 'var(--accent-glow)',
  },
  radio: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid var(--text-muted)',
    flexShrink: 0,
    transition: 'all var(--transition-fast)',
  },
  radioSelected: {
    borderColor: 'var(--accent-primary)',
    backgroundColor: 'var(--accent-primary)',
    boxShadow: '0 0 8px var(--accent-primary)',
  },
  panelFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '24px',
  },
  navigationPanel: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    textAlign: 'left',
  },
  navTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '16px',
  },
  gridNav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
    marginBottom: '24px',
  },
  navGridItem: {
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    transition: 'all var(--transition-fast)',
  },
  navGridItemCurrent: {
    borderColor: 'var(--accent-primary)',
    color: 'var(--accent-primary)',
    boxShadow: 'var(--shadow-glow)',
  },
  navGridItemAnswered: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '3px',
    flexShrink: 0,
  },
  resultCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    maxWidth: '720px',
    margin: '0 auto',
    textAlign: 'left',
    boxShadow: 'var(--shadow-md)',
  },
  resultHeading: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '32px',
    textAlign: 'center',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '48px',
    marginBottom: '40px',
    paddingBottom: '32px',
    borderBottom: '1px solid var(--border-color)',
    flexWrap: 'wrap',
  },
  scoreRing: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: '10px solid var(--accent-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-glow)',
  },
  scoreNumber: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-secondary)',
  },
  scoreLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  statsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '220px',
  },
  statLine: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: '6px',
  },
  statName: {
    color: 'var(--text-secondary)',
  },
  statNum: {
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  reviewTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '16px',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  reviewItem: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-secondary)',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  resultCheck: {
    fontSize: '18px',
    fontWeight: '800',
    marginRight: '12px',
  },
  reviewText: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    flex: 1,
    textAlign: 'left',
  },
  arrowIcon: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginLeft: '12px',
  },
  reviewBody: {
    padding: '0 20px 20px 20px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  choicesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  reviewOption: {
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewOptSelected: {
    borderColor: 'var(--error)',
  },
  reviewOptCorrect: {
    borderColor: 'var(--success)',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    color: 'var(--success)',
  },
  badgeCorrect: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: 'var(--success-bg)',
    color: 'var(--success)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  badgeIncorrect: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  explanationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: '14px',
    borderRadius: '8px',
    borderLeft: '3px solid var(--accent-primary)',
    textAlign: 'left',
  },
  resultActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '24px',
  },
};

export default ExamModule;
