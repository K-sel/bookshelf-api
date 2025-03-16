import { v4 } from "@std/uuid";
import { assert } from "@std/assert";

export interface ValidBookForDbStorage {
  id: string;
  title: string;
  author: string;
  status: "read" | "to-read" | "pending";
  cover: string;
  summary: string;
}

// Fonction pour générer un UUID validé
export function generateValidUUID(): string {
  const uuid = crypto.randomUUID();
  assert(v4.validate(uuid));
  return uuid;
}

export function instanceOfValidBookForDbStorage(
  object: ValidBookForDbStorage
): object is ValidBookForDbStorage {
  const validFields =  (
    object &&
    typeof object === "object" &&
    typeof object.id === "string" &&
    typeof object.title === "string" &&
    typeof object.author === "string" &&
    ["read", "to-read", "pending"].includes(object.status) &&
    typeof object.cover === "string" &&
    typeof object.summary === "string"
  );
  // Vérifie qu'il n'y a pas de champs supplémentaires
  const allowedKeys = ["id","title", "author", "status", "cover", "summary"];
  const hasOnlyAllowedFields = Object.keys(object).every(key => 
    allowedKeys.includes(key)
  );
    
  return validFields && hasOnlyAllowedFields;
}