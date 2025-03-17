export interface UserValidForDbStorage {
  id: string;
  firstname: string;
  name: string;
  age: number;
  language: "fr" | "it" | "en" | "de";
  email: string;
  password: string;
  isAdmin: boolean;
}

export const isInstanceOfUserValidForDbStorage = (
  object: UserValidForDbStorage
): object is UserValidForDbStorage => {
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
    "id",
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
