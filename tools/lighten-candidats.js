const fs = require('fs-extra');
const path = require('path');

let candidats = require('../src/_data/candidats.json');

let candidatsLight = JSON.parse(JSON.stringify(candidats));

candidatsLight.forEach(candidat => {
    delete candidat.propositions;
    delete candidat.orderedThematiques;
});

fs.writeJson(path.join(__dirname, '../src/_data/candidats-light.json'), candidatsLight, async err => {
    if (err) return console.error(err);
    console.log('candidatsLight JSON write success!');
});
