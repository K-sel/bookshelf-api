// cryptography.ts
import bcrypt from 'bcryptjs';

/**
 * Hash un mot de passe de manière sécurisée en utilisant bcrypt.
 *
 * @param password - Le mot de passe en clair à hasher.
 * @returns Une promesse qui résout avec le hash complet, incluant le sel.
 *
 * @remarks
 * - Utilise bcrypt avec 10 rounds (coût) pour une sécurité renforcée.
 * - Génère automatiquement un sel aléatoire pour chaque hash.
 * - Le sel est intégré dans le hash pour permettre la vérification ultérieure.
 * - La taille maximale d'un mot de passe est de 72 octets (caractères UTF-8).
 * - Le hash résultant comporte 60 caractères.
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword("motdepasse123");
 * // Résultat: chaîne de 60 caractères contenant l'algorithme, le coût, le sel et le hash
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
  // Définir le coût (nombre de rounds)
  const saltRounds = 10;
  
  // Générer un hash de manière asynchrone
  return bcrypt.hash(password, saltRounds);
}

/**
 * Vérifie si un mot de passe correspond à un hash stocké.
 *
 * @param password - Le mot de passe en clair à vérifier.
 * @param storedHash - Le hash stocké avec lequel comparer.
 * @returns Une promesse qui résout avec un booléen indiquant si le mot de passe correspond.
 *
 * @remarks
 * - Utilise bcrypt pour comparer de manière sécurisée le mot de passe au hash.
 * - Effectue une comparaison en temps constant pour prévenir les attaques temporelles.
 * - La comparaison en temps constant signifie que le temps de vérification est similaire
 *   que le mot de passe soit correct ou non, ce qui renforce la sécurité.
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword("motdepasse123", hashedPassword);
 * if (isValid) {
 *   // Authentification réussie
 * } else {
 *   // Mot de passe incorrect
 * }
 * ```
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  // Comparer le mot de passe au hash stocké
  return bcrypt.compare(password, storedHash);
}