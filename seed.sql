-- Insert a language
INSERT INTO Languages (code, name) VALUES ('en', 'English');
INSERT INTO Languages (code, name) VALUES ('de', 'German');
INSERT INTO Languages (code, name) VALUES ('ja', 'Japanese');

-- Insert a grammar point
INSERT INTO GrammarPoints (content, hiragana, part_of_speech) VALUES ('wa', 'は', 'particle');

-- Insert grammar point data
INSERT INTO GrammarPointData (grammar_point_id, data_type) VALUES (1, 'Meaning');
INSERT INTO GrammarPointData (grammar_point_id, data_type) VALUES (1, 'Counterparts');
INSERT INTO GrammarPointData (grammar_point_id, data_type) VALUES (1, 'Notes');

-- Insert related expressions
INSERT INTO RelatedExpressions (grammar_point_id, type) VALUES (1, 'semantically_related');

-- Insert key sentence
INSERT INTO KeySentences (grammar_point_id, japanese_sentence) VALUES (1, '彼は学生です。');  -- He is a student.

-- Insert sentence parts
INSERT INTO SentenceParts (sentence_id, part_type, label) VALUES (1, 'topic', '彼は'); -- He (as the topic)

-- Insert formation examples
INSERT INTO Formations (grammar_point_id) VALUES (1);
INSERT INTO FormationExamples (formation_id, example) VALUES (1, 'Noun + は');

-- Insert translations
-- Translating the meaning of the grammar point
INSERT INTO Translations (reference_id, table_type, language_code, translated_text) VALUES (1, 'GrammarPointData', 'en', 'Indicates the topic of the sentence');
INSERT INTO Translations (reference_id, table_type, language_code, translated_text) VALUES (1, 'GrammarPointData', 'de', 'Zeigt das Thema des Satzes an');

-- Translating the key sentence
INSERT INTO Translations (reference_id, table_type, language_code, translated_text) VALUES (1, 'KeySentences', 'en', 'He is a student.');
INSERT INTO Translations (reference_id, table_type, language_code, translated_text) VALUES (1, 'KeySentences', 'de', 'Er ist ein Student.');

-- Translating the formation examples
INSERT INTO Translations (reference_id, table_type, language_code, translated_text) VALUES (1, 'FormationExamples', 'en', 'Noun followed by "は"');
INSERT INTO Translations (reference_id, table_type, language_code, translated_text) VALUES (1, 'FormationExamples', 'de', 'Nomen gefolgt von "は"');
