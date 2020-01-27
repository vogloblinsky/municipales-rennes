let thematiques = require('./thematiques.json');
let sousthematiques = require('./sous-thematiques.json');

let candidats = require('./candidats.json');

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

module.exports = {
    candidats: candidats,
    thematiques: thematiques
};
