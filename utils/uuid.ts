import { v4 } from "@std/uuid";
import { assert } from "@std/assert";

// Fonction pour générer un UUID validé
export function generateValidUUID(): string {
  const uuid = crypto.randomUUID();
  assert(v4.validate(uuid));
  return uuid;
}
