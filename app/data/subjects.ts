export interface Subject {
  id: string;
  t: string;
  d?: string;
}

export const SUBJECTS: Record<string, Subject[]> = {
  k2: [
    { id: "ela", t: "English Language Arts", d: "Reading, writing, phonics" },
    { id: "math", t: "Math", d: "Number sense, operations" },
    { id: "science", t: "Science", d: "Life, earth science" },
    { id: "social_studies", t: "Social Studies", d: "Community, maps" },
    { id: "arts", t: "Arts", d: "Music, art, movement" },
    { id: "pe", t: "PE / Health" },
    { id: "general", t: "All Subjects", d: "I teach everything" },
  ],
  "35": [
    { id: "ela", t: "English Language Arts", d: "Reading, writing, grammar" },
    { id: "math", t: "Math", d: "Fractions, geometry" },
    { id: "science", t: "Science", d: "Earth, life, physical" },
    { id: "social_studies", t: "Social Studies", d: "State history, geography" },
    { id: "arts", t: "Arts", d: "Music, art, digital" },
    { id: "pe", t: "PE / Health" },
    { id: "foreign_lang", t: "Foreign Language", d: "Spanish, French" },
    { id: "tech", t: "Technology", d: "Digital citizenship" },
    { id: "general", t: "All Subjects" },
  ],
  "68": [
    { id: "ela", t: "English Language Arts", d: "Literature, essays" },
    { id: "math", t: "Math", d: "Pre-algebra, algebra" },
    { id: "science", t: "Science", d: "Life, earth, physical" },
    { id: "social_studies", t: "Social Studies", d: "World/US history, civics" },
    { id: "arts", t: "Arts", d: "Music, art, theater" },
    { id: "pe", t: "PE / Health" },
    { id: "foreign_lang", t: "Foreign Language", d: "Spanish, French, Mandarin" },
    { id: "tech", t: "CS / Technology", d: "Coding, digital literacy" },
    { id: "general", t: "General" },
  ],
  "912": [
    { id: "ela", t: "English / Language Arts", d: "Literature, AP English, creative writing" },
    { id: "math", t: "Mathematics", d: "Algebra, Calculus, Statistics" },
    { id: "bio", t: "Biology", d: "Bio, AP Bio, anatomy" },
    { id: "chem", t: "Chemistry", d: "Chem, AP Chem" },
    { id: "physics", t: "Physics", d: "Physics, AP Physics" },
    { id: "env_sci", t: "Environmental Science", d: "AP Enviro, earth sci" },
    { id: "us_history", t: "US History / Gov", d: "APUSH, gov, econ" },
    { id: "world_history", t: "World History", d: "AP World, geography" },
    { id: "arts", t: "Arts", d: "Music, art, film" },
    { id: "pe", t: "PE / Health" },
    { id: "foreign_lang", t: "World Languages", d: "Spanish, French, Latin" },
    { id: "tech", t: "CS / CTE", d: "AP CS, engineering" },
    { id: "general", t: "General" },
  ],
  all: [
    { id: "ela", t: "ELA" },
    { id: "math", t: "Math" },
    { id: "science", t: "Science" },
    { id: "social_studies", t: "Social Studies" },
    { id: "arts", t: "Arts" },
    { id: "pe", t: "PE" },
    { id: "foreign_lang", t: "Languages" },
    { id: "tech", t: "Tech / CS" },
    { id: "general", t: "Admin / General" },
  ],
};

// Maps HS-specific subjects to their general category
export const SUBJECT_MAP: Record<string, string> = {
  ela: "ela",
  math: "math",
  science: "science",
  social_studies: "social_studies",
  arts: "arts",
  pe: "pe",
  foreign_lang: "foreign_lang",
  tech: "tech",
  general: "general",
  bio: "science",
  chem: "science",
  physics: "science",
  env_sci: "science",
  us_history: "social_studies",
  world_history: "social_studies",
};

export const GRADE_LABELS: Record<string, string> = {
  k2: "K\u20132",
  "35": "3\u20135",
  "68": "6\u20138",
  "912": "9\u201312",
  all: "All Grades",
};

export const ECO_LABELS: Record<string, string> = {
  google: "Google",
  microsoft: "M365",
  mixed: "Mixed",
};

export const NEED_LABELS: Record<string, string> = {
  save_time: "Save time on planning & grading",
  differentiate: "Differentiate for diverse learners",
  engage: "Create engaging content",
  assess: "Better assessments & feedback",
  detect: "Detect AI-generated work",
  student_ai: "Teach students to use AI well",
};

export const BUDGET_LABELS: Record<string, string> = {
  free: "Free only",
  low: "Under $20/month",
  district: "District can purchase",
};
