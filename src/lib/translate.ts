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

  // user role
  student: "estudante",
  creator: "criador de conteúdo",
  admin: "administrador",

  // level
  beginner: "básico",
  intermediary: "intermediário",
  advanced: "avançado",
};

export const translate = (word: string): string => {
  return translations[word] || word;
};
