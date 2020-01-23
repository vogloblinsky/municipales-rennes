document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('hello');
        const navContainer = document.querySelector('.nav-container');
        const mainContainer = document.querySelector('.main-container');
        mainContainer.style.top = navContainer.offsetHeight + 'px';

        const candidatBlocks = Array.from(
            mainContainer.querySelectorAll('article')
        );
        candidatBlocks.map(candidatBlock => {
            candidatBlock.style.width = mainContainer.offsetWidth + 'px';
        });
    }, 500);
});
