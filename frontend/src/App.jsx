import React, { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Flower2,
  GraduationCap,
  Layers3,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Trophy,
  X
} from 'lucide-react'
import { api } from './api'

const emptyForm = { title: '', topic: '', notes: '' }

function App() {
  const [decks, setDecks] = useState([])
  const [view, setView] = useState('dashboard')
  const [activeDeck, setActiveDeck] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const loadDecks = async () => {
    try {
      setLoading(true)
      setError('')
      setDecks(await api.getDecks())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadDecks() }, [])

  const openDeck = async (id) => {
    try {
      setBusy(true)
      const deck = await api.getDeck(id)
      setActiveDeck(deck)
      setView('deck')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const generate = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.notes.trim()) return
    try {
      setBusy(true)
      setError('')
      const deck = await api.generateDeck(form)
      setForm(emptyForm)
      setActiveDeck(deck)
      await loadDecks()
      setView('deck')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this study deck?')) return
    try {
      await api.deleteDeck(id)
      if (activeDeck?.id === id) {
        setActiveDeck(null)
        setView('dashboard')
      }
      await loadDecks()
    } catch (e) {
      setError(e.message)
    }
  }

  const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0)

  return (
    <div className="app-shell">
      <Header onHome={() => setView('dashboard')} />
      <main className="container">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError('')}><X size={17}/></button>
          </div>
        )}

        {view === 'dashboard' && (
          <Dashboard
            decks={decks}
            totalCards={totalCards}
            loading={loading}
            onCreate={() => setView('create')}
            onOpen={openDeck}
            onDelete={remove}
          />
        )}

        {view === 'create' && (
          <CreateDeck
            form={form}
            setForm={setForm}
            busy={busy}
            onSubmit={generate}
            onCancel={() => setView('dashboard')}
          />
        )}

        {view === 'deck' && activeDeck && (
          <DeckView
            deck={activeDeck}
            onBack={() => setView('dashboard')}
            onQuiz={() => setView('quiz')}
          />
        )}

        {view === 'quiz' && activeDeck && (
          <QuizView
            deck={activeDeck}
            onBack={() => setView('deck')}
            onComplete={async () => {
              await loadDecks()
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

function Header({ onHome }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome}>
        <span className="brand-icon"><Flower2 size={22}/></span>
        <span>Bloom<span>Study</span></span>
      </button>
      <div className="header-pill"><Sparkles size={15}/> Learn beautifully</div>
    </header>
  )
}

function Dashboard({ decks, totalCards, loading, onCreate, onOpen, onDelete }) {
  return (
    <section className="page-enter">
      <div className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> Smart study, made simple</div>
          <h1>Turn your notes into <em>active recall.</em></h1>
          <p>Paste your notes, let BloomStudy organize the key ideas, then flip, test, and track your progress.</p>
          <button className="primary-btn" onClick={onCreate}><Plus size={19}/> Create study deck</button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="petal p1"></div><div className="petal p2"></div>
          <div className="petal p3"></div><div className="petal p4"></div>
          <div className="flower-core">✦</div>
        </div>
      </div>

      <div className="stats-grid">
        <Stat icon={<Layers3/>} label="Study decks" value={decks.length}/>
        <Stat icon={<BookOpen/>} label="Flashcards" value={totalCards}/>
        <Stat icon={<Trophy/>} label="Quizzes ready" value={decks.filter(d => d.cards?.length >= 2).length}/>
      </div>

      <div className="section-head">
        <div>
          <h2>Your study garden</h2>
          <p>Pick a deck and start remembering.</p>
        </div>
        <button className="ghost-btn" onClick={onCreate}><Plus size={17}/> New deck</button>
      </div>

      {loading ? (
        <div className="loading-card"><Loader2 className="spin"/> Loading your decks…</div>
      ) : decks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Flower2/></div>
          <h3>Your first deck is waiting</h3>
          <p>Paste a topic summary and create your first set of flashcards.</p>
          <button className="primary-btn" onClick={onCreate}><Sparkles size={18}/> Generate cards</button>
        </div>
      ) : (
        <div className="deck-grid">
          {decks.map(deck => (
            <article className="deck-card" key={deck.id}>
              <div className="deck-flower"><Flower2 size={20}/></div>
              <div className="deck-card-content">
                <span className="topic-chip">{deck.topic || 'Study deck'}</span>
                <h3>{deck.title}</h3>
                <p>{deck.cards?.length || 0} flashcards · ready to review</p>
                <div className="card-actions">
                  <button className="primary-small" onClick={() => onOpen(deck.id)}>Open deck <ChevronRight size={16}/></button>
                  <button className="icon-btn danger" title="Delete" onClick={() => onDelete(deck.id)}><Trash2 size={17}/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function Stat({ icon, label, value }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><strong>{value}</strong><span>{label}</span></div></div>
}

function CreateDeck({ form, setForm, busy, onSubmit, onCancel }) {
  return (
    <section className="form-page page-enter">
      <button className="back-link" onClick={onCancel}><ChevronLeft size={18}/> Dashboard</button>
      <div className="form-heading">
        <div className="eyebrow"><Sparkles size={15}/> Smart generator</div>
        <h1>Grow a new study deck</h1>
        <p>Give the generator a topic and your notes. It will create review-ready cards automatically.</p>
      </div>

      <form className="study-form" onSubmit={onSubmit}>
        <label>
          Deck title
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Java Spring Boot" required />
        </label>
        <label>
          Topic
          <input value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} placeholder="e.g. Backend development" />
        </label>
        <label>
          Notes / topic summary
          <textarea rows="12" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Paste your notes here. Separate important ideas with sentences or new lines…" required />
        </label>

        <div className="generator-note">
          <Sparkles size={18}/>
          <div><strong>How it works</strong><span>The built-in smart generator identifies sentences and turns them into concise recall questions. No API key required.</span></div>
        </div>

        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>Cancel</button>
          <button className="primary-btn" disabled={busy}>{busy ? <><Loader2 className="spin"/> Creating…</> : <><Sparkles size={18}/> Generate deck</>}</button>
        </div>
      </form>
    </section>
  )
}

function DeckView({ deck, onBack, onQuiz }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const cards = deck.cards || []
  const card = cards[index]

  useEffect(() => { setFlipped(false) }, [index])

  if (!card) return <div className="empty-state"><h3>No cards in this deck.</h3></div>

  return (
    <section className="deck-page page-enter">
      <button className="back-link" onClick={onBack}><ChevronLeft size={18}/> Dashboard</button>
      <div className="deck-header">
        <div>
          <span className="topic-chip">{deck.topic || 'Study deck'}</span>
          <h1>{deck.title}</h1>
          <p>{cards.length} flashcards · tap the card to reveal</p>
        </div>
        <button className="primary-btn" onClick={onQuiz}><Brain size={18}/> Take quiz</button>
      </div>

      <div className="progress-line"><span style={{width: `${((index + 1) / cards.length) * 100}%`}}/></div>
      <div className="card-count">{index + 1} / {cards.length}</div>

      <button className={`flashcard ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flash-face flash-front">
            <span className="face-label">QUESTION</span>
            <CircleHelp size={38}/>
            <h2>{card.question}</h2>
            <small>Tap to reveal answer</small>
          </div>
          <div className="flash-face flash-back">
            <span className="face-label">ANSWER</span>
            <Check size={38}/>
            <h2>{card.answer}</h2>
            <small>Tap to return</small>
          </div>
        </div>
      </button>

      <div className="flash-controls">
        <button className="round-btn" disabled={index === 0} onClick={() => setIndex(i => i - 1)}><ChevronLeft/></button>
        <button className="ghost-btn" onClick={() => setFlipped(!flipped)}>{flipped ? 'Show question' : 'Show answer'}</button>
        <button className="round-btn" disabled={index === cards.length - 1} onClick={() => setIndex(i => i + 1)}><ChevronRight/></button>
      </div>
    </section>
  )
}

function QuizView({ deck, onBack, onComplete }) {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getQuiz(deck.id).then(setQuestions).catch(() => setQuestions([])).finally(() => setLoading(false))
  }, [deck.id])

  const question = questions[current]

  const choose = (answer) => {
    if (selected !== null) return
    setSelected(answer)
    if (answer === question.correctAnswer) setScore(s => s + 1)
  }

  const next = async () => {
    if (current < questions.length - 1) {
      setCurrent(i => i + 1)
      setSelected(null)
    } else {
      const finalScore = score
      await api.saveScore(deck.id, { score: finalScore, total: questions.length })
      await onComplete()
      setDone(true)
    }
  }

  if (loading) return <div className="loading-card"><Loader2 className="spin"/> Building your quiz…</div>
  if (!questions.length) return <div className="empty-state"><h3>Not enough cards for a quiz.</h3><button className="ghost-btn" onClick={onBack}>Back to deck</button></div>

  if (done) {
    const percent = Math.round((score / questions.length) * 100)
    return (
      <section className="result-card page-enter">
        <div className="result-flower"><Trophy size={42}/></div>
        <span className="eyebrow">Quiz complete</span>
        <h1>{percent}%</h1>
        <p>You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>.</p>
        <div className="result-actions"><button className="primary-btn" onClick={onBack}><BookOpen size={18}/> Review cards</button><button className="ghost-btn" onClick={() => window.location.reload()}>Try again</button></div>
      </section>
    )
  }

  return (
    <section className="quiz-page page-enter">
      <button className="back-link" onClick={onBack}><ChevronLeft size={18}/> Back to deck</button>
      <div className="quiz-top">
        <div><span className="topic-chip">Quiz mode</span><h1>{deck.title}</h1></div>
        <strong>{current + 1} / {questions.length}</strong>
      </div>
      <div className="progress-line"><span style={{width: `${((current + 1) / questions.length) * 100}%`}}/></div>

      <div className="quiz-box">
        <span className="face-label">QUESTION {current + 1}</span>
        <h2>{question.question}</h2>
        <div className="options">
          {question.options.map(option => {
            const chosen = selected === option
            const correct = selected !== null && option === question.correctAnswer
            return <button key={option} className={`option ${chosen ? 'chosen' : ''} ${correct ? 'correct' : ''}`} onClick={() => choose(option)}>
              <span>{option}</span>{correct && <Check size={18}/>}
            </button>
          })}
        </div>
        {selected !== null && <div className={`feedback ${selected === question.correctAnswer ? 'good' : 'bad'}`}>
          {selected === question.correctAnswer ? <><Check size={18}/> Nice! That's correct.</> : <><X size={18}/> Correct answer: {question.correctAnswer}</>}
        </div>}
        <button className="primary-btn next-btn" disabled={selected === null} onClick={next}>
          {current === questions.length - 1 ? 'Finish quiz' : 'Next question'} <ChevronRight size={18}/>
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return <footer>BloomStudy · Built with React, Spring Boot, Hibernate & PostgreSQL</footer>
}

export default App
