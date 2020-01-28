let thematiques = require('./thematiques.json');
let sousthematiques = require('./sous-thematiques.json');

let candidats = require('./candidats.json');

const mergeThematiquesAndSousThematiques = () => {
    thematiques.forEach(thematique => {
        if (thematique['sous-thematiques']) {
            thematique['sous-thematiques'] = thematique['sous-thematiques'].map(
                ssthematiqueid => {
                    return sousthematiques.find(
                        sousthematique => sousthematique.id === ssthematiqueid
                    );
                }
            );
        }
    });
};

mergeThematiquesAndSousThematiques();

candidats.forEach(candidat => {
    candidat.orderedThematiques = JSON.parse(JSON.stringify(thematiques));
    candidat.orderedThematiques.forEach(candidatThematique => {
        if (candidatThematique['sous-thematiques']) {
            candidatThematique['sous-thematiques'].forEach(
                candidatSousThematique => {
                    if (candidatSousThematique) {
                        candidatSousThematique.propositions = [];
                        candidatSousThematique.propositions = candidat.propositions.filter(
                            candidatProposition => {
                                return (
                                    candidatProposition.st ===
                                    candidatSousThematique.id
                                );
                            }
                        );
                    }
                }
            );
        }
    });
});

// Clean sous-thematiques empty
let mergedPropositions = [];
candidats.forEach(candidat => {
    mergedPropositions = [...mergedPropositions, ...candidat.propositions];
});

// console.log(mergedPropositions);

sousthematiques = sousthematiques.filter(sousthematique => {
    return mergedPropositions.find(
        proposition => proposition.st === sousthematique.id
    );
});

// console.log(sousthematiques);

// mergeThematiquesAndSousThematiques();

// console.log(thematiques);

module.exports = {
    candidats: candidats,
    thematiques: thematiques
};
