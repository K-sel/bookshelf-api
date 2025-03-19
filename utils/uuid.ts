import { v4 } from "@std/uuid";
import { assert } from "@std/assert";

/**
* Génère un identifiant unique universel (UUID) v4 valide.
* 
* @returns Une chaîne de caractères représentant un UUID v4 valide.
* 
*/
export function generateValidUUID(): string {
  const uuid = crypto.randomUUID();
  assert(v4.validate(uuid));
  return uuid;
}
