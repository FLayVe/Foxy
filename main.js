//Firebase API init
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
import { getFirestore, getDoc, setDoc, updateDoc, doc} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyAUI8QNrMEUThGnw-jhZabju1eEGKwXofg",
    authDomain: "tg-foxycoin-104cf.firebaseapp.com",
    databaseURL: "https://tg-foxycoin-104cf-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tg-foxycoin-104cf",
    storageBucket: "tg-foxycoin-104cf.appspot.com",
    messagingSenderId: "319412978831",
    appId: "1:319412978831:web:3ff2bb63f6c479b12cdcfa"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

//Telegram API init
let WebApp = window.Telegram.WebApp;
const tgUserData = WebApp.initDataUnsafe.user;


//Navigation
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

//Preloader Animation
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



//UserInfo init
const id = tgUserData ? tgUserData.id : 'test';
const docRef = doc(db, "users", `${id}`);

let docSnap = await getDoc(docRef);

if(!docSnap.exists()){

    await setDoc(docRef, {
        balance: 0,
        friends: 0,
        tapFarm: 1,
        farmSpeed: 500
    })

    docSnap = await getDoc(docRef);
}

let balance = docSnap.data().balance;
let friends = docSnap.data().friends;
let tapFarm = docSnap.data().tapFarm;
let farmSpeed = docSnap.data().farmSpeed;

//set Username Friends
let usernameText = document.querySelectorAll('.name');
usernameText.forEach(username => {
    username.innerText = tgUserData ? tgUserData.first_name : `test`;
});

document.querySelector('.friends__num').textContent = friends;

//Display Functions
const tapButton = document.querySelector('.tap__btn');
const balanceText = document.querySelectorAll('.balance__num');

function updateBalanceDisplay() {

    balanceText.forEach(_balanceText => {
        _balanceText.textContent = balance.toLocaleString('uk-UA');
    })

}


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


//Database Functions

//update balance in database
setInterval(async function() {

    await updateDoc(docRef, {
        balance: balance
    })

}, 2000) // 2 sec