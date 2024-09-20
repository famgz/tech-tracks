interface Translations {
  [key: string]: string;
}

const translations: Translations = {
  //filters
  level: "nível",
  career: "carreira",
  corporate: "empresa",
  skill: "tecnologia",

  // track activities
  code: "desafio de códigos",
  courses: "cursos",
  lives: "lives",
  project: "desafio de projeto",

  // course types
  challenge: "desafio de projeto",
  course: "curso",
  live: "live",
  // project: 'desafio de projeto',
};

export const translate = (word: string): string => {
  return translations[word] || word;
};
