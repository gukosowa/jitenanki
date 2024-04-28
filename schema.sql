create table Languages
(
    code TEXT -- e.g. "en", "de"
        primary key,
    name TEXT -- e.g. "English", "Deutsch"
);

CREATE TABLE part_of_speech
(
    value TEXT PRIMARY KEY,
    CHECK (value IN
           ('Nouns', 'Suffixes', 'Particles', 'Auxiliary Verbs (Group 2)', 'I-adjectives', 'Na-adjectives', 'Adverbs',
            'Conjunctions', 'Interjections', 'Copulas', 'Pronouns', 'Verbs'))
);

create table GrammarPoints
(
    id             INTEGER
        primary key autoincrement,
    content        TEXT, -- e.g. "のに"
    romaji         TEXT, -- e.g. "noni"
    part_of_speech TEXT not null -- e.g. "Conjunctions"
        references part_of_speech
);

create table Examples
(
    id               INTEGER
        primary key autoincrement,
    grammar_point_id INTEGER not null
        references GrammarPoints,
    content          TEXT　-- e.g. "清水さんはゴルフが下手なのに大好きだ・大好きです。"; "寒いのにオーバーを着ないで出かけた。"
);

create table Formations
(
    id               INTEGER
        primary key autoincrement,
    grammar_point_id INTEGER not null
        references GrammarPoints,
    content          TEXT -- e.g. "(i) {V/Adjective い} informal のに" or "{Adjective な stem/ N}	{な/だった} のに"
);

create table FormationExamples
(
    id           INTEGER
        primary key autoincrement,
    formation_id INTEGER not null -- reference to a Formation rule
        references Formations,
    content      TEXT -- e.g. "	{話す /話した} のに"; "{静かな/静かだった} のに"; ...
);

create table KeySentences
(
    id               INTEGER
        primary key autoincrement,
    grammar_point_id INTEGER not null
        references GrammarPoints,
    content          TEXT -- e.g. "毎日漢字を勉強しているのによく覚えられない・覚えられません。"
);

create table SentenceParts
    -- Splits the sentence of "KeySentences" apart into its key parts. E.g. Showing where the main clause is, where the subject is, etc.
(
    id          INTEGER
        primary key autoincrement,
    sentence_id INTEGER not null
        references KeySentences,
    label       TEXT, -- e.g "Noun Phrase / Clause", "Particle", "Predicate", "Adjective (i) inflection", "Adjective (na) stem", "Verb root (Vre)", "Verb masu form (Vmasu)", "Noun", "Subject", "Object", "Indirect Object", "Adverbial Phrase", "Relative Clause", "Interjection Phrase", "Copula", "Conjunction Phrase", "Direct Object", "Topic Marker Phrase", "Verb conjugated form", "Verb te-form", "Verb imperative form", "Verb potential form", "Verb passive form", "Verb causative form", "Verb conditional form", "Verb volitional form", "Pronoun Phrase", "Quantifier Phrase", "Time Expression", "Location Phrase", "Directional Phrase", "Modal Phrase", "Honorific Expression", "Question Phrase", "Exclamatory Phrase", "Negation Phrase"
    regex       TEXT, -- e.g. regex: "毎日漢字を勉強しているのに" label: "Subordinate Clause"; regex: "勉強している" label: "Vinf"; regex: "よく覚えられない" label: "Main Clause"
    "group"     integer, -- (optional) e.g. if regex could have multiple matches. Must write a group in a regex to use this.
    dotted      INTEGER, -- (optional) e.g. makes dots between char index. e.g. "このステーキは" -> use 6 -> "このステーキ・は". Used for noun or subject, when followed by "は" or "が".
    bold        boolean -- e.g. emphasize the main clause. Like the verb or direct object. Writes the match in bold text
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
        primary key, -- All tables listed as values. See check value in
    check (value IN
           ('GrammarPoints', 'RelatedExpressions', 'KeySentences', 'Counterparts', 'Notes', 'FormationExamples',
            'Examples'))
);

create table Translations
-- this table is used to store translations for all tables that have a translation
(
    id            INTEGER
        primary key autoincrement,
    reference_id  INTEGER, -- e.g. ID of the referenced table entry
    table_type    TEXT not null
        references table_type, -- e.g. "Examples"
    language_code TEXT not null
        references Languages, -- e.g. "de" or "en"
    translation   TEXT -- e.g. Actual translation of the referenced content of the table
);

create table type
(
    value TEXT
        primary key,
    check (value IN ('semantically_related', 'bold_comparison', 'parenthesized'))
);

create table RelatedExpressions
-- A grammar point can have related grammar points. This acts as a "pivot" table to store the related grammar points.
(
    id                       INTEGER
        primary key autoincrement,
    grammar_point_id         INTEGER not null
        references GrammarPoints, -- e.g. ID of the grammar point
    type                     TEXT    not null
        references type, -- e.g. How is related? "semantically_related", "bold_comparison", "parenthesized"
    related_grammar_point_id INTEGER
        references GrammarPoints -- e.g. ID of the related grammar point
);

