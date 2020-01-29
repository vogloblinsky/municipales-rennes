import sousThematiques from './_data/sous-thematiques.json';

import allData from './_data/alldata';

import Sticky from 'sticky-js';

import bsn from 'bootstrap.native/dist/bootstrap-native-v4_light';

const thematiques = allData.thematiques;

const findThematiqueForSousThematique = sousThematiqueToFind => {
    let finalThematique;
    thematiques.forEach(thematique => {
        if (thematique['sous-thematiques']) {
            thematique['sous-thematiques'].forEach(sousThematique => {
                if (
                    sousThematique &&
                    sousThematique.id === sousThematiqueToFind.id
                ) {
                    finalThematique = thematique;
                }
            });
        }
    });
    return finalThematique;
};

const initUI = () => {
    let maxWidthCandidatBlock = 380;
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

    // Update candidat header column width
    const candidatHeaderBlocks = Array.from(
        candidatsList.querySelectorAll('header')
    );
    candidatHeaderBlocks.map(candidatHeaderBlock => {
        candidatHeaderBlock.style.flex = `0 0 ${currentWidthForCandidat - 1}px`; // -1 for border-right
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

    const hideAllH2 = () => {
        const allh2 = Array.from(document.querySelectorAll('article h2 span'));
        allh2.map(h2 => {
            h2.style.visibility = 'hidden';
        });
    };

    const showForCurrentIndex = index => {
        const h2s = Array.from(
            document.querySelectorAll(
                `.candidats-wrapper article:nth-child(${index + 1}) h2 span`
            )
        );
        h2s.map(h2 => {
            h2.style.visibility = 'visible';
        });
    };

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

        //Manage h2s
        hideAllH2();
        showForCurrentIndex(currentCandidatIndex);
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
    const sousThematiquesSelect = document.querySelector('#sous-thematiques');

    const defaultSousThematiqueOption = document.createElement('option');
    defaultSousThematiqueOption.text = 'Toutes les sous-thématiques';
    defaultSousThematiqueOption.value = '';

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

    const resetThematiquesSelect = () => {
        const sectionsToShow = Array.from(
            document.querySelectorAll(`.thematique`)
        );
        sectionsToShow.forEach(sectionToShow => {
            sectionToShow.style.display = 'block';
        });
    };

    const filterForSousThematique = ssthematique => {
        const parentThematique = findThematiqueForSousThematique(ssthematique);
        const sectionsSousThematiqueToHide = Array.from(
            document.querySelectorAll(
                `[data-thematique-id="${parentThematique.id}"] [data-sous-thematique-id]:not([data-sous-thematique-id="${ssthematique.id}"])`
            )
        );
        sectionsSousThematiqueToHide.forEach(sectionSousThematiqueToHide => {
            sectionSousThematiqueToHide.style.display = 'none';
        });
        const sectionsSousThematiqueToShow = Array.from(
            document.querySelectorAll(
                `[data-sous-thematique-id="${ssthematique.id}"]`
            )
        );
        sectionsSousThematiqueToShow.forEach(sectionSousThematiqueToShow => {
            sectionSousThematiqueToShow.style.display = 'block';
        });
    };

    const resetSousThematiquesSelect = () => {
        const sectionsToShow = Array.from(
            document.querySelectorAll(`.sous-thematique`)
        );
        sectionsToShow.forEach(sectionToShow => {
            sectionToShow.style.display = 'block';
        });
    };

    thematiquesSelect.addEventListener('change', e => {
        const value = e.currentTarget.value;
        const thematiqueToSelect = thematiques.find(
            thematique => thematique.id === value
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
        if (value === '') {
            resetThematiquesSelect();
            resetSousThematiquesSelect();
            sousThematiquesSelect.selectedIndex = 0;
            sousThematiquesSelect.disabled = true;
        }
    });
    sousThematiquesSelect.addEventListener('change', e => {
        const value = e.currentTarget.value;
        const sousThematiqueToSelect = sousThematiques.find(
            sousThematique => sousThematique.id === value
        );
        if (sousThematiqueToSelect) {
            filterForSousThematique(sousThematiqueToSelect);
        }
        if (value === '') {
            resetSousThematiquesSelect();
        }
    });

    const elementsToStick = Array.from(
        document.querySelectorAll('.thematique h2')
    );
    elementsToStick.forEach(elementToStick => {
        elementToStick.setAttribute(
            'data-margin-top',
            navContainer.offsetHeight
        );
    });

    const sticky = new Sticky('.thematique h2');
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initUI, 500);
});
