export interface Book {
  title: string;
  author: string;
  status: "read" | "to-read" | "pending";
  cover: string;
  summary: string;
}

export const BOOK_FORMAT = {
  title: "string",
  author: "string",
  status: "'read' | 'to-read' | 'pending'",
  cover: "string",
  summary: "string",
};

export function instanceOfBook(object: any): object is Book {
  // Vérifie les champs obligatoires
  const validFields = 
    object &&
    typeof object === "object" &&
    typeof object.title === "string" &&
    typeof object.author === "string" &&
    ["read", "to-read", "pending"].includes(object.status) &&
    typeof object.cover === "string" &&
    typeof object.summary === "string";
    
  // Vérifie qu'il n'y a pas de champs supplémentaires
  const allowedKeys = ["title", "author", "status", "cover", "summary"];
  const hasOnlyAllowedFields = Object.keys(object).every(key => 
    allowedKeys.includes(key)
  );
    
  return validFields && hasOnlyAllowedFields;
}

