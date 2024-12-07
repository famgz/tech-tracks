interface Translations {
  [key: string]: string;
}

const translations: Translations = {
  //filters
  level: "Nível",
  career: "Carreira",
  corporate: "Empresa",
  skill: "Tecnologia",

  // track activities
  code: "desafio de códigos",
  courses: "cursos",
  lives: "lives",
  project: "desafio de projeto",

  // course types
  challenge: "Desafio de projeto",
  course: "Curso",
  live: "Live",

  // user role
  student: "Estudante",
  creator: "Criador de conteúdo",
  admin: "Administrador",

  // level
  beginner: "Básico",
  intermediary: "Intermediário",
  advanced: "Avançado",
};

export const translate = (word: string): string => {
  return translations[word] || word;
};
