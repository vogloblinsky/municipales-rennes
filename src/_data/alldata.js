let thematiques = require('./thematiques.json');
let sousthematiques = require('./sous-thematiques.json');

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

module.exports = {
    candidats: require('./candidats.json'),
    thematiques: thematiques
};
