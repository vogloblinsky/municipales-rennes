let thematiques = require('./thematiques.json');
let sousthematiques = require('./sous-thematiques.json');

let candidats = require('./candidats.json');

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

candidats.forEach(candidat => {
    candidat.orderedThematiques = JSON.parse(JSON.stringify(thematiques));
    candidat.orderedThematiques.forEach(candidatThematique => {
        if (candidatThematique['sous-thematiques']) {
            candidatThematique['sous-thematiques'].forEach(candidatSousThematique => {
                if (candidatSousThematique) {
                    candidatSousThematique.propositions = [];
                    candidatSousThematique.propositions = candidat.propositions.filter(candidatProposition => {
                        return candidatProposition.st === candidatSousThematique.id;
                    });
                    candidatSousThematique.propositions = candidatSousThematique.propositions.sort(
                        (proposition1, proposition2) => {
                            return !proposition1.important;
                        }
                    );
                }
            });
        }
    });
});

module.exports = {
    candidats: candidats,
    thematiques: thematiques
};
