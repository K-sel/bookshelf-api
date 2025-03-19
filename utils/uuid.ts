import { v4 as uuidv4 } from 'uuid';

/**
* Génère un identifiant unique universel (UUID) v4 valide.
* 
* @returns Une chaîne de caractères représentant un UUID v4 valide.
* 
*/
export function generateValidUUID(): string {
  const uuid = uuidv4()
  return uuid;
}
