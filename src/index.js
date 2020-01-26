import thematiques from './_data/thematiques.json';
import sousThematiques from './_data/sous-thematiques.json';

console.log(sousThematiques);

const initUI = () => {
    const maxWidthCandidatBlock = 380;
    let currentWidthForCandidat = 0;

    const navContainer = document.querySelector('.nav-container');
    const mainContainer = document.querySelector('.main-container');

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
        console.log(maxHeight);
        allSectionsForSousThematique.forEach(sectionSousThematique => {
            sectionSousThematique.style.height = maxHeight + 'px';
        });
        console.log(allSectionsForSousThematique);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initUI, 500);
});
