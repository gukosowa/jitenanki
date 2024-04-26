create table Languages
(
    code TEXT
        primary key,
    name TEXT
);

create table part_of_speech
(
    value TEXT
        primary key,
    check (value IN ('suffix', 'aux. adj. (i)', 'prt', 'aux. v. (Gr. 2)'))
);

create table GrammarPoints
(
    id             INTEGER
        primary key autoincrement,
    content        TEXT,
    romaji         TEXT,
    part_of_speech TEXT not null
        references part_of_speech
);

create table Examples
(
    id               INTEGER
        primary key autoincrement,
    grammar_point_id INTEGER not null
        references GrammarPoints,
    content          TEXT
);

create table Formations
(
    id               INTEGER
        primary key autoincrement,
    grammar_point_id INTEGER not null
        references GrammarPoints,
    content          TEXT
);

create table FormationExamples
(
    id           INTEGER
        primary key autoincrement,
    formation_id INTEGER not null
        references Formations,
    content      TEXT
);

create table KeySentences
(
    id               INTEGER
        primary key autoincrement,
    grammar_point_id INTEGER not null
        references GrammarPoints,
    content          TEXT
);

create table part_type
(
    value TEXT
        primary key,
    check (value IN ('topic', 'verb', 'object', 'other', 'Adj (na) stem'))
);

create table SentenceParts
(
    id          INTEGER
        primary key autoincrement,
    sentence_id INTEGER not null
        references KeySentences,
    part_type   TEXT    not null
        references part_type,
    label       TEXT,
    regex       TEXT,
    "group"     integer,
    dotted      INTEGER,
    bold        boolean
);

create table sqlite_master
(
    type     TEXT,
    name     TEXT,
    tbl_name TEXT,
    rootpage INT,
    sql      TEXT
);

create table sqlite_sequence
(
    name,
    seq
);

create table table_type
(
    value TEXT
        primary key,
    check (value IN
           ('GrammarPoints', 'RelatedExpressions', 'KeySentences', 'Counterparts', 'Notes', 'FormationExamples',
            'Examples'))
);

create table Translations
(
    id            INTEGER
        primary key autoincrement,
    reference_id  INTEGER,
    table_type    TEXT not null
        references table_type,
    language_code TEXT not null
        references Languages,
    translation   TEXT
);

create table type
(
    value TEXT
        primary key,
    check (value IN ('semantically_related', 'bold_comparison', 'parenthesized'))
);

create table RelatedExpressions
(
    id                       INTEGER
        primary key autoincrement,
    grammar_point_id         INTEGER not null
        references GrammarPoints,
    type                     TEXT    not null
        references type,
    related_grammar_point_id INTEGER
        references GrammarPoints
);

