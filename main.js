

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav__link');
    const userLinks = document.querySelectorAll('.main__user-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = link.getAttribute('data-target');
            showPage(target);
            setActiveLink(link);
        });
    });

    userLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            showPage('main__user');
            setActiveLink(null);
        });
    });

    function showPage(className) {
        let pages = document.querySelectorAll('main');
        pages.forEach(page => {
            if (page.classList.contains(className)) {
                page.style.display = 'block';
            } else {
                page.style.display = 'none';
            }
        });
    }

    function setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});












document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav__link');

    function setActiveLink(activeLink) {
        links.forEach(link => {
            if (link === activeLink) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveLink(link);
        });
    });

    if (links.length > 0) {
        setActiveLink(links[0]);
    }
});

 // Затримка в 3 секунди перед додаванням класу .delete
 setTimeout(function() {
    // Додаємо клас .delete до прелоадера
    document.querySelector('.main__preloader').classList.add('delete');
    
    // Після видалення прелоадера показуємо меню і головний контент
    setTimeout(function() {
        document.querySelector('.menu').classList.add('show');
        document.querySelector('.main__home').classList.add('show');
    }, 500); // Затримка для синхронізації з CSS анімацією (0.5 сек)
}, 300); // 3000 мілісекунд = 3 секунди








document.getElementById('roulete').addEventListener('click', function() {
    document.querySelector('.main__roule').style.display = 'block';
    document.querySelector('.main__user').style.display = 'none';
});




// ЗАБОРОНА КОПІЮВАННЯ ТЕКСТУ 

  document.addEventListener('DOMContentLoaded', function() {
            function preventTextSelection(event) {
                event.preventDefault();
            }


            document.addEventListener('mousedown', preventTextSelection);


            document.addEventListener('keydown', function(event) {
                if (event.key === 'Control' || event.key === 'Shift') {
                    document.addEventListener('mouseup', preventTextSelection);
                }
            });
        });

  
