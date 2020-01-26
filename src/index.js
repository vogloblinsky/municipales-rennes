import sousThematiques from './_data/sous-thematiques.json';

import allData from './_data/alldata';

const thematiques = allData.thematiques;

const initUI = () => {
    const maxWidthCandidatBlock = 380;
    let currentWidthForCandidat = 0;

    const navContainer = document.querySelector('.nav-container');
    const mainContainer = document.querySelector('.main-container');
    const candidatsList = document.querySelector('.candidats-list');

    const mainContainerWidth = mainContainer.offsetWidth;

    // Update mainContainer top position
    mainContainer.style.top = navContainer.offsetHeight + 'px';

    // Update candidat column width
    const candidatBlocks = Array.from(
        mainContainer.querySelectorAll('article')
    );
    candidatBlocks.map(candidatBlock => {
        if (mainContainerWidth > maxWidthCandidatBlock) {
            currentWidthForCandidat = maxWidthCandidatBlock;
        } else {
            currentWidthForCandidat = mainContainerWidth;
        }
        candidatBlock.style.width = currentWidthForCandidat + 'px';
    });

    // Manage nav buttons
    let currentCandidatIndex = 0;
    const nbCandidats = candidatBlocks.length;
    const leftButton = document.querySelectorAll(
        '.second-nav__right .button'
    )[0];
    const rightButton = document.querySelectorAll(
        '.second-nav__right .button'
    )[1];

    const translateCandidats = e => {
        if (e.currentTarget.classList.contains('disabled')) return;
        const direction = parseInt(
            e.currentTarget.getAttribute('data-direction')
        );
        if (direction === 1) {
            currentCandidatIndex += 1;
        } else {
            currentCandidatIndex -= 1;
        }
        mainContainer.scrollLeft =
            currentCandidatIndex * currentWidthForCandidat;
        candidatsList.scrollLeft =
            currentCandidatIndex * currentWidthForCandidat;
        if (
            currentCandidatIndex > 0 &&
            currentCandidatIndex < nbCandidats - 1
        ) {
            leftButton.classList.remove('disabled');
            rightButton.classList.remove('disabled');
        } else if (currentCandidatIndex === 0) {
            leftButton.classList.add('disabled');
            rightButton.classList.remove('disabled');
        } else {
            leftButton.classList.remove('disabled');
            rightButton.classList.add('disabled');
        }
    };

    leftButton.addEventListener('click', translateCandidats);
    rightButton.addEventListener('click', translateCandidats);

    // Update cells lines and height for each sous-thematiques
    sousThematiques.forEach(sousThematique => {
        const allSectionsForSousThematique = Array.from(
            document.querySelectorAll(
                `[data-sous-thematique-id=${sousThematique.id}]`
            )
        );
        let maxHeight = 0;
        allSectionsForSousThematique.forEach(sectionSousThematique => {
            if (sectionSousThematique.offsetHeight > maxHeight) {
                maxHeight = sectionSousThematique.offsetHeight;
            }
        });
        allSectionsForSousThematique.forEach(sectionSousThematique => {
            sectionSousThematique.style.height = maxHeight + 'px';
        });
    });

    // Manage thematiques selector
    const thematiquesSelect = document.querySelector('#thematiques');
    let sousThematiquesSelect = document.querySelector('#sous-thematiques');

    const defaultSousThematiqueOption = document.createElement('option');
    defaultSousThematiqueOption.text = 'Toutes les sous-thématiques';

    const clearSousThematiques = () => {
        sousThematiquesSelect.options.length = 0;
    };

    const populateSousThematiques = sousThematiques => {
        clearSousThematiques();
        sousThematiquesSelect.disabled = false;
        sousThematiquesSelect.add(defaultSousThematiqueOption);
        sousThematiques.forEach(sousThematique => {
            let option = document.createElement('option');
            option.text = sousThematique.label;
            option.value = sousThematique.id;
            sousThematiquesSelect.add(option);
        });
        sousThematiquesSelect.selectedIndex = 0;
    };

    const filterForThematique = thematique => {
        const sectionsThematiqueToHide = Array.from(
            document.querySelectorAll(
                `[data-thematique-id]:not([data-thematique-id="${thematique.id}"])`
            )
        );
        sectionsThematiqueToHide.forEach(sectionThematiqueToHide => {
            sectionThematiqueToHide.style.display = 'none';
        });
        const sectionsThematiqueToShow = Array.from(
            document.querySelectorAll(`[data-thematique-id="${thematique.id}"]`)
        );
        sectionsThematiqueToShow.forEach(sectionThematiqueToShow => {
            sectionThematiqueToShow.style.display = 'block';
        });
    };

    thematiquesSelect.addEventListener('change', e => {
        const thematiqueToSelect = thematiques.find(
            thematique => thematique.id === e.currentTarget.value
        );
        if (thematiqueToSelect) {
            if (thematiqueToSelect['sous-thematiques']) {
                populateSousThematiques(thematiqueToSelect['sous-thematiques']);
            } else {
                sousThematiquesSelect.disabled = true;
            }
            // filter for thematique
            filterForThematique(thematiqueToSelect);
        }
    });
    sousThematiquesSelect.addEventListener('change', e => {
        console.log('sousThematiquesSelect change: ', e.currentTarget.value);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initUI, 500);
});
