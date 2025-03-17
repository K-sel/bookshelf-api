export interface User {
  firstname: string;
  name: string;
  age: number;
  language: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export const USER_FORMAT = {
  firstname: "string",
  name: "string",
  age: "number",
  language: "string",
  email: "string",
  password: "string",
  isAdmin: "boolean",
};

export const isInstanceOfUser = (object: any): object is User  => {
  // Vérifie les champs obligatoires
  const validFields =
    object &&
    typeof object === "object" &&
    typeof object.firstname === "string" &&
    typeof object.name === "string" &&
    typeof object.age === "number" &&
    typeof object.language === "string" &&
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

  const isRealisticAge = object.age > 0 && object.age < 120;

  return validFields && hasOnlyAllowedFields && isRealisticAge;
};
