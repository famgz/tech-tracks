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
  code: "desafios de códigos",
  courses: "cursos",
  lives: "lives",
  project: "desafios de projeto",
};

export const translate = (word: string): string => {
  return translations[word] || word;
};
