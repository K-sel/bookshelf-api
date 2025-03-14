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

export function instanceOfBook(object: Book): object is Book {
  return (
    object &&
    typeof object === "object" &&
    typeof object.title === "string" &&
    typeof object.author === "string" &&
    ["read", "to-read", "pending"].includes(object.status) &&
    typeof object.cover === "string" &&
    typeof object.summary === "string"
  );
}

