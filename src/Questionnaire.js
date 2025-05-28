import React, { useState } from 'react';

const questions = [
  {
    question: "What's the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "What is 5 + 7?",
    options: ["10", "11", "12", "13"],
    answer: "12",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Which language is primarily used for Android app development?",
    options: ["Swift", "Kotlin", "JavaScript", "Ruby"],
    answer: "Kotlin",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "HighText Transfer Protocol",
      "HyperText Transmission Protocol",
      "HyperTransfer Text Protocol"
    ],
    answer: "HyperText Transfer Protocol",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Which company developed the React library?",
    options: ["Google", "Facebook", "Microsoft", "Apple"],
    answer: "Facebook",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "What is the boiling point of water at sea level?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    answer: "100°C",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Which language is primarily spoken in Brazil?",
    options: ["Spanish", "Portuguese", "French", "English"],
    answer: "Portuguese",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileo Galilei"],
    answer: "Albert Einstein",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Which animal is known as the King of the Jungle?",
    options: ["Tiger", "Lion", "Elephant", "Gorilla"],
    answer: "Lion",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Which continent is the Sahara Desert located in?",
    options: ["Asia", "Africa", "Australia", "South America"],
    answer: "Africa",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Processing Unit", "Control Performance Unit", "Central Programming Utility"],
    answer: "Central Processing Unit",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "Which instrument has keys, pedals, and strings?",
    options: ["Violin", "Flute", "Piano", "Guitar"],
    answer: "Piano",
    hint: "The hint has been sent. Please check the mail you have provided."
  },
  {
    question: "In which year did the Titanic sink?",
    options: ["1912", "1905", "1898", "1923"],
    answer: "1912",
    hint: "The hint has been sent. Please check the mail you have provided."
  }
];

export default function Questionnaire() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [gmailInput, setGmailInput] = useState('');
  const [gmailSubmitted, setGmailSubmitted] = useState(false);
  const [hintUsed, setHintUsed] = useState(Array(questions.length).fill(false));
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [feedbacks, setFeedbacks] = useState(Array(questions.length).fill(''));
  const [gmailRequestedQuestions, setGmailRequestedQuestions] = useState(Array(questions.length).fill(false));

  // Example state structures for answers and hints:
  // const [correctAnswers, setCorrectAnswers] = useState(Array(questions.length).fill(0));
  const [hintsUsed, setHintsUsed] = useState(Array(questions.length).fill(0));

  const question = questions[current];
  //const questionCount = question.length;

  const handleAnswer = (option) => {
    setSelected(option);
    const isCorrect = option === question.answer;
    const newFeedback = isCorrect ? 'Correct! 🎉' : 'Wrong 😞';

    setFeedback(newFeedback);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[current] = option;
      return copy;
    });
    setFeedbacks((prev) => {
      const copy = [...prev];
      copy[current] = newFeedback;
      return copy;
    });
  };
  //function handleSubmit(event) {
  //event.preventDefault();
  //}
  const calculateStats = () => {
    const total = questions.length;
    let correct = 0;
    let incorrect = 0;
    let hintsUsed = 0;

    answers.forEach((ans, i) => {
      if (ans === questions[i].answer) correct++;
      else if (ans !== null) incorrect++;
      if (hintUsed[i]) hintsUsed++;
    });

    return {
      correctPercent: (correct / total) * 100,
      incorrectPercent: (incorrect / total) * 100,
      hintPercent: (hintsUsed / total) * 100,
      correct,
      incorrect,
      hintsUsed,
      total,
    };
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      const next = current + 1;
      setCurrent(next);
      setSelected(answers[next]);
      setFeedback(feedbacks[next]);
      setShowHint(false);
    } else {
      // Last question reached → show score screen
      setIsFinished(true);
      const correct_answers = answers.map((ans, index) => ans === questions[index].answer ? 1 : 0);
      const hints_used = hintUsed.map((used, index) => used ? 1 : 0);
      const payload = {
      user_info: {
        username:username,
        email:gmailInput,
      },
      quiz_data: {
        correct_answers: correct_answers,
        hints_used: hints_used,
      },
    };

    // Send the data to backend
    fetch('http://localhost:5000/submit-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  .then(async res => {
    const text = await res.text(); // always read as text first
    try {
      const data = JSON.parse(text); // try to parse as JSON
      console.log('Submission successful:', data);
    } catch (err) {
      console.error('Invalid JSON response:', text);
    }
  })
  .catch(err => {
    console.error('Submission failed:', err);
  });
  }
  };
  const html = document.documentElement;
  html.style.background = 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 50%, #8e2de2 100%)';
  html.style.height = '100%';
  html.style.margin = '0';
  html.style.padding = '0';
  const prevQuestion = () => {
    const prev = (current - 1 + questions.length) % questions.length;
    setCurrent(prev);
    setSelected(answers[prev]);
    setFeedback(feedbacks[prev]);
    setShowHint(false);
    setGmailInput('');
  };

  const requestHint = () => {
    if (current < 3 || hintUsed[current]) return;
    if (gmailSubmitted) {
      setShowHint(true);
      setHintUsed((prev) => {
        const copy = [...prev];
        copy[current] = true;
        return copy;
      });
      setHintsUsed(prev => {
      const copy = [...prev];
      copy[current] = true;
      return copy;
      });
    } else {
      setGmailRequestedQuestions((prev) => {
        const copy = [...prev];
        copy[current] = true;
        return copy;
      });
    }
  };
  const saycheese = () => {
  console.log("fetchin up");
  fetch('http://localhost:4000/capture-and-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      questionIndex: current,
      email: gmailInput
    }),
  }).catch(err => console.error('Error sending capture and email request:', err));
  };


  const submitGmail = (e) => {
    e.preventDefault();
    if (gmailInput.trim()) {
      setGmailSubmitted(true);
      setShowHint(true);
      setHintUsed((prev) => {
        const copy = [...prev];
        copy[current] = true;
        return copy;
      });
      setGmailRequestedQuestions(Array(questions.length).fill(false));
    }
  };

  const isHintDisabled = () => current < 3 || hintUsed[current];

  const getBoxColor = (idx) => {
    if (idx === current) return '#d1d5db';
    const answer = answers[idx];
    const hint = hintUsed[idx];

    if (answer === null) return hint ? '#22d3ee' : '#9ca3af';
    const isCorrect = answer === questions[idx].answer;
    if (hint) return isCorrect ? '#7dd3fc' : '#0c4a6e';
    return isCorrect ? '#22c55e' : '#ef4444';
  };

  /* // New function to restart the quiz - line 128
  const restartQuiz = () => {
    setIsFinished(false);
    setCurrent(0);
    setSelected(null);
    setFeedback('');
    setShowHint(false);
    setGmailInput('');
    setGmailSubmitted(false);
    setHintUsed(Array(questions.length).fill(false));
    setAnswers(Array(questions.length).fill(null));
    setFeedbacks(Array(questions.length).fill(''));
    setGmailRequestedQuestions(Array(questions.length).fill(false));
  };
*/

  if (isFinished) {
  const stats = calculateStats();
  return (
    <div
      style={{
        maxWidth: 600,
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
        padding: '30px 40px',
        userSelect: 'none',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        color: '#f0f4ff',
        textAlign: 'center',
        animation: 'fadeInScale 0.7s ease forwards',
      }}
    >
      <h2
        style={{
          marginBottom: 25,
          fontWeight: '800',
          fontSize: '2.2rem',
          letterSpacing: '1.2px',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        Quiz Finished!
      </h2>

      {['correct', 'incorrect', 'hintsUsed'].map((key, i) => {
        const label = key === 'correct' ? 'Correct answers' : key === 'incorrect' ? 'Incorrect answers' : 'Hints used';
        const value = stats[key];
        const percentKey = key === 'hintsUsed' ? 'hintPercent' : `${key}Percent`;
        const percent = stats[percentKey].toFixed(1);
        const barColor =
          key === 'correct' ? '#22c55e' : key === 'incorrect' ? '#ef4444' : '#2563eb';

        return (
          <div key={key} style={{ marginBottom: i === 2 ? 35 : 20 }}>
            <p
              style={{
                fontWeight: '700',
                fontSize: '1.3rem',
                marginBottom: 8,
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }}
            >
              {label}: {value} ({percent}%)
            </p>
            <progress
              max="100"
              value={percent}
              style={{
                width: '100%',
                height: 22,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.2)',
                backgroundColor: 'rgba(255,255,255,0.15)',
                appearance: 'none',
                transition: 'all 0.6s ease',
              }}
            />
            <style>
              {`
                progress[value]::-webkit-progress-bar {
                  background-color: rgba(255,255,255,0.15);
                  border-radius: 12px;
                }
                progress[value]::-webkit-progress-value {
                  background: linear-gradient(90deg, ${barColor} 0%, #a3f7bf 100%);
                  border-radius: 12px;
                  transition: width 0.6s ease;
                }
                progress[value]::-moz-progress-bar {
                  background: linear-gradient(90deg, ${barColor} 0%, #a3f7bf 100%);
                  border-radius: 12px;
                  transition: width 0.6s ease;
                }

                @keyframes fadeInScale {
                  0% {
                    opacity: 0;
                    transform: scale(0.9);
                  }
                  100% {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}
            </style>
          </div>
        );
      })}
    </div>
  );
}
  if (!loggedIn) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: 'whitesmoke',
            padding: '40px 50px',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            width: '320px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              marginBottom: '30px',
              color: '#4c51bf',
              fontWeight: '700',
              fontSize: '1.8rem',
              letterSpacing: '1px',
            }}
          >
            Welcome to the Quiz!
          </h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '300px',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1.8px solid #cbd5e1',
              fontSize: '1rem',
              outlineColor: '#667eea',
              marginBottom: '25px',
              transition: 'border-color 0.3s ease',
	      textAlign: 'center',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#4c51bf')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />

          <button
            onClick={() => {
              if (username.trim()) {
                setLoggedIn(true);
              } else {
                alert('Please enter your name to continue.');
              }
            }}
            style={{
              width: '300px',
              padding: '14px 0',
              backgroundColor: '#4c51bf',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(76, 81, 191, 0.4)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#3737a0')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#4c51bf')}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }  // Original rendering below, unchanged:
  return (
  <div
    style={{
      margin: '6vh auto auto',
      maxWidth: 600,
      fontFamily: 'Arial, sans-serif',
      padding: '30px 40px',
      userSelect: 'none',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      color: '#f0f4ff',
      animation: 'fadeInScale 0.7s ease forwards',
    }}
  >
    <h2
      style={{
        color: '#dbeafe',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '800',
        fontSize: '2rem',
        letterSpacing: '1.2px',
        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      Question {current + 1} / {questions.length}
    </h2>

    <p
      style={{
        fontWeight: '700',
        fontSize: '1.4rem',
        marginBottom: 30,
        textAlign: 'center',
        textShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}
    >
      {question.question}
    </p>

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        alignItems: 'center',
        marginBottom: '30px',
      }}
    >
      {question.options.map((option) => {
        const isSelected = selected === option;
        const isCorrect = option === question.answer;

        let bgColor = 'rgba(255, 255, 255, 0.15)';
        let color = '#dbeafe';
        let boxShadow = 'none';
        let scale = 1;

        if (selected) {
          if (isSelected) {
            bgColor = isCorrect ? '#22c55e' : '#ef4444';
            color = 'white';
            boxShadow = isCorrect
              ? '0 0 10px 2px #22c55e'
              : '0 0 10px 2px #ef4444';
            scale = 1.05;
          } else {
            bgColor = 'rgba(255,255,255,0.1)';
            color = '#a5b4fc';
          }
        }

        return (
          <button
            key={option}
            onClick={() => !selected && handleAnswer(option)}
            disabled={!!selected}
            style={{
              width: '30vw',
              maxWidth: '320px',
              padding: '16px',
              fontWeight: '700',
              cursor: selected ? 'default' : 'pointer',
              backgroundColor: bgColor,
              color,
              borderRadius: '12px',
              border: 'none',
              userSelect: 'none',
              boxShadow,
              transform: `scale(${scale})`,
              transition:
                'background-color 0.3s ease, color 0.3s ease, box-shadow 0.4s ease, transform 0.3s ease',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>

    <p
      style={{
        color: feedback === 'Correct! 🎉' ? '#22c55e' : '#ef4444',
        fontWeight: '700',
        fontSize: '1.2rem',
        textAlign: 'center',
        marginBottom: 30,
        minHeight: 26,
        textShadow: '0 0 6px rgba(0,0,0,0.4)',
        transition: 'color 0.3s ease',
      }}
    >
      {feedback}
    </p>

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 15,
      }}
    >
      <button
        onClick={prevQuestion}
        style={{
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '12px 26px',
          borderRadius: '12px',
          border: 'none',
          fontWeight: '700',
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: '0 5px 15px rgba(79, 70, 229, 0.4)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#4338ca')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#4f46e5')}
      >
        Previous
      </button>

      <button
        onClick={nextQuestion}
        disabled={!selected}
        style={{
          backgroundColor: selected ? '#4f46e5' : '#a5b4fc',
          color: 'white',
          padding: '12px 26px',
          borderRadius: '12px',
          border: 'none',
          fontWeight: '700',
          cursor: selected ? 'pointer' : 'default',
          userSelect: 'none',
          boxShadow: selected
            ? '0 5px 15px rgba(79, 70, 229, 0.6)'
            : 'none',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          if (selected) e.target.style.backgroundColor = '#4338ca';
        }}
        onMouseLeave={(e) => {
          if (selected) e.target.style.backgroundColor = '#4f46e5';
        }}
      >
        Next
      </button>
    </div>

    <div style={{ textAlign: 'center', marginBottom: 25 }}>
      <button
        onClick={requestHint}
        disabled={isHintDisabled()}
        style={{
          backgroundColor: isHintDisabled() ? '#a5b4fc' : '#4f46e5',
          color: 'white',
          padding: '10px 22px',
          borderRadius: '12px',
          border: 'none',
          fontWeight: '700',
          cursor: isHintDisabled() ? 'default' : 'pointer',
          userSelect: 'none',
          boxShadow: isHintDisabled()
            ? 'none'
            : '0 5px 15px rgba(79, 70, 229, 0.5)',
          transition: 'background-color 0.3s ease',
          marginBottom: 15,
        }}
        title={current < 3 ? 'Hints unavailable for the first 3 questions' : ''}
        onMouseEnter={(e) => {
          if (!isHintDisabled()) e.target.style.backgroundColor = '#4338ca';
        }}
        onMouseLeave={(e) => {
          if (!isHintDisabled()) e.target.style.backgroundColor = '#4f46e5';
        }}
      >
        Get Hint
      </button>

      {gmailRequestedQuestions[current] && !gmailSubmitted && (
        <form onSubmit={submitGmail} style={{ marginTop: 10 }}>
          <input
            type="email"
            placeholder="Enter your Gmail to get hint"
            value={gmailInput}
            onChange={(e) => setGmailInput(e.target.value)}
            required
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              marginRight: '12px',
              width: '220px',
              fontSize: '1rem',
              transition: 'border-color 0.3s ease',
              outlineColor: '#4f46e5',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#4338ca')}
            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
          />
          <button
            type="submit"
            onClick={saycheese}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(79, 70, 229, 0.5)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#4338ca')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#4f46e5')}
          >
            Submit
          </button>
        </form>
      )}

      {showHint && (
        <p
          style={{
            marginTop: 15,
            fontStyle: 'italic',
            color: '#a5b4fc',
            textShadow: '0 0 6px rgba(255,255,255,0.7)',
            transition: 'opacity 0.6s ease',
          }}
        >
          {question.hint}
        </p>
      )}
    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 40,
        userSelect: 'none',
      }}
    >
      {questions.map((_, idx) => (
        <button
          key={idx}
          onClick={() => {}}
          style={{
            backgroundColor: getBoxColor(idx),
            color: 'white',
            padding: '10px',
            borderRadius: '50%',
            border: 'none',
            width: 40,
            height: 40,
            cursor: 'pointer',
            fontWeight: '700',
            userSelect: 'none',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.15)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {idx + 1}
        </button>
      ))}
    </div>

    <style>{`
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}</style>
  </div>
);
}