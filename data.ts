#!/usr/bin/env -S deno run --allow-write
import { v4 } from "@std/uuid";
import { assert } from "@std/assert";

interface Book {
  id: string;
  title: string;
  author: string;
  status: "read" | "to-read" | "pending";
  cover: string;
  summary: string;
}

const data: Omit<Book, 'id'>[] = [
  {
    title: "Sapiens : Une brève histoire de l'humanité",
    author: "Yuval Noah Harari",
    status: "read",
    cover: "./assets/sapiens.jpg",
    summary:
      "Une exploration fascinante de l'histoire de l'espèce humaine, depuis l'apparition d'Homo sapiens jusqu'à nos jours, examinant comment nous avons évolué et comment notre espèce a transformé la planète à travers les révolutions cognitives, agricoles et scientifiques.",
  },
  {
    title: "Antifragile : Les bienfaits du désordre",
    author: "Nassim Nicholas Taleb",
    status: "to-read",
    cover: "./assets/antifragile.jpg",
    summary:
      "Une exploration du concept d'antifragilité, décrivant les systèmes qui non seulement résistent aux chocs et à la volatilité, mais qui s'améliorent grâce à eux, contrairement aux systèmes simplement robustes ou résilients qui ne font que survivre.",
  },
  {
    title: "Pensées à moi-même",
    author: "Marc Aurèle",
    status: "pending",
    cover: "./assets/pensees.jpg",
    summary:
      "Recueil de réflexions personnelles de l'empereur romain et philosophe stoïcien Marc Aurèle, écrites pour lui-même comme exercices spirituels, abordant des thèmes comme la vertu, la mortalité, la rationalité et la place de l'homme dans l'univers.",
  },
];

// Fonction pour générer un UUID validé
function generateValidUUID(): string {
  const uuid = crypto.randomUUID();
  assert(v4.validate(uuid));
  return uuid;
}

// Créer le tableau final avec les UUIDs
const books: Book[] = data.map(book => ({
  id: generateValidUUID(),
  ...book
}));


await Deno.writeTextFile("./books.json", JSON.stringify(books));
