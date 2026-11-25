import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as moduleApi from 'node:module'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = path.join(root, 'app', 'courses-data.ts')
const outPath = path.join(root, 'public', 'catalog.json')

let mod
try {
  mod = await import(pathToFileURL(srcPath).href)
} catch {
  const js = moduleApi.stripTypeScriptTypes(fs.readFileSync(srcPath, 'utf8'))
  mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
}

const {
  SCHOOLS,
  UNIVERSITY_COURSES,
  CERTIFICATION_TRACKS,
  ADVENTURE_PATHS,
  AI_FACULTY_BOTS,
  DISCIPLINE_CHIPS,
  PRICING_TIERS,
} = mod

const schoolsCount = SCHOOLS.filter((s) => s.id !== 'foundation').length

const catalog = {
  schemaVersion: '1.0',
  source: 'https://hanzo.university',
  workspaceBaseUrl: 'https://hanzo.app/learn',
  counts: {
    courses: UNIVERSITY_COURSES.length,
    schools: schoolsCount,
    schoolGroups: SCHOOLS.length,
    tracks: CERTIFICATION_TRACKS.length,
    adventurePaths: ADVENTURE_PATHS.length,
    facultyBots: Object.keys(AI_FACULTY_BOTS).length,
  },
  disciplineChips: DISCIPLINE_CHIPS,
  schools: SCHOOLS,
  courses: UNIVERSITY_COURSES,
  tracks: CERTIFICATION_TRACKS,
  adventurePaths: ADVENTURE_PATHS,
  facultyBots: Object.values(AI_FACULTY_BOTS),
  pricingTiers: PRICING_TIERS,
}

fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8')
console.log(
  `Exported ${catalog.counts.courses} courses, ${catalog.counts.schools} schools (+foundation), ${catalog.counts.tracks} tracks, ${catalog.counts.adventurePaths} adventure paths -> public/catalog.json`,
)
