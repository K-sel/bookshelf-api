export interface User {
  firstname: string;
  name: string;
  age: number;
  language: "fr" | "it" | "en" | "de";
  email: string;
  password: string;
  isAdmin: boolean;
}

export const USER_FORMAT = {
  firstname: "string",
  name: "string",
  age: "number // between 1 and 120 years old",
  language: " 'fr' | 'it' | 'en' | 'de' ",
  email: "string // xxx@xxx.xx",
  password: "string",
  isAdmin: "boolean",
};

export const isInstanceOfUser = (object: any): object is User => {
  // Vérifie les champs obligatoires
  const validFields =
    object &&
    typeof object === "object" &&
    typeof object.firstname === "string" &&
    typeof object.name === "string" &&
    typeof object.age === "number" &&
    ["fr", "it", "en", "de"].includes(object.language) &&
    typeof object.email === "string" &&
    typeof object.password === "string" &&
    typeof object.isAdmin === "boolean";

  // Vérifie qu'il n'y a pas de champs supplémentaires
  const allowedKeys = [
    "firstname",
    "name",
    "age",
    "language",
    "email",
    "password",
    "isAdmin",
  ];
  const hasOnlyAllowedFields = Object.keys(object).every((key) =>
    allowedKeys.includes(key)
  );

  return validFields && hasOnlyAllowedFields;
};
