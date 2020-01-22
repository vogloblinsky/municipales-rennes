document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('hello');
        const navContainer = document.querySelector('.nav-container');
        const mainContainer = document.querySelector('.main-container');
        mainContainer.style.top = navContainer.offsetHeight + 'px';
    }, 500);
});
