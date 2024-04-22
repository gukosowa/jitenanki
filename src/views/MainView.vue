<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">BunpoNavi - Your grammar guide</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="flex flex-col gap-6">
      <template v-for="grammarPoint in grammarPoints" :key="grammarPoint.id">
        <section class="flex flex-col p-4 rounded-lg shadow bg-white">
          <h2 class="text-xl font-semibold mb-2">
            {{ grammarPoint.content }} ({{ grammarPoint.romaji }})
          </h2>
          <div class="flex justify-between">
            <p class="text-sm text-gray-700">
              <strong>Part of Speech:</strong> {{ grammarPoint.part_of_speech }}
            </p>
            <div class="text-sm text-gray-700">
              <strong>Counterparts:</strong>
              <p v-for="(counterpart, idx) in grammarPoint.counterparts" :key="idx">
                {{ counterpart.language_code.toUpperCase() }}: {{ counterpart.content }}<br />
              </p>
            </div>
          </div>
          <div>
            <strong>Related Expressions:</strong>
            <template
              v-for="(expression, index) in grammarPoint.relatedExpressions"
              :key="index"
              class="ml-4"
            >
              {{ expression.content }}
            </template>
          </div>
          <div>
            <strong>Key Sentences:</strong>
            <template
              v-for="(sentence, index) in grammarPoint.keySentences"
              :key="index"
              class="ml-4"
            >
              <p
                :ref="
                  (el) => {
                    textContainer[sentence.id] = el as HTMLElement
                  }
                "
                :id="'test-' + sentence.id"
                class="relative"
              ></p>
              <template v-if="sentence.translations" class="ml-4">
                <span v-for="(translation, idx) in sentence.translations" :key="idx">
                  {{ translation.language_code.toUpperCase() }}: {{ translation.content }}<br />
                </span>
              </template>
            </template>
          </div>
          <div>
            <strong>Formations:</strong>
            <p v-for="(formation, fIndex) in grammarPoint.formations" :key="fIndex" class="ml-4">
              {{ formation.content }}
              <div v-for="(example, eIndex) in formation.examples" :key="eIndex">
                {{ example.content }}
                <div
                  v-for="(translation, tIndex) in example.translations"
                  :key="tIndex"
                  class="ml-4"
                >
                  {{ translation.language_code.toUpperCase() }}: {{ translation.content }}<br />
                </div>
              </div>
            </p>
          </div>
          <div>
            <strong>Examples:</strong>
            <p v-for="(example, index) in grammarPoint.examples" :key="index" class="ml-4">
              {{ example.content }}
              <div v-if="example.translations" class="ml-4">
                <span v-for="(translation, idx) in example.translations" :key="idx">
                  {{ translation.language_code.toUpperCase() }}: {{ translation.content }}<br />
                </span>
              </div>
            </p>
          </div>
          <div v-if="grammarPoint.notes">
            <strong>Notes:</strong>
            <div class="ml-4">
              <template v-for="(note, index) in grammarPoint.notes" :key="index">
                {{ note.language_code.toUpperCase() }}:
                <div class="whitespace-pre-wrap">
                  <VueMarkdown :source="note.content" />
                </div>
              </template>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render'
import { ref, onMounted, toRaw, nextTick } from 'vue'
import { exec } from '~src/utils/sqllite.ts'

interface Translation {
  language_code: string
  content: string
}

interface ContentWithTranslation {
  content: string
  translations?: Translation[]
}

interface Formation {
  content: string
  examples?: ContentWithTranslation[]
}

interface SentencePart {
  content: string
  part_type: string
  label: string
  regex: string
  group: number
  dotted: number
  bold: boolean
}

interface KeySentenceWithParts {
  id: number
  content: string
  translations: Translation[]
  parts: SentencePart[]
  ref?: any
}

interface GrammarPoint {
  id: number
  content: string
  romaji: string
  part_of_speech: string
  examples: ContentWithTranslation[]
  keySentences: KeySentenceWithParts[]
  relatedExpressions: ContentWithTranslation[]
  counterparts: Translation[]
  formations: Formation[]
  notes?: Translation[]
}

const grammarPoints = ref<GrammarPoint[]>([])
const loading = ref(true)

async function fetchGrammarPoints() {
  const data = await exec(`
    SELECT
      gp.id,
      gp.content,
      gp.romaji,
      gp.part_of_speech,
      (
        SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
        FROM Translations tr
        WHERE tr.reference_id = gp.id AND tr.table_type = 'GrammarPoints'
      ) AS translations,
      (
        SELECT json_group_array(json_object('content', rgp.content, 'translations',
          (
            SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
            FROM Translations tr
            WHERE tr.reference_id = rgp.id AND tr.table_type = 'GrammarPoints'
          )
        ))
        FROM RelatedExpressions re
        JOIN GrammarPoints rgp ON re.related_grammar_point_id = rgp.id
        WHERE re.grammar_point_id = gp.id
      ) AS relatedExpressions,
      (
        SELECT json_group_array(json_object(
          'content', f.content,
          'examples', (
            SELECT json_group_array(json_object('content', fe.content, 'translations',
              (
                SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
                FROM Translations tr WHERE tr.reference_id = fe.id AND tr.table_type = 'FormationExamples'
              )
            ))
            FROM FormationExamples fe WHERE fe.formation_id = f.id
          )
        ))
        FROM Formations f
        WHERE f.grammar_point_id = gp.id
      ) AS formations,
      (
        SELECT json_group_array(json_object(
          'id', ks.id,
          'content', ks.content,
          'translations', (
            SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
            FROM Translations tr WHERE tr.reference_id = ks.id AND tr.table_type = 'KeySentences'
          ),
          'parts', (
            SELECT json_group_array(json_object(
              'regex', sp.regex, 'label', sp.label, 'part_type', sp.part_type,
              'group_id', sp."group", 'dotted', sp.dotted, 'bold', sp.bold
            ))
            FROM SentenceParts sp WHERE sp.sentence_id = ks.id
          )
        ))
        FROM KeySentences ks
        WHERE ks.grammar_point_id = gp.id
      ) AS keySentences,
      (
        SELECT json_group_array(json_object('content', ex.content, 'translations',
          (
            SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
            FROM Translations tr WHERE tr.reference_id = ex.id AND tr.table_type = 'Examples'
          )
        ))
        FROM Examples ex
        WHERE ex.grammar_point_id = gp.id
      ) AS examples,
       (
          SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
          FROM Translations tr WHERE tr.reference_id = gp.id AND tr.table_type = 'Notes'
      ) AS notes,
      (
        SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
        FROM Translations tr
        WHERE tr.reference_id = gp.id AND tr.table_type = 'Counterparts'
      ) AS counterparts
    FROM GrammarPoints gp
    GROUP BY gp.id
  `)
  return data.map((item: any) => ({
    id: item.id,
    content: item.content,
    romaji: item.romaji,
    part_of_speech: item.part_of_speech,
    translations: JSON.parse(item.translations || '[]'),
    relatedExpressions: JSON.parse(item.relatedExpressions || '[]'),
    formations: JSON.parse(item.formations || '[]'),
    keySentences: JSON.parse(item.keySentences || '[]'),
    examples: JSON.parse(item.examples || '[]'),
    notes: JSON.parse(item.notes || '[]'),
    counterparts: JSON.parse(item.counterparts || '[]'),
  }))
}

onMounted(async () => {
  grammarPoints.value = await fetchGrammarPoints()
  console.log(toRaw(grammarPoints.value))

  loading.value = false

  await processKeySentences() // Process all keySentences after grammar points are fetched
})

async function processKeySentences() {
  await nextTick()
  grammarPoints.value.map((gp) => {
    gp.keySentences.forEach((ks) => {
      const ref = textContainer.value[ks.id]
      processText(ref, ks.content, ks.parts as any)
    })
  })
}

interface Match {
  text: string
  index: number
  length: number
  depth: number
  color: string
  bold?: boolean
  dotted?: number
  containsCount?: number
}

const colors = ['blue', 'green', 'orange', 'purple', 'brown']

interface Part {
  regex: RegExp
  label: string
  group?: number
  dotted?: number
  bold?: boolean
}

const textContainer = ref<Record<number, HTMLElement>>({})

function processText(container: HTMLElement, text: string, parts: Part[]) {
  let matches: Match[] = []
  let splitIndexes = new Set<number>()

  // Find regex matches and identify unique indices
  parts.forEach((part, colorIndex) => {
    const regexMatches = [...text.matchAll(part.regex)]
    regexMatches.forEach((match) => {
      const matchText = part.group ? match[part.group] : match[0]
      const matchStart = part.group ? match.index + match[0].indexOf(matchText) : match.index // Adjust start index for specific group
      matches.push({
        text: part.label,
        index: matchStart,
        length: matchText.length,
        depth: 0,
        color: colors[colorIndex % colors.length],
        bold: part.bold,
        dotted: part.dotted,
      })
      splitIndexes.add(matchStart)
      splitIndexes.add(matchStart + matchText.length)
    })
  })

  // Initialize matches with a default depth of 0
  matches.forEach((match) => {
    match.depth = 0
    match.containsCount = 0 // Keep track of how many matches each match contains
  })

  // Calculate the containsCount for each match
  matches.forEach((current, currentIndex, array) => {
    array.forEach((other, otherIndex) => {
      if (currentIndex !== otherIndex) {
        // If 'current' contains 'other', increase the containsCount
        if (
          current.index <= other.index &&
          current.index + current.length >= other.index + other.length
        ) {
          current.containsCount! += 1
        }
      }
    })
  })

  // Assign depths based on the containsCount
  matches.forEach((match) => {
    // The more matches a match contains, the higher its depth should be
    match.depth = match.containsCount!
  })

  // Normalize the depth values
  let uniqueDepths = [...new Set(matches.map((match) => match.depth))] // Get unique depth values
  uniqueDepths.sort((a, b) => a - b) // Sort the unique depth values

  // Create a depth mapping from old depth to new normalized depth
  let depthMapping: Record<number, number> = {}
  uniqueDepths.forEach((depth, index) => {
    depthMapping[depth] = index // Map each unique depth to an index starting from 0
  })

  // Apply the new normalized depth to each match
  matches.forEach((match) => {
    match.depth = depthMapping[match.depth]
  })

  // Sort by index and then by normalized depth for rendering
  matches.sort((a, b) => a.index - b.index || a.depth - b.depth)

  // Create text segments for displaying based on unique indices
  let sortedIndexes = Array.from(splitIndexes).sort((a, b) => a - b)
  let segments = []
  let lastIndex = 0

  sortedIndexes.forEach((index) => {
    if (lastIndex !== index) {
      segments.push({ text: text.substring(lastIndex, index), index: lastIndex, end: index })
    }
    lastIndex = index
  })
  segments.push({ text: text.substring(lastIndex), index: lastIndex, end: text.length })

  let segmentElements: { element: HTMLElement; index: number; end: number }[] = []

  segments.forEach((segment) => {
    const span = document.createElement('span')
    span.className = 'text-segment'
    span.textContent = segment.text
    container.appendChild(span)
    segmentElements.push({ element: span, index: segment.index, end: segment.end })

    matches.forEach((match) => {
      if (
        match.bold &&
        match.index === segment.index &&
        match.index + match.length === segment.end
      ) {
        span.classList.add('bold')
      }

      if (
        match.dotted &&
        match.index === segment.index &&
        match.index + match.length === segment.end
      ) {
        const beforeDot = span.textContent!.substring(0, match.dotted)
        const afterDot = span.textContent!.substring(match.dotted)
        span.innerHTML = beforeDot + '<span class="dotted"></span>' + afterDot
      }
    })
  })

  let maxYDepth = 0

  // Create and position highlight elements
  matches.forEach((match) => {
    const highlightSpan = document.createElement('span')
    highlightSpan.classList.add('highlight', `color-${match.color}`)
    highlightSpan.setAttribute('data-group', match.text)

    // Calculate width and positioning for each highlight based on matching segments
    const matchSegment = segmentElements.find((seg) => seg.index === match.index)
    const endSegment = segmentElements.find((seg) => seg.end === match.index + match.length)
    if (matchSegment && endSegment) {
      const width =
        endSegment.element.offsetLeft +
        endSegment.element.offsetWidth -
        matchSegment.element.offsetLeft -
        5 // Adjust width to add gaps
      highlightSpan.style.width = `${width + 14}px` // Reduce width by 2px to add a gap between highlights
      highlightSpan.style.height = `${22 + match.depth * 25}px` // Height increases with depth
      highlightSpan.style.top = `${matchSegment.element.offsetTop - 10 - match.depth * 25}px` // Move up based on depth
      highlightSpan.style.left = `${matchSegment.element.offsetLeft - 5}px` // Shift left slightly to center the highlight after width adjustment
      container.appendChild(highlightSpan)
      maxYDepth = Math.max(maxYDepth, matchSegment.element.offsetTop + 15 + match.depth * 25)
    }
  })
  container.style.marginTop = `${maxYDepth + 10}px` // Ensuring no overflow
}
</script>

<style>
body {
  font-size: 16px;
  font-family: Arial, sans-serif;
}
.container {
  position: relative;
  white-space: nowrap;
  padding-top: 5px;
}
.text-segment {
  display: inline-block;
  margin-right: 10px;
  font-size: 1.4rem;
}
.highlight {
  position: absolute;
  box-sizing: border-box;
  border-style: solid;
  border-width: 2px 2px 0 2px;
  text-align: center;
  padding: 10px 0;
}
.highlight::after {
  content: attr(data-group);
  position: absolute;
  top: -14px;
  left: 50%;
  font-size: 0.6rem;
  transform: translateX(-50%);
}
.color-blue {
  border-color: blue;
}
.color-green {
  border-color: green;
}
.color-orange {
  border-color: orange;
}
.color-purple {
  border-color: purple;
}
.color-brown {
  border-color: brown;
}
.bold {
  font-weight: bold;
}
.dotted {
  border-left: 1px dotted black;
  margin: 0 2px;
}
</style>
