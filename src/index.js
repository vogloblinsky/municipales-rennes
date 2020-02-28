import sousThematiques from './_data/sous-thematiques.json';

import candidats from './_data/candidats-light.json';

import thematiques from './_data/thematiques-et-sous-thematiques.json';

import Sticky from 'sticky-js';

import bsn from 'bootstrap.native/dist/bootstrap-native-v4_light';

const findThematiqueForSousThematique = sousThematiqueToFind => {
    let finalThematique;
    thematiques.forEach(thematique => {
        if (thematique['sous-thematiques']) {
            thematique['sous-thematiques'].forEach(sousThematique => {
                if (sousThematique && sousThematique.id === sousThematiqueToFind.id) {
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

    /**
     * Update mainContainer top position
     */
    mainContainer.style.top = navContainer.offsetHeight + 'px';

    /**
     * Update candidat column width
     */
    const candidatBlocks = Array.from(mainContainer.querySelectorAll('article'));
    candidatBlocks.forEach(candidatBlock => {
        if (mainContainerWidth > maxWidthCandidatBlock) {
            currentWidthForCandidat = maxWidthCandidatBlock;
        } else {
            currentWidthForCandidat = mainContainerWidth;
        }
        candidatBlock.style.width = currentWidthForCandidat + 'px';
    });

    /**
     * Update candidat header column width
     */

    const candidatHeaderBlocks = Array.from(candidatsList.querySelectorAll('header'));
    candidatHeaderBlocks.forEach(candidatHeaderBlock => {
        candidatHeaderBlock.style.flex = `0 0 ${currentWidthForCandidat - 1}px`; // -1 for border-right
    });

    /**
     * Manage slide buttons
     */

    let currentCandidatIndex = 0;
    const nbCandidats = candidatBlocks.length;
    const leftButton = document.querySelectorAll('.second-nav__right .button')[0];
    const rightButton = document.querySelectorAll('.second-nav__right .button')[1];

    const disableSlideButtons = () => {
        leftButton.classList.add('disabled');
        rightButton.classList.add('disabled');
    };

    const activateSlideButtons = () => {
        if (currentCandidatIndex > 0 && currentCandidatIndex < nbCandidats - 1) {
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

    const hideAllH2 = () => {
        const allh2 = Array.from(document.querySelectorAll('article h2 span'));
        allh2.forEach(h2 => {
            h2.style.visibility = 'hidden';
        });
        const allh2Icons = Array.from(document.querySelectorAll('article h2 ion-icon'));
        allh2Icons.forEach(icon => {
            icon.style.visibility = 'hidden';
        });
    };

    const showForCurrentIndex = index => {
        const h2s = Array.from(document.querySelectorAll(`.candidats-wrapper article:nth-child(${index + 1}) h2 span`));
        h2s.forEach(h2 => {
            h2.style.visibility = 'visible';
        });
        const icons = Array.from(
            document.querySelectorAll(`.candidats-wrapper article:nth-child(${index + 1}) h2 ion-icon`)
        );
        icons.forEach(icon => {
            icon.style.visibility = 'visible';
        });
    };

    const translateCandidats = e => {
        if (e.currentTarget.classList.contains('disabled')) return;
        const direction = parseInt(e.currentTarget.getAttribute('data-direction'));
        if (direction === 1) {
            currentCandidatIndex += 1;
        } else {
            currentCandidatIndex -= 1;
        }
        if (currentCandidatIndex >= coundVisibleCandidats()) {
            currentCandidatIndex = coundVisibleCandidats() - 1;
        }

        mainContainer.scrollLeft = currentCandidatIndex * currentWidthForCandidat;
        candidatsList.scrollLeft = currentCandidatIndex * currentWidthForCandidat;

        activateSlideButtons();

        //Manage h2s
        hideAllH2();
        showForCurrentIndex(currentCandidatIndex);
    };

    leftButton.addEventListener('click', translateCandidats);
    rightButton.addEventListener('click', translateCandidats);

    /**
     * Update cells lines and height for each sous-thematiques
     */

    const updateCellsHeight = () => {
        sousThematiques.forEach(sousThematique => {
            const allSectionsForSousThematique = Array.from(
                document.querySelectorAll(`article.visible [data-sous-thematique-id=${sousThematique.id}]`)
            );
            let maxHeight = 0;
            allSectionsForSousThematique.forEach(sectionSousThematique => {
                const h3Height = sectionSousThematique.querySelector('h3').offsetHeight;
                const propositions = sectionSousThematique.querySelector('.propositions');
                let propositionsHeight = 0;
                if (propositions) {
                    propositionsHeight = propositions.offsetHeight;
                }
                if (h3Height + propositionsHeight > maxHeight) {
                    maxHeight = h3Height + propositionsHeight;
                }
            });
            allSectionsForSousThematique.forEach(sectionSousThematique => {
                sectionSousThematique.style.height = maxHeight + 'px';
            });
        });
    };
    updateCellsHeight();

    /**
     * Shuffle order of candidats
     */
    const candidatsListHeader = document.querySelector('.candidats-list');
    let i = 0;
    for (i; i < candidatsListHeader.children.length; i++) {
        const shuffleOrder = (Math.random() * i) | 0;
        candidatsListHeader.appendChild(candidatsListHeader.children[shuffleOrder]);
    }

    const shuffleOrderedCandidats = Array.from(document.querySelectorAll('.candidats-list header'));
    shuffleOrderedCandidats.forEach((candidatHeader, shuffleIndex) => {
        candidats.forEach((candidat, initialIndex) => {
            if (candidatHeader.getAttribute('data-candidatid') === candidat.id) {
                candidat.initialOrder = initialIndex;
                candidat.shuffleOrder = shuffleIndex;
            }
        });
    });

    const candidatsListWrapper = document.querySelector('.candidats-wrapper');
    const candidatsListFilter = document.querySelector('.selector-nav .container');
    let candidatsShuffleSorted = [];
    candidats.forEach(candidat => {
        candidatsShuffleSorted[candidat.shuffleOrder] = candidat;
    });
    candidatsShuffleSorted.forEach((candidat, index) => {
        const currentCandidatNodeInList = candidatsListWrapper.querySelector(`[data-candidatid=${candidat.id}]`);
        candidatsListWrapper.appendChild(currentCandidatNodeInList);
        const currentCandidatNodeInFilterList = candidatsListFilter.querySelector(`[data-candidatid=${candidat.id}]`);
        candidatsListFilter.appendChild(currentCandidatNodeInFilterList);
    });

    /**
     * Manage thematiques selector
     */

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
            document.querySelectorAll(`[data-thematique-id]:not([data-thematique-id="${thematique.id}"])`)
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
        const sectionsToShow = Array.from(document.querySelectorAll(`.thematique`));
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
            document.querySelectorAll(`[data-sous-thematique-id="${ssthematique.id}"]`)
        );
        sectionsSousThematiqueToShow.forEach(sectionSousThematiqueToShow => {
            sectionSousThematiqueToShow.style.display = 'block';
        });
    };

    const resetSousThematiquesSelect = () => {
        const sectionsToShow = Array.from(document.querySelectorAll(`.sous-thematique`));
        sectionsToShow.forEach(sectionToShow => {
            sectionToShow.style.display = 'block';
        });
    };

    thematiquesSelect.addEventListener('change', e => {
        const value = e.currentTarget.value;
        const thematiqueToSelect = thematiques.find(thematique => thematique.id === value);
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
        const sousThematiqueToSelect = sousThematiques.find(sousThematique => sousThematique.id === value);
        if (sousThematiqueToSelect) {
            filterForSousThematique(sousThematiqueToSelect);
        }
        if (value === '') {
            resetSousThematiquesSelect();
        }
    });

    /**
     * Stick
     */

    const elementsToStick = Array.from(document.querySelectorAll('.thematique h2'));
    elementsToStick.forEach(elementToStick => {
        elementToStick.setAttribute('data-margin-top', navContainer.offsetHeight);
    });

    const sticky = new Sticky('.thematique h2');

    /**
     * Candidats selector
     */
    const selectorCandidats = document.querySelector('.selector-nav');
    const selectorCandidatsContainer = document.querySelector('.selector-nav .container');

    const mainNav = document.querySelector('.main-nav');
    const secondNav = document.querySelector('.second-nav');

    let candidatsSelectorStatus = {};

    candidats.forEach(candidat => {
        candidatsSelectorStatus[candidat.id] = true;
    });

    selectorCandidats.style.top = mainNav.offsetHeight + secondNav.offsetHeight + 'px';
    selectorCandidats.style.height = 'calc( 100% - ' + (mainNav.offsetHeight + secondNav.offsetHeight) + 'px)';

    if (!mainContainerWidth > maxWidthCandidatBlock) {
        selectorCandidatsContainer.style.flex = `0 0 ${mainContainerWidth}px`;
    }

    let selectorCandidatsVisible = false;
    const toggleSelectorCandidats = () => {
        if (selectorCandidatsVisible) {
            selectorCandidats.style.display = 'none';
            selectorCandidatsVisible = false;
        } else {
            selectorCandidats.style.display = 'flex';
            selectorCandidatsVisible = true;
        }
    };

    document.querySelector('.selector-button').addEventListener('click', toggleSelectorCandidats);

    const coundVisibleCandidats = () => {
        let count = 0;
        Object.keys(candidatsSelectorStatus).forEach(key => {
            if (candidatsSelectorStatus[key]) {
                count += 1;
            }
        });
        return count;
    };

    const expandColumnsForVisibleCandidats = () => {
        const currentWidth = mainContainerWidth;
        const countVisibleCandidats = coundVisibleCandidats();
        const widthPerCandidat = currentWidth / countVisibleCandidats;

        const candidatHeaders = document.querySelectorAll('.candidats-list header');
        candidatHeaders.forEach(candidatHeader => {
            candidatHeader.style.flex = `0 0 ${widthPerCandidat}px`;
        });
        const candidatArticles = document.querySelectorAll('.main-container article');
        candidatArticles.forEach(candidatHeader => {
            candidatHeader.style.width = `${widthPerCandidat}px`;
        });
        updateCellsHeight();
        sticky.update();
    };

    const resetColumnsToDefaultWidth = () => {
        const widthPerCandidat = currentWidthForCandidat;
        const candidatHeaders = document.querySelectorAll('.candidats-list header');
        candidatHeaders.forEach(candidatHeader => {
            candidatHeader.style.flex = `0 0 ${widthPerCandidat}px`;
        });
        const candidatArticles = document.querySelectorAll('.main-container article');
        candidatArticles.forEach(candidatHeader => {
            candidatHeader.style.width = `${widthPerCandidat}px`;
        });
        updateCellsHeight();
        sticky.update();
    };

    const toggleCandidat = e => {
        const candidatId = e.currentTarget.getAttribute('data-candidatid');
        const icon = e.currentTarget.querySelector('ion-icon');

        const candidatColumn = document.querySelector(`article[data-candidatid="${candidatId}"]`);
        const candidatHeader = document.querySelector(`.candidats-list header[data-candidatid="${candidatId}"]`);

        if (candidatsSelectorStatus[candidatId]) {
            candidatsSelectorStatus[candidatId] = false;
            icon.setAttribute('name', 'close-circle-outline');
            candidatColumn.style.display = 'none';
            candidatHeader.style.display = 'none';
            candidatColumn.classList.add('hidden');
            candidatColumn.classList.remove('visible');
        } else {
            candidatsSelectorStatus[candidatId] = true;
            icon.setAttribute('name', 'checkmark-circle-outline');
            candidatColumn.style.display = 'flex';
            candidatHeader.style.display = 'flex';
            candidatColumn.classList.add('visible');
            candidatColumn.classList.remove('hidden');
        }

        const countVisibleCandidats = coundVisibleCandidats();
        if (countVisibleCandidats === 1) {
            disableSlideButtons();
        } else if (countVisibleCandidats > 1) {
            activateSlideButtons();
        }

        // Resize columns ?
        const totalWidthForVisibleCandidats = countVisibleCandidats * currentWidthForCandidat;
        if (totalWidthForVisibleCandidats < mainContainerWidth && countVisibleCandidats > 1) {
            expandColumnsForVisibleCandidats();
        } else {
            resetColumnsToDefaultWidth();
        }
    };

    const candidatsCheckmarks = Array.from(document.querySelectorAll('.selector-nav header'));
    candidatsCheckmarks.forEach(candidatsCheckmark => {
        candidatsCheckmark.addEventListener('click', toggleCandidat);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initUI, 500);
});
