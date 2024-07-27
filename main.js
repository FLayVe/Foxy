

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
}, 3000); // 3000 мілісекунд = 3 секунди








document.getElementById('roulete').addEventListener('click', function() {
    document.querySelector('.main__roule').style.display = 'block';
    document.querySelector('.main__user').style.display = 'none';
});



// document.querySelector('.spin__btn').addEventListener('click', function() {
//     const roulette = document.querySelector('.spin');
//     const spinCards = document.querySelectorAll('.spin__card');
//     const spinCount = spinCards.length;
    
//     // Встановлюємо випадкове значення обертання
//     const spinDegree = Math.floor(Math.random() * spinCount * 360);

//     // Задаємо стиль для обертання
//     roulette.style.transform = `rotate(${spinDegree}deg)`;

//     // Відновлюємо початковий стан після завершення обертання
//     setTimeout(() => {
//         roulette.style.transform = 'none';
//     }, 5000); // 5 секунд
// });





let tapFarm = 2;
let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 4957829;
const tapButton = document.querySelector('.tap__btn');
const tapContainer = document.getElementById('tap-container');
const balanceNum = document.querySelector('.balance__num');

// Функція для оновлення відображення балансу
function updateBalanceDisplay() {
    balanceNum.textContent = balance.toLocaleString('uk-UA');
}

// Оновлення відображення балансу при завантаженні сторінки
updateBalanceDisplay();

tapButton.addEventListener('click', (event) => {
    const tapNumber = document.createElement('div');
    tapNumber.classList.add('tap-number');
    tapNumber.textContent = tapFarm;

    // Отримання координат кліку відносно кнопки
    const rect = tapButton.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Додавання випадкового розкиду до координат
    const randomOffsetX = (Math.random() - 0.5) * 50; // випадковий розкид по осі X
    const randomOffsetY = (Math.random() - 0.5) * 50; // випадковий розкид по осі Y

    // Встановлення координат для нового елемента
    tapNumber.style.left = `${rect.left + x + randomOffsetX}px`;
    tapNumber.style.top = `${rect.top + y + randomOffsetY}px`;

    document.body.appendChild(tapNumber);

    // Видалення елемента після завершення анімації
    tapNumber.addEventListener('animationend', () => {
        document.body.removeChild(tapNumber);
    });

    // Додавання значення tapFarm до балансу
    balance += tapFarm;
    updateBalanceDisplay();

    // Збереження балансу в localStorage
    localStorage.setItem('balance', balance);
});
