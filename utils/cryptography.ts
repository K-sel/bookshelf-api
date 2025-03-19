// Pour hasher un mot de passe
import { crypto } from "@std/crypto/crypto";

/**
 * Hash un mot de passe de manière sécurisée en utilisant PBKDF2 avec SHA-256.
 *
 * @param password - Le mot de passe en clair à hasher.
 * @returns Une promesse qui résout avec le hash encodé en Base64, incluant le sel.
 *
 * @remarks
 * - Utilise PBKDF2 avec 100 000 itérations pour une sécurité renforcée.
 * - Génère un sel aléatoire de 16 octets pour chaque hash.
 * - Le sel est stocké avec le hash pour permettre la vérification ultérieure.
 * - Le hash final est encodé en Base64 pour un stockage facile.
 * - Le format du hash résultant est: `[16 octets de sel][32 octets de hash]`.
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword("motdepasse123");
 * // Résultat: chaîne Base64 contenant le sel et le hash
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Générer un sel aléatoire
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Dériver une clé avec PBKDF2
  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  // Concaténer le sel et les bits dérivés
  const hashArray = new Uint8Array(salt.length + derivedBits.byteLength);
  hashArray.set(salt, 0);
  hashArray.set(new Uint8Array(derivedBits), salt.length);

  // Convertir en Base64
  return btoa(String.fromCharCode(...hashArray));
}

/**
 * Vérifie si un mot de passe correspond à un hash stocké.
 *
 * @param password - Le mot de passe en clair à vérifier.
 * @param storedHash - Le hash stocké (encodé en Base64) avec lequel comparer.
 * @returns Une promesse qui résout avec un booléen indiquant si le mot de passe correspond.
 *
 * @remarks
 * - Extrait le sel des 16 premiers octets du hash stocké.
 * - Utilise le même algorithme PBKDF2 avec le sel extrait pour hasher le mot de passe fourni.
 * - Effectue une comparaison en temps constant des hash pour prévenir les attaques temporelles.
 * - La comparaison en temps constant signifie que le temps de vérification est identique
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
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Décoder le hash stocké
  const hashBytes = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));

  // Extraire le sel (les 16 premiers octets)
  const salt = hashBytes.slice(0, 16);
  const storedDerivedBits = hashBytes.slice(16);

  // Dériver une clé avec le même sel
  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  // Comparer les bits dérivés
  const newDerivedBitsArray = new Uint8Array(derivedBits);

  if (storedDerivedBits.length !== newDerivedBitsArray.length) {
    return false;
  }

  // Comparaison sécurisée (temps constant)
  let result = 0;
  for (let i = 0; i < storedDerivedBits.length; i++) {
    result |= storedDerivedBits[i] ^ newDerivedBitsArray[i];
  }

  return result === 0;
}
