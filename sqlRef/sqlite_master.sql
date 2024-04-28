INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'part_of_speech', 'part_of_speech', 2, 'CREATE TABLE part_of_speech (
                                value TEXT PRIMARY KEY CHECK (value IN (''suffix'', ''aux. adj. (i)'', ''prt'', ''aux. v. (Gr. 2)''))
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('index', 'sqlite_autoindex_part_of_speech_1', 'part_of_speech', 3, null);
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'type', 'type', 4, 'CREATE TABLE type (
                      value TEXT PRIMARY KEY CHECK (value IN (''semantically_related'', ''bold_comparison'', ''parenthesized''))
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('index', 'sqlite_autoindex_type_1', 'type', 5, null);
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'table_type', 'table_type', 8, 'CREATE TABLE table_type (
                            value TEXT PRIMARY KEY CHECK (value IN (''GrammarPoints'', ''RelatedExpressions'', ''KeySentences'', ''Counterparts'', ''Notes'', ''FormationExamples'', ''Examples''))
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('index', 'sqlite_autoindex_table_type_1', 'table_type', 9, null);
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'sqlite_sequence', 'sqlite_sequence', 11, 'CREATE TABLE sqlite_sequence(name,seq)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'Formations', 'Formations', 12, 'CREATE TABLE Formations (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            grammar_point_id INTEGER NOT NULL,
                            content TEXT,
                            FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id)
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'FormationExamples', 'FormationExamples', 13, 'CREATE TABLE FormationExamples (
                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                   formation_id INTEGER NOT NULL,
                                   content TEXT,
                                   FOREIGN KEY (formation_id) REFERENCES Formations(id)
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'KeySentences', 'KeySentences', 14, 'CREATE TABLE KeySentences (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              grammar_point_id INTEGER NOT NULL,
                              content TEXT,
                              FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id)
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'Languages', 'Languages', 15, 'CREATE TABLE Languages (
                           code TEXT PRIMARY KEY,
                           name TEXT
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('index', 'sqlite_autoindex_Languages_1', 'Languages', 16, null);
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'Translations', 'Translations', 20, 'CREATE TABLE Translations (
                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                              reference_id INTEGER,
                              table_type TEXT NOT NULL,
                              language_code TEXT NOT NULL,
                              translation TEXT,
                              FOREIGN KEY (table_type) REFERENCES table_type(value),
                              FOREIGN KEY (language_code) REFERENCES Languages(code)
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'Examples', 'Examples', 23, 'CREATE TABLE Examples (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          grammar_point_id INTEGER NOT NULL,
                          content TEXT,
                          FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id)
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'RelatedExpressions', 'RelatedExpressions', 25, 'CREATE TABLE RelatedExpressions (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    grammar_point_id INTEGER NOT NULL,
                                    type TEXT NOT NULL,
                                    related_grammar_point_id INTEGER,
                                    FOREIGN KEY (grammar_point_id) REFERENCES GrammarPoints(id),
                                    FOREIGN KEY (related_grammar_point_id) REFERENCES GrammarPoints(id),
                                    FOREIGN KEY (type) REFERENCES type(value)
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'GrammarPoints', 'GrammarPoints', 17, 'CREATE TABLE "GrammarPoints"
(
    id             INTEGER
        primary key autoincrement,
    content        TEXT,
    romaji         TEXT,
    part_of_speech TEXT not null
        references part_of_speech
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'part_type', 'part_type', 10, 'CREATE TABLE "part_type"
(
    value TEXT
        primary key,
    check (value IN (''topic'', ''verb'', ''object'', ''other'', ''Adj (na) stem''))
)');
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('index', 'sqlite_autoindex_part_type_1', 'part_type', 26, null);
INSERT INTO sqlite_master (type, name, tbl_name, rootpage, sql) VALUES ('table', 'SentenceParts', 'SentenceParts', 6, 'CREATE TABLE "SentenceParts"
(
    id          INTEGER
        primary key autoincrement,
    sentence_id INTEGER not null
        references KeySentences,
    part_type   TEXT    not null
        references part_type,
    label       TEXT,
    regex       TEXT
, "group" integer, dotted INTEGER, bold boolean)');
