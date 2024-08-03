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
        document.querySelector('.main__home').classList.add('show');
    }, 500); // Затримка для синхронізації з CSS анімацією (0.5 сек)
}, 300); // 3000 мілісекунд = 3 секунди


document.getElementById('roulete').addEventListener('click', function() {
    document.querySelector('.main__roule').style.display = 'block';
    document.querySelector('.main__user').style.display = 'none';
});



document.getElementById('toggleButton').addEventListener('click', function() {
    var mainSub = document.querySelector('.main__sub');
    var menu = document.querySelector('.menu');

    if (mainSub.classList.contains('none')) {
        mainSub.classList.remove('none');
        menu.classList.remove('show');
    } else {
        mainSub.classList.add('none');
        menu.classList.add('show');
    }
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
        lastClaim: serverTimestamp(),
        tasks: ["none"]
    })

    docSnap = await getDoc(docRef);
}

let balance = docSnap.data().balance;
let friends = docSnap.data().friends;
let tapFarm = docSnap.data().tapFarm;
let mineFarm = docSnap.data().mineFarm;
let lastClaim = docSnap.data().lastClaim.toDate();
let tasks = docSnap.data().tasks;

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

let _boost, _price;

function updateBoostLvlDisplay(){

    document.getElementById('Multitap_lvl').innerText = `Lvl. ${tapFarm}`;

}

updateBoostLvlDisplay();

const boostButtons = document.querySelectorAll('.boost__btn');
const popup = document.querySelector('.popup__boost');
const alertSuccess = document.querySelector('.alert-success');
const alertError = document.querySelector('.alert-error');

document.querySelectorAll('.alert__boost').forEach( alert => {

    alert.addEventListener('animationend', (event) => {
        if (event.animationName === 'alertSlideOut') {
            
            alert.classList.remove('close');
            alert.style.display = 'none';
        }
    })
})

function showAllert(alert){

    alert.style.display = 'flex';
    alert.classList.add('open');

    setTimeout(function() {

        alert.classList.remove('open');
        alert.classList.add('close');

    }, 2000) // 2 sec

}

function getBoostPrice(boost) {
    switch (boost) {
        case "Multitap":
            return parseInt(250 * Math.pow(2, tapFarm-1), 10);
            break;
        
        case "Mine100":
            return 300;
            break;

        default:
            break;
    }
}

async function updateBoost(boost, price){

    console.log(boost);

    balance -= price;
    updateBalanceDisplay();

    switch (boost) {
        case "Multitap":
            tapFarm += 1;
            break;
            
        default:
            break;
    }

    updateBoostLvlDisplay();

    await updateDoc(docRef, {
        balance: balance,
        tapFarm: tapFarm
    });

}

boostButtons.forEach(button => {

    button.addEventListener('click', (event) => {

        popup.style.display = 'flex';
        popup.classList.add('open');
        
        
        _boost = button.getAttribute('data-boost');

        _price = getBoostPrice(_boost);

        console.log(_boost);

        document.querySelector('.popup__name p').innerText = _boost;
        document.querySelector('.popup__price p').innerText = _price;
    })
})

document.querySelector('.popup__boost-btn').addEventListener('click', (event) => {

    if(balance >= _price){

        popup.classList.remove('open');
        popup.classList.add('close');

        showAllert(alertSuccess);

        updateBoost(_boost, _price);
    }
    else {
        showAllert(alertError);
    }

});

document.querySelector('.close__popup-boost').addEventListener('click', (event) => {

    popup.classList.remove('open');
    popup.classList.add('close');

})

popup.addEventListener('animationend', (event) => {

    if (event.animationName === 'popupSlideOut') {
        
        popup.classList.remove('close');
        popup.style.display = 'none';
    }
});



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

//Tasks
const taskButtons = document.querySelectorAll('.task__btn');

function updateTaskDisplay(task){

    task.disabled = true;

    task.querySelector('.uncompleted-svg').style.display = 'none';
    task.querySelector('.completed-svg').style.display = 'block';

}

taskButtons.forEach(task => {

    const taskId = task.getAttribute('id');

    if(tasks.includes(taskId)){

        updateTaskDisplay(task);

    }
    else{

        task.addEventListener('click', async () => {

            const price = parseInt(task.getAttribute('price'), 10);
            
            balance += price;
            tasks.push(taskId);

            updateBalanceDisplay();
            updateTaskDisplay(task);

            await updateDoc(docRef, {
                balance: balance,
                tasks: tasks
            })
            
        })

    }
    
})