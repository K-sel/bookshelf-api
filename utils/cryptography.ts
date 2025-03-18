// Pour hasher un mot de passe
import { crypto } from "@std/crypto/crypto";

// Fonction pour hasher un mot de passe
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
      hash: "SHA-256"
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

// Fonction pour vérifier un mot de passe
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Décoder le hash stocké
  const hashBytes = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
  
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
      hash: "SHA-256"
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