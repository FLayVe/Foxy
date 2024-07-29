//Firebase API init
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'
import { getFirestore, getDoc, setDoc, updateDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'

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
        mineFarm: 500,
        lastClaim: serverTimestamp()
    })

    docSnap = await getDoc(docRef);
}

let balance = docSnap.data().balance;
let friends = docSnap.data().friends;
let tapFarm = docSnap.data().tapFarm;
let mineFarm = docSnap.data().mineFarm;
let lastClaim = docSnap.data().lastClaim.toDate();

//set Username Friends
let usernameText = document.querySelectorAll('.name');
usernameText.forEach(username => {
    username.innerText = tgUserData ? tgUserData.first_name : `test`;
});

document.querySelector('.friends__num').textContent = friends;

//Tap Farming
const tapButton = document.querySelector('.tap__btn');
const balanceText = document.querySelectorAll('.balance__num');

function updateBalanceDisplay() {

    balanceText.forEach(_balanceText => {
        _balanceText.textContent = balance.toLocaleString('uk-UA');
    })

}

let BalanceSaveTimeout;
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

    clearTimeout(BalanceSaveTimeout);

    BalanceSaveTimeout = setTimeout(async () => {

        await updateDoc(docRef, {
            balance: balance
        });

    }, 1500); // 1.5 sec
});


//Boosts

const boostButtons = document.querySelectorAll('.boost__btn');
const popup = document.querySelector('.popup__boost');

function getBoostPrice(boost) {
    switch (boost) {
        case "Multitap":
            return 3000 
            break;
    
        default:
            break;
    }
}

function updateBoost(boost, price, lvl){

}

boostButtons.forEach(button => {

    const boost = button.getAttribute('data-boost');
    const name = button.getElementById('boost__text').textContent;
    const lvl = button.getElementById('boost__lvl');
    const price = getBoostPrice(boost);

    popup.getElementById('popup__name').innerText = name;
    popup.getElementById('popup__price').innerText = price;

    popup.getElementById('popup__boost-btn').addEventListener('click', (event) => {

        popup.classList.remove(show);

        updateBoost(boost, price, lvl);

    });
})


//Mining
const miningSpeed = 2 * 60 * 60;

const claimButton = document.querySelector('.mining__btn');
const timerDisplay = document.querySelector('.mining__time');
const miningProgress = document.querySelector('.mining__num');

claimButton.disabled = true;

function updateTimerDisplay(hours, minutes, seconds, mined) {
    timerDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;

    miningProgress.textContent = `${mined} / ${mineFarm}`;
}

function buttonSetActive(active) {

    if(active){

        claimButton.disabled = false;
        claimButton.classList.add('active');
        claimButton.textContent = 'Claim';

        timerDisplay.textContent = '0h 0m 0s';
        miningProgress.textContent = `${mineFarm} / ${mineFarm}`;
    }
    else {
        
        claimButton.disabled = true;
        claimButton.classList.remove('active');
        claimButton.textContent = 'Mining...';

    }

}

function startTimer(duration) {

    let timer = duration;

    let hours, minutes, seconds, mined;

    const interval = setInterval(() => {

        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        mined = parseInt((miningSpeed-timer)/miningSpeed*mineFarm);
        
        updateTimerDisplay(hours, minutes, seconds, mined);

        if (--timer < 0) {

            clearInterval(interval);

            buttonSetActive(true);
        }

    }, 1000); //1 sec
}

function resetTimer() {

    const duration = miningSpeed;

    buttonSetActive(false);

    startTimer(duration);

}

const now = new Date();
const timeSinceLastClaim = Math.floor((now - lastClaim) / 1000);
const timeLeft = miningSpeed - timeSinceLastClaim;

if (timeLeft > 0) {

    startTimer(timeLeft);

} else {

    buttonSetActive(true);
}

claimButton.addEventListener('click', async () => {

    lastClaim = new Date();
    resetTimer();

    balance += mineFarm;
    updateBalanceDisplay();

    await updateDoc(docRef, {
        lastClaim: serverTimestamp(),
        balance: balance
    });

});