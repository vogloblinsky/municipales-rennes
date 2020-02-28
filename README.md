# Elections municipales de Rennes 2020

## Comparateur de programmes

Plateforme de comparaison de programmes politiques aux municipales françaises à Rennes.

<img src="src/assets/screenshot.png" alt="Screenshot" width="600">

## Features

-   listing par candidat des propositions, groupées par thématiques et sous-thématiques
-   filtrage des candidats
-   affichage des polémiques de la campagne par candidat (TODO)
-   affichage du bilan de la maire sortante (TODO)

## Développement

### Pré-requis

Node.js

### Installation locale

```
npm i
```

### Lancement local

```
npm start
```

## Build

```
npm run build
```

## Architecture

Cette application web est basée sur le générateur de site statique, [11ty](http://11ty.io/).

L'enrichissement dynamique est réalisé par du code JavaScript.

Pourquoi ce choix ? A des fins de SEO, et car les données sont statiques et ne changent pas souvent dans le temps.

Une génération au build est donc préférable à un rendu côté navigateur, pour chaque utilisateur.

## Dynamisme

La partie dynamisme est réalisé en VanillaJS à l'aide de quelques légères librairies JavaScript pour plus de simplicité.

## Intégration des données - 20200226

-   Gandon : à finir + mise en valeur, stop page 17 du programme
-   Compagnon : à finir + mise en valeur
-   Verts : à alléger + mise en valeur
-   Le pape : à finir / mise en valeur ok, stop page mobilité

-   Darcel : ok + manque mise en valeur

-   Appéré : ok
-   Salmon : ok
-   Hamon : ok
-   Ouvriers : ok
