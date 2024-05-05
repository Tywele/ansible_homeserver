let page = document.getElementById('page_wrapper');

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    page.classList.remove('light');
    page.classList.add('dark');
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    page.classList.remove('dark');
    page.classList.add('light');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if ( event.matches ) {
        page.classList.remove('light');
        page.classList.add('dark');
    } else {
        page.classList.remove('dark');
        page.classList.add('light');
    }
});