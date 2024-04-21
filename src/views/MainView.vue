<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Japanese Grammar Points</h1>
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else class="flex flex-col gap-6">
      <div
        v-for="grammarPoint in grammarPoints"
        :key="grammarPoint.id"
        class="flex flex-col p-4 rounded-lg shadow-md bg-white"
      >
        <h2 class="text-xl font-semibold mb-2">
          {{ grammarPoint.content }} ({{ grammarPoint.romaji }})
        </h2>
        <div class="flex justify-between">
          <p class="text-sm text-gray-700">
            <strong>Part of Speech:</strong> {{ grammarPoint.part_of_speech }}
          </p>
          <div class="text-sm text-gray-700">
            <strong class="tw-block">Counterparts:</strong>
            <span v-for="(counterpart, idx) in grammarPoint.counterparts" :key="idx">
              {{ counterpart.language_code.toUpperCase() }}: {{ counterpart.content }}<br />
            </span>
          </div>
        </div>
        <div>
          <strong>Related Expressions:</strong>
          <div
            v-for="(expression, index) in grammarPoint.relatedExpressions"
            :key="index"
            class="ml-4"
          >
            {{ expression.content }}
          </div>
        </div>
        <div>
          <strong>Key Sentences:</strong>
          <div v-for="(sentence, index) in grammarPoint.keySentences" :key="index" class="ml-4">
            {{ sentence.content }}
            <div v-if="sentence.translations" class="ml-4">
              <span v-for="(translation, idx) in sentence.translations" :key="idx">
                {{ translation.language_code.toUpperCase() }}: {{ translation.content }}<br />
              </span>
            </div>
          </div>
        </div>
        <div>
          <strong>Formations:</strong>
          <div v-for="(formation, fIndex) in grammarPoint.formations" :key="fIndex" class="ml-4">
            {{ formation.content }}
            <div v-for="(example, eIndex) in formation.examples" :key="eIndex">
              {{ example.content }}
              <div class="ml-4">
                <span v-for="(translation, tIndex) in example.translations" :key="tIndex">
                  {{ translation.language_code.toUpperCase() }}: {{ translation.content }}<br />
                </span>
              </div>
            </div>
          </div>

          <strong>Examples:</strong>
          <div v-for="(example, index) in grammarPoint.examples" :key="index" class="ml-4">
            {{ example.content }}
            <div v-if="example.translations" class="ml-4">
              <span v-for="(translation, idx) in example.translations" :key="idx">
                {{ translation.language_code.toUpperCase() }}: {{ translation.content }}<br />
              </span>
            </div>
          </div>
        </div>
        <div v-if="grammarPoint.notes">
          <strong>Notes:</strong>
          <div class="ml-4">
            <span v-for="(translation, index) in grammarPoint.notes.translations" :key="index">
              {{ translation.language_code.toUpperCase() }}: {{ translation.content }}<br />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue'
import { exec } from '~/utils/sqllite.ts'

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
}

interface KeySentenceWithParts {
  content: string
  translations: Translation[]
  parts: SentencePart[]
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
  notes?: ContentWithTranslation
}

const grammarPoints = ref<GrammarPoint[]>([])
const loading = ref(true)

async function fetchGrammarPoints() {
  const data = await exec(`
    SELECT gp.id, gp.content, gp.romaji, gp.part_of_speech,
           (SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
            FROM Translations tr WHERE tr.reference_id = cp.id AND tr.table_type = 'Counterparts') AS counterparts,
           json_group_array(json_object('content', rgp.content)) AS relatedExpressions,
           json_group_array(json_object(
             'content', f.content,
             'examples', (SELECT json_group_array(json_object('content', fe.content, 'translations',
               (SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
                FROM Translations tr WHERE tr.reference_id = fe.id AND tr.table_type = 'FormationExamples')))
              FROM FormationExamples fe WHERE fe.formation_id = f.id)
           )) AS formations,
           json_group_array(json_object('content', ks.content, 'translations',
             (SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
              FROM Translations tr WHERE tr.reference_id = ks.id AND tr.table_type = 'KeySentences'),
             'parts', (SELECT json_group_array(json_object('content', sp.content, 'part_type', sp.part_type))
              FROM SentenceParts sp WHERE sp.sentence_id = ks.id)
           )) AS keySentences,
           json_group_array(json_object('content', ex.content, 'translations',
             (SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
              FROM Translations tr WHERE tr.reference_id = ex.id AND tr.table_type = 'Examples'))) AS examples,
           (SELECT json_object('content', nt.translation, 'translations',
             (SELECT json_group_array(json_object('language_code', tr.language_code, 'content', tr.translation))
              FROM Translations tr WHERE tr.reference_id = gp.id AND tr.table_type = 'Notes'))
             FROM Translations nt WHERE nt.reference_id = gp.id AND nt.table_type = 'Notes' LIMIT 1) AS notes
    FROM GrammarPoints gp
    LEFT JOIN Counterparts cp ON gp.id = cp.grammar_point_id
    LEFT JOIN RelatedExpressions re ON gp.id = re.grammar_point_id
    LEFT JOIN GrammarPoints rgp ON re.related_grammar_point_id = rgp.id
    LEFT JOIN Formations f ON gp.id = f.grammar_point_id
    LEFT JOIN KeySentences ks ON gp.id = ks.grammar_point_id
    LEFT JOIN Examples ex ON gp.id = ex.grammar_point_id
    GROUP BY gp.id
  `)
  return data.map((item: any) => ({
    id: item.id,
    content: item.content,
    romaji: item.romaji,
    part_of_speech: item.part_of_speech,
    counterparts: JSON.parse(item.counterparts),
    relatedExpressions: JSON.parse(item.relatedExpressions),
    formations: JSON.parse(item.formations),
    keySentences: JSON.parse(item.keySentences),
    examples: JSON.parse(item.examples),
    notes: item.notes ? JSON.parse(item.notes) : undefined,
  }))
}

onMounted(async () => {
  grammarPoints.value = await fetchGrammarPoints()
  console.log(toRaw(grammarPoints.value))
  loading.value = false
})
</script>

<style scoped></style>
