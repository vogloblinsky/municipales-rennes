const fs = require('fs-extra');
const path = require('path');

let thematiques = require('../src/_data/thematiques.json');
let sousthematiques = require('../src/_data/sous-thematiques.json');

let candidats = require('../src/_data/candidats.json');

const mergeThematiquesAndSousThematiques = () => {
    thematiques.forEach(thematique => {
        if (thematique['sous-thematiques']) {
            thematique['sous-thematiques'] = thematique['sous-thematiques']
                .map(ssthematiqueid => {
                    return sousthematiques.find(sousthematique => sousthematique.id === ssthematiqueid);
                })
                .filter(ssthematique => ssthematique !== undefined);
        }
    });
};

// 1. merge de toutes les propositions

let mergedPropositions = [];
candidats.forEach(candidat => {
    mergedPropositions = [...mergedPropositions, ...candidat.propositions];
});

// 2. filtrage des sous-thematiques non utilisées

sousthematiques = sousthematiques.filter(sousthematique => {
    return mergedPropositions.find(proposition => proposition.st === sousthematique.id);
});

// 3. merge des thematiques et sous-thematiques

mergeThematiquesAndSousThematiques();

fs.writeJson(path.join(__dirname, '../src/_data/thematiques-et-sous-thematiques.json'), thematiques, async err => {
    if (err) return console.error(err);
    console.log('thematiques-et-sous-thematiques JSON write success!');
});
