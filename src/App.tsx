import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SkillId } from './content/glossary'
import { ALL_QUESTIONS, getLesson, LESSONS, QUESTION_BY_ID, questionsForSkill } from './content/lessons'
import { practiceLessonId, sessionLessonId, type SessionKind } from './content/lessons/practice'
import { VARIANTS } from './content/variants'
import { createWriter, type OpenedProgress } from './lib/persistence'
import { ContentReportsContext, withoutReported, type ContentReports } from './lib/contentReports'
import { ResourceViewsContext, type ResourceViews } from './lib/resourceViews'
import type { Lesson } from './content/types'
import {
  diagnosticSessionId,
  probeQuestion,
  summarizeDiagnostic,
} from './engine/diagnostic'
import { computeMastery } from './engine/mastery'
import {
  buildDailyPlan,
  errorSessionIds,
  mixedSessionIds,
  nextItineraryLesson,
  vocabularySessionIds,
} from './engine/planner'
import { competencyProfile } from './engine/profile'
import { buildQuestionIndex } from './engine/questionIndex'
import { computeSchedule, dueSkills } from './engine/scheduler'
import { pickQuestions } from './engine/selection'
import { grade, type AnswerValue } from './lib/answers'
import { completeSession, initialOrder, isSessionCompatible, startSession } from './lib/session'
import {
  createEmptyProgress,
  type ActiveSession,
  type AnswerRecord,
  type ProgressData,
  type ThemePreference,
} from './lib/storage'
import { Catalog } from './screens/Catalog'
import { DataSettings } from './screens/DataSettings'
import { Diagnostic } from './screens/Diagnostic'
import { Home } from './screens/Home'
import { LessonPlayer } from './screens/LessonPlayer'
import { Progress } from './screens/Progress'
import { Credits } from './screens/Credits'
import { Resources } from './screens/Resources'
import { Results } from './screens/Results'

type Screen =
  | { name: 'home' }
  | { name: 'catalog' }
  | { name: 'data' }
  | { name: 'progress' }
  | { name: 'resources' }
  | { name: 'credits' }
  | { name: 'diagnostic'; blockId?: string }
  | { name: 'lesson' }
  | { name: 'results'; sessionId: string }

/** Descarta una sesión en curso que ya no encaje con el contenido actual. */
function sanitize(data: ProgressData): ProgressData {
  const active = data.activeSession
  if (active) {
    const lesson = getLesson(active.lessonId)
    if (!lesson || lesson.status !== 'disponible' || !isSessionCompatible(lesson, active)) {
      return { ...data, activeSession: null }
    }
  }
  return data
}

/** Índice de preguntas → conocimientos y formato; el contenido no cambia en ejecución. */
const QUESTION_INDEX = buildQuestionIndex(LESSONS, VARIANTS)

const PRACTICE_SIZE = 6

/**
 * Calendario de repasos. Primero se mira qué está dominado (sin tener en cuenta el
 * calendario), porque solo eso puede tener intervalos largos.
 */
function scheduleFor(log: AnswerRecord[], now: number) {
  const base = computeMastery(log, QUESTION_INDEX, now)
  const mastered = new Set(
    (Object.keys(base) as SkillId[]).filter((skill) => base[skill].state === 'dominado'),
  )
  return computeSchedule(log, QUESTION_INDEX, now, mastered)
}

const THEME_CYCLE: ThemePreference[] = ['system', 'light', 'dark']
const THEME_LABEL: Record<ThemePreference, string> = {
  system: 'Automático',
  light: 'Claro',
  dark: 'Oscuro',
}
const THEME_ICON: Record<ThemePreference, string> = { system: '◐', light: '☀', dark: '☾' }

export default function App({ opened }: { opened: OpenedProgress }) {
  const [data, setData] = useState<ProgressData>(() => sanitize(opened.data))
  // Momento de referencia para repasos y dominio; se actualiza con cada cambio de progreso.
  const [now, setNow] = useState(() => Date.now())
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  // En memoria no se conserva nada al cerrar: se avisa desde el principio.
  const [saveFailed, setSaveFailed] = useState(opened.store.kind === 'memoria')
  const [writer] = useState(() =>
    createWriter(opened.store, (ok) => setSaveFailed(!ok || opened.store.kind === 'memoria')),
  )

  /** Aplica un cambio al progreso y lo guarda (IndexedDB) en el mismo paso. */
  function update(change: (prev: ProgressData) => ProgressData) {
    const next = change(data)
    if (next === data) return
    setData(next)
    writer.save(next)
    setNow(Date.now())
  }

  // Ejercicios marcados como dudosos: no se proponen y sus respuestas no cuentan para el dominio.
  const reported = useMemo(() => new Set(Object.keys(data.contentReports)), [data.contentReports])
  const masteryLog = useMemo(
    () => withoutReported(data.answerLog, data.contentReports),
    [data.answerLog, data.contentReports],
  )

  // El dominio se recalcula a partir de todo el historial cada vez que cambia.
  const schedule = useMemo(() => scheduleFor(masteryLog, now), [masteryLog, now])
  const mastery = useMemo(
    () => computeMastery(masteryLog, QUESTION_INDEX, now, schedule),
    [masteryLog, now, schedule],
  )
  const due = useMemo(() => dueSkills(schedule, now), [schedule, now])
  const diagnostic = useMemo(
    () => summarizeDiagnostic(data.diagnostic, data.answerLog, QUESTION_BY_ID),
    [data.diagnostic, data.answerLog],
  )
  const profile = useMemo(() => competencyProfile(mastery, diagnostic.probes), [mastery, diagnostic])
  const plan = useMemo(
    () => buildDailyPlan({ data, mastery, due, diagnostic, now }),
    [data, mastery, due, diagnostic, now],
  )
  const nextLesson = useMemo(() => nextItineraryLesson(data, mastery, diagnostic), [data, mastery, diagnostic])
  const sessionIds = useMemo(
    () => ({
      errores: errorSessionIds(masteryLog, now, reported),
      mixta: mixedSessionIds(mastery, data.answerLog, reported),
      vocabulario: vocabularySessionIds(data.answerLog, reported),
    }),
    [data.answerLog, masteryLog, mastery, now, reported],
  )

  const theme = data.preferences.theme
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') delete root.dataset.theme
    else root.dataset.theme = theme
  }, [theme])

  const step = data.activeSession?.step
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen, step])

  function go(next: Screen) {
    setScreen(next)
  }

  function beginLesson(lesson: Lesson) {
    update((prev) => ({ ...prev, activeSession: startSession(lesson) }))
    go({ name: 'lesson' })
  }

  function openLesson(lessonId: string) {
    const lesson = getLesson(lessonId)
    if (!lesson || lesson.status !== 'disponible') return
    const active = data.activeSession
    if (active?.lessonId === lessonId) {
      go({ name: 'lesson' })
      return
    }
    if (active) {
      const other = getLesson(active.lessonId)
      const ok = window.confirm(
        `Tienes a medias «${other?.title ?? 'otra lección'}». Si empiezas esta, se descartará ese avance (las respuestas ya dadas quedan en tu historial). ¿Continuar?`,
      )
      if (!ok) return
    }
    beginLesson(lesson)
  }

  /** Práctica dirigida: prioriza ejercicios y variantes que aún no has visto. */
  function practice(skill: SkillId) {
    const chosen = pickQuestions(questionsForSkill(skill, reported), data.answerLog, PRACTICE_SIZE)
    openLesson(practiceLessonId(skill, chosen.map((q) => q.id)))
  }

  /** Repaso y refuerzo del plan del día, en una sola sesión. */
  function startPlan() {
    if (plan.practiceIds.length > 0) openLesson(sessionLessonId('plan', new Date(now), plan.practiceIds))
  }

  function startManualSession(kind: Exclude<SessionKind, 'plan'>) {
    const ids = sessionIds[kind]
    if (ids.length > 0) openLesson(sessionLessonId(kind, new Date(now), ids))
  }

  // ---------- Diagnóstico ----------

  /** Plantea la siguiente pregunta del bloque, o lo da por terminado. */
  function advanceDiagnostic(prev: ProgressData, blockId: string): ProgressData {
    const state = prev.diagnostic.blocks[blockId]
    if (!state) return prev
    const summary = summarizeDiagnostic(prev.diagnostic, prev.answerLog, QUESTION_BY_ID).byBlock[blockId]
    const question = summary.next ? probeQuestion(
          summary.next,
          ALL_QUESTIONS.filter((q) => !(q.id in prev.contentReports)),
          prev.answerLog,
          state.asked,
        ) : null
    const nextState = question
      ? {
          ...state,
          asked: [...state.asked, question.id],
          optionOrder: { ...state.optionOrder, [question.id]: initialOrder(question) },
        }
      : { ...state, finishedAt: new Date().toISOString() }
    return { ...prev, diagnostic: { blocks: { ...prev.diagnostic.blocks, [blockId]: nextState } } }
  }

  function openDiagnostic(blockId?: string, restart = false) {
    if (blockId && (restart || !data.diagnostic.blocks[blockId])) {
      if (restart && !window.confirm('Se empezará el bloque de nuevo. Tus respuestas anteriores quedan en el historial. ¿Continuar?')) {
        return
      }
      update((prev) =>
        advanceDiagnostic(
          {
            ...prev,
            diagnostic: {
              blocks: {
                ...prev.diagnostic.blocks,
                [blockId]: { startedAt: new Date().toISOString(), asked: [], optionOrder: {}, answers: {} },
              },
            },
          },
          blockId,
        ),
      )
    }
    go({ name: 'diagnostic', blockId })
  }

  function answerDiagnostic(blockId: string, questionId: string, value: AnswerValue) {
    update((prev) => {
      const state = prev.diagnostic.blocks[blockId]
      const question = QUESTION_BY_ID.get(questionId)
      if (!state || !question || state.answers[questionId] !== undefined) return prev
      const { correct, errorType } = grade(question, value)
      const record: AnswerRecord = {
        sessionId: diagnosticSessionId(blockId, state.startedAt),
        lessonId: 'diagnostico',
        questionId,
        answer: value,
        correct,
        skill: question.skill,
        errorType,
        answeredAt: new Date().toISOString(),
      }
      return {
        ...prev,
        diagnostic: {
          blocks: { ...prev.diagnostic.blocks, [blockId]: { ...state, answers: { ...state.answers, [questionId]: value } } },
        },
        answerLog: [...prev.answerLog, record],
      }
    })
  }

  function answer(questionId: string, value: AnswerValue) {
    update((prev) => {
      const session = prev.activeSession
      if (!session || session.answers[questionId] !== undefined) return prev
      const lesson = getLesson(session.lessonId)
      const question = lesson?.questions.find((q) => q.id === questionId)
      if (!lesson || !question) return prev

      const { correct, errorType } = grade(question, value)
      const record: AnswerRecord = {
        sessionId: session.id,
        lessonId: lesson.id,
        questionId,
        answer: value,
        correct,
        skill: question.skill,
        errorType,
        answeredAt: new Date().toISOString(),
      }
      return {
        ...prev,
        activeSession: { ...session, answers: { ...session.answers, [questionId]: value } },
        answerLog: [...prev.answerLog, record],
      }
    })
  }

  function setStep(nextStep: ActiveSession['step']) {
    update((prev) =>
      prev.activeSession ? { ...prev, activeSession: { ...prev.activeSession, step: nextStep } } : prev,
    )
  }

  function finish() {
    const session = data.activeSession
    const lesson = session ? getLesson(session.lessonId) : undefined
    if (!session || !lesson) return
    const completed = completeSession(lesson, session)
    update((prev) => ({
      ...prev,
      activeSession: null,
      completedSessions: [...prev.completedSessions, completed],
    }))
    go({ name: 'results', sessionId: completed.id })
  }

  const resourceViews: ResourceViews = {
    viewed: data.viewedResources,
    markViewed: (id) =>
      update((prev) => ({
        ...prev,
        viewedResources: { ...prev.viewedResources, [id]: new Date().toISOString() },
      })),
  }

  const contentReports: ContentReports = {
    reports: data.contentReports,
    report: (questionId, reason) =>
      update((prev) => ({
        ...prev,
        contentReports: { ...prev.contentReports, [questionId]: { reason, reportedAt: new Date().toISOString() } },
      })),
    undo: (questionId) =>
      update((prev) => {
        const { [questionId]: _removed, ...rest } = prev.contentReports
        return { ...prev, contentReports: rest }
      }),
  }

  function cycleTheme() {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length]
    update((prev) => ({ ...prev, preferences: { ...prev.preferences, theme: next } }))
  }

  function replaceData(next: ProgressData) {
    update(() => sanitize(next))
  }

  function resetData() {
    update(() => ({ ...createEmptyProgress(), preferences: data.preferences }))
  }

  let content: ReactNode
  if (screen.name === 'lesson' && data.activeSession) {
    const lesson = getLesson(data.activeSession.lessonId)
    content = lesson ? (
      <LessonPlayer
        lesson={lesson}
        session={data.activeSession}
        mastery={mastery}
        onAnswer={answer}
        onStep={setStep}
        onFinish={finish}
        onExit={() => go({ name: 'home' })}
      />
    ) : null
  } else if (screen.name === 'results') {
    const session = data.completedSessions.find((s) => s.id === screen.sessionId)
    const lesson = session ? getLesson(session.lessonId) : undefined
    content =
      session && lesson ? (
        <Results
          lesson={lesson}
          session={session}
          masteryBefore={(() => {
            const before = data.answerLog.filter((record) => record.sessionId !== session.id)
            return computeMastery(before, QUESTION_INDEX, now, scheduleFor(before, now))
          })()}
          masteryAfter={mastery}
          schedule={schedule}
          onRepeat={() => beginLesson(lesson)}
          onCatalog={() => go({ name: 'catalog' })}
        />
      ) : null
  } else if (screen.name === 'catalog') {
    content = <Catalog data={data} mastery={mastery} onOpenLesson={openLesson} />
  } else if (screen.name === 'progress') {
    content = (
      <Progress
        data={data}
        mastery={mastery}
        schedule={schedule}
        now={now}
        profile={profile}
        onPractice={practice}
        onOpenData={() => go({ name: 'data' })}
        onOpenDiagnostic={() => openDiagnostic()}
        onSetWeeklyGoal={(target) =>
          update((prev) => ({ ...prev, preferences: { ...prev.preferences, weeklyGoal: target } }))
        }
      />
    )
  } else if (screen.name === 'resources') {
    content = <Resources mastery={mastery} onOpenCredits={() => go({ name: 'credits' })} />
  } else if (screen.name === 'credits') {
    content = <Credits />
  } else if (screen.name === 'data') {
    content = (
      <DataSettings
        onOpenCredits={() => go({ name: 'credits' })}
        data={data}
        storeKind={opened.store.kind}
        now={now}
        onImport={replaceData}
        onReset={resetData}
        onExported={() => update((prev) => ({ ...prev, lastExportAt: new Date().toISOString() }))}
      />
    )
  } else if (screen.name === 'diagnostic') {
    content = (
      <Diagnostic
        state={data.diagnostic}
        summary={diagnostic}
        profile={profile}
        blockId={screen.blockId}
        onOpenBlock={(blockId, restart) => openDiagnostic(blockId, restart)}
        onAnswer={answerDiagnostic}
        onNext={(blockId) => update((prev) => advanceDiagnostic(prev, blockId))}
        onClose={() => go(screen.blockId ? { name: 'diagnostic' } : { name: 'home' })}
      />
    )
  }
  content ??= (
    <Home
      data={data}
      mastery={mastery}
      schedule={schedule}
      now={now}
      plan={plan}
      nextLessonId={nextLesson?.lesson.id}
      sessionSizes={{
        errores: sessionIds.errores.length,
        mixta: sessionIds.mixta.length,
        vocabulario: sessionIds.vocabulario.length,
      }}
      onStartPlan={startPlan}
      onStartSession={startManualSession}
      onOpenDiagnostic={(blockId) => openDiagnostic(blockId)}
      onOpenCatalog={() => go({ name: 'catalog' })}
      onOpenProgress={() => go({ name: 'progress' })}
      onOpenLesson={openLesson}
      onPractice={practice}
    />
  )

  const navItems: { screen: 'home' | 'catalog' | 'progress' | 'resources'; label: string; icon: ReactNode }[] = [
    { screen: 'home', label: 'Inicio', icon: <IconHome /> },
    { screen: 'catalog', label: 'Lecciones', icon: <IconBook /> },
    { screen: 'progress', label: 'Progreso', icon: <IconChart /> },
    { screen: 'resources', label: 'Recursos', icon: <IconPlay /> },
  ]
  // Durante una lección se oculta la barra de pestañas: modo concentración.
  const showTabs = screen.name !== 'lesson' && !(screen.name === 'diagnostic' && screen.blockId)

  return (
    <ResourceViewsContext value={resourceViews}>
      <ContentReportsContext value={contentReports}>
        <div className={`app${showTabs ? ' app--tabs' : ''}`}>
          <header className="topbar">
            <button className="brand" onClick={() => go({ name: 'home' })} aria-label="Шаг, ir al inicio">
              <span className="brand__logo" aria-hidden="true">
                Ш
              </span>
              <span className="brand__mark" lang="ru">
                Шаг
              </span>
              <span className="brand__sub">ruso paso a paso</span>
            </button>
            <button
              className="theme-toggle"
              onClick={cycleTheme}
              aria-label={`Tema: ${THEME_LABEL[theme]}. Cambiar tema`}
              title={`Tema: ${THEME_LABEL[theme]}`}
            >
              <span aria-hidden="true">{THEME_ICON[theme]}</span>
            </button>
          </header>

          {saveFailed && (
            <div className="banner" role="alert">
              No se puede guardar el progreso en este navegador (¿modo privado o almacenamiento
              lleno?). Puedes seguir estudiando, pero se perderá al cerrar la página. Exporta tus datos
              desde «Progreso → Mis datos» para no perderlos.
            </div>
          )}

          <main className="main">{content}</main>

          {showTabs && (
            <nav className="tabbar" aria-label="Principal">
              {navItems.map((item) => (
                <button
                  key={item.screen}
                  className="tabbar__item"
                  aria-current={screen.name === item.screen ? 'page' : undefined}
                  onClick={() => go({ name: item.screen })}
                >
                  <span className="tabbar__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </ContentReportsContext>
    </ResourceViewsContext>
  )
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19V5M8 7h7M8 11h5" />
    </svg>
  )
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="m10 9 5 3-5 3z" />
    </svg>
  )
}
