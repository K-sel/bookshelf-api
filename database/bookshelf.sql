-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : dim. 16 mars 2025 à 22:40
-- Version du serveur : 8.0.35
-- Version de PHP : 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bookshelf`
--

-- --------------------------------------------------------

--
-- Structure de la table `Books`
--

CREATE TABLE `Books` (
  `id` varchar(36) NOT NULL,
  `author` text NOT NULL,
  `title` text NOT NULL,
  `cover` text NOT NULL,
  `status` enum('read','to-read','pending') NOT NULL,
  `summary` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Books`
--

INSERT INTO `Books` (`id`, `author`, `title`, `cover`, `status`, `summary`) VALUES
('2a38ad88-0fe0-417e-b002-5383ff852b68', 'Victor Hugo', 'Les Misérables', './assets/miserables.jpg', 'read', 'Fresque sociale et politique du XIXe siècle français qui suit le parcours de Jean Valjean, ancien bagnard en quête de rédemption, poursuivi par l\'inspecteur Javert. À travers une galerie de personnages inoubliables, Hugo dénonce la misère, l\'injustice sociale et plaide pour plus d\'humanité.'),
('3ddb76bb-9c15-4bf3-9e00-a326d3d0677d', 'Albert Camus', 'L\'Étranger', './assets/etranger.jpg', 'read', 'Roman emblématique de l\'absurde qui suit Meursault, un homme indifférent face aux conventions sociales, dont la vie bascule après un meurtre commis sur une plage algérienne. Son procès devient moins celui d\'un crime que celui de son incapacité à se conformer aux attentes de la société.'),
('43d8fd07-a762-4f8a-aacf-2da1d0ff4f43', 'Simone de Beauvoir', 'Le Deuxième Sexe', './assets/deuxieme_sexe.jpg', 'read', 'Analyse philosophique et sociologique de la condition féminine qui explore comment la femme a été définie comme \'l\'Autre\' par rapport à l\'homme. Une œuvre fondatrice du féminisme moderne qui examine les contraintes imposées aux femmes à travers l\'histoire, la biologie, la psychanalyse et le marxisme.'),
('685cab4e-c102-489b-a9a8-e19c71c94d77', 'Marguerite Duras', 'L\'Amant', './assets/amant.jpg', 'read', 'Récit autobiographique se déroulant dans l\'Indochine coloniale des années 1930, où une jeune fille française de 15 ans entame une relation avec un riche homme chinois. L\'œuvre explore les thèmes du désir, de la passion interdite et des relations familiales complexes sur fond de tensions raciales et sociales.'),
('bb7d2fa3-0103-49eb-88f6-3ae23440e652', 'Honoré de Balzac', 'Le Père Goriot', './assets/goriot.jpg', 'pending', 'Chef-d\'œuvre de La Comédie humaine qui dépeint la pension Vauquer et ses habitants, notamment le vieux Goriot qui se ruine pour ses filles ingrates, et Rastignac, jeune provincial ambitieux découvrant les rouages de la société parisienne. Une critique acerbe de l\'individualisme et de la corruption morale dans la France post-révolutionnaire.'),
('d3a58419-d4d5-4e6b-96c4-7c2e15f819ad', 'Milan Kundera', 'L\'Insoutenable Légèreté de l\'être', './assets/legerete.jpg', 'to-read', 'Roman philosophique situé dans le contexte du Printemps de Prague qui suit les vies entrelacées de quatre personnages confrontés aux dilemmes de l\'amour, de la fidélité et du sens de l\'existence. Kundera y développe sa réflexion sur le poids des décisions et la difficulté d\'assumer sa liberté.');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Books`
--
ALTER TABLE `Books`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
