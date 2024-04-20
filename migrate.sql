-- Creating table for grammar points
CREATE TABLE GrammarPoints (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                               romanized TEXT,
                               hiragana TEXT,
                               part_of_speech TEXT
);

-- Creating table for grammar point data types
CREATE TABLE GrammarPointData (
                                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                                  grammar_point_id INTEGER,
                                  data_type TEXT CHECK(data_type IN ('Meaning', 'Counterparts', 'Antonym', 'Notes')) NOT NULL,
                                  FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id)
);

-- Creating table for related expressions
CREATE TABLE RelatedExpressions (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    grammar_point_id INTEGER,
                                    type TEXT CHECK(type IN ('semantically_related', 'bold_comparison', 'parenthesized')) NOT NULL,
                                    FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id)
);

-- Creating table for key sentences
CREATE TABLE KeySentences (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              grammar_point_id INTEGER,
                              japanese_sentence TEXT,
                              FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id)
);

-- Creating table for sentence parts
CREATE TABLE SentenceParts (
                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                               sentence_id INTEGER,
                               part_type TEXT CHECK(part_type IN ('topic', 'verb', 'object', 'other')) NOT NULL,
                               content TEXT,
                               FOREIGN KEY (sentence_id) REFERENCES KeySentences(id)
);

-- Creating table for formations
CREATE TABLE Formations (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            grammar_point_id INTEGER,
                            FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id)
);

-- Creating table for formation examples
CREATE TABLE FormationExamples (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                   formation_id INTEGER,
                                   example TEXT,
                                   FOREIGN KEY (formation_id) REFERENCES Formations(id)
);

-- Creating table for languages
CREATE TABLE Languages (
                           code TEXT PRIMARY KEY,
                           name TEXT
);

-- Creating table for translations
CREATE TABLE Translations (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              reference_id INTEGER,
                              table_type TEXT CHECK(table_type IN ('GrammarPoints', 'GrammarPointData', 'RelatedExpressions', 'KeySentences', 'Notes', 'FormationExamples')) NOT NULL,
                              language_code TEXT,
                              translated_text TEXT,
                              FOREIGN KEY (language_code) REFERENCES Languages(code)
);
