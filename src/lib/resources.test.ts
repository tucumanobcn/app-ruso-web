import { describe, expect, it } from 'vitest'
import { SKILLS } from '../content/glossary'
import { getLesson, LESSONS } from '../content/lessons'
import { CHANNELS, VIDEOS, videosForLesson, videosForSkills } from '../content/resources'
import { vocabForLesson } from '../content/vocab'
import { VOCAB } from '../content/vocab/vocab.generated'
import { createEmptyProgress, parseProgress } from './storage'

const available = LESSONS.filter((lesson) => lesson.status === 'disponible')

describe('vocabulario verificado', () => {
  it('cada lección disponible presenta al menos 5 palabras', () => {
    for (const lesson of available) {
      expect(vocabForLesson(lesson.id).length, lesson.id).toBeGreaterThanOrEqual(5)
    }
  })

  it('todas las palabras pertenecen a una lección existente y tienen traducción', () => {
    for (const entry of VOCAB) {
      expect(getLesson(entry.lessonId), entry.id).toBeDefined()
      expect(entry.es.trim().length, entry.id).toBeGreaterThan(0)
    }
  })

  it('las palabras de más de una sílaba llevan el acento marcado', () => {
    for (const entry of VOCAB) {
      const vowels = entry.lemma.match(/[аеёиоуыэюя]/g)?.length ?? 0
      if (vowels > 1 && !entry.lemma.includes('ё')) {
        expect(entry.accented, entry.id).toContain('́')
      }
    }
  })

  it('los ejemplos de Tatoeba contienen ruso y español', () => {
    for (const entry of VOCAB.filter((e) => e.example)) {
      expect(entry.example!.ru).toMatch(/[а-яё]/i)
      expect(entry.example!.es).toMatch(/[a-záéíóúñ]/i)
    }
  })
})

describe('vídeos verificados', () => {
  it('tienen ids únicos con formato de YouTube', () => {
    const ids = VIDEOS.map((video) => video.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[\w-]{11}$/)
  })

  it('apuntan a canales, conocimientos y lecciones que existen', () => {
    for (const video of VIDEOS) {
      expect(CHANNELS[video.channel], video.id).toBeDefined()
      for (const skill of video.skills) expect(skill in SKILLS, `${video.id} ${skill}`).toBe(true)
      for (const lesson of video.lessons) expect(getLesson(lesson), `${video.id} ${lesson}`).toBeDefined()
      expect(video.duration, video.id).toMatch(/^\d{1,2}:\d{2}(:\d{2})?$/)
    }
  })

  it('cada lección disponible recomienda al menos dos vídeos', () => {
    for (const lesson of available) {
      expect(videosForLesson(lesson.id).length, lesson.id).toBeGreaterThanOrEqual(2)
    }
  })

  it('recomienda vídeos específicos para un error concreto', () => {
    const videos = videosForSkills(['instr.regimen'], 3)
    expect(videos[0].id).toBe('8-8PmPgDJZQ')
  })
})

describe('recursos consultados en el progreso guardado', () => {
  it('empieza vacío si los datos no lo traen (copias antiguas)', () => {
    const { viewedResources: _omit, ...old } = createEmptyProgress()
    void _omit
    expect(parseProgress(old)!.viewedResources).toEqual({})
  })

  it('conserva los vídeos vistos', () => {
    const data = { ...createEmptyProgress(), viewedResources: { abc: '2026-11-23T10:00:00.000Z' } }
    expect(parseProgress(JSON.parse(JSON.stringify(data)))!.viewedResources).toEqual(
      data.viewedResources,
    )
  })
})
