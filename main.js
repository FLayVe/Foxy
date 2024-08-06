//Made by Flayve


//NON PHONE
// Функція для визначення типу пристрою
function isPC() {
    return !/Mobi|Android/i.test(navigator.userAgent); // Якщо це не мобільний пристрій, то ПК
}
  
  // Основна функція для налаштування відображення
function setupDisplay() {
    const qrElement = document.querySelector('.main__qr');
    const elementsToHide = [
      '.main__home',
      '.main__boost',
      '.main__task',
      '.main__friend',
      '.main__user',
      '.main__roule',
      '.menu'
    ];
  
    if (isPC()) {
      // Для ПК
      qrElement.style.display = 'block'; // Робимо main__qr видимим
  
      // Приховуємо всі інші елементи
      elementsToHide.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
      });
  
      // Вихід з функції, щоб не виконувати подальший код
      return;
    }
  
    // Код для мобільних пристроїв
    qrElement.style.display = 'none'; // Сховуємо main__qr
}
  
// Виконання функції налаштування при завантаженні сторінки
window.addEventListener('load', () => {
    setupDisplay();
});
  
// Виконання функції налаштування при зміні розміру вікна
window.addEventListener('resize', setupDisplay);
  
// Виконання функції налаштування після завантаження DOM
document.addEventListener('DOMContentLoaded', setupDisplay);
  



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

//UserInfo init
const id = tgUserData ? tgUserData.id : 'test';
const docRef = doc(db, "users", `${id}`);

let docSnap = await getDoc(docRef);

if(!docSnap.exists()){

    await setDoc(docRef, {
        balance: 0,
        friends: 0,
        sub: false,
        tapFarm: 1,
        mineFarm: 1,
        lastClaim: serverTimestamp(),
        tasks: ["none"]
    })

    docSnap = await getDoc(docRef);
}

if(!docSnap.data().sub) {

    await updateDoc(docRef, {
        sub: false,
        tapFarm: 1,
        mineFarm: 1,
        lastClaim: serverTimestamp(),
        tasks: ["none"]
    })

    docSnap = await getDoc(docRef);
}

let balance = docSnap.data().balance;
let friends = docSnap.data().friends;
let sub = docSnap.data().sub;
let tapFarm = docSnap.data().tapFarm;
let mineFarm = docSnap.data().mineFarm;
let lastClaim = docSnap.data().lastClaim.toDate();
let tasks = docSnap.data().tasks;

//SUB

//Preloader Animation
setTimeout(function() {
    // Додаємо клас .delete до прелоадера
    document.querySelector('.main__preloader').classList.add('delete');

    
    // Після видалення прелоадера показуємо меню і головний контент
    setTimeout(function() {
        
        if(sub) {

            document.querySelector('.menu').classList.add('show');
            document.querySelector('.main__home').classList.add('show');

        }
        else {
            
            document.querySelector('.main__sub').classList.add('show');
            document.querySelector('.').classList.add('show');

        }
        
    
    }, 200); // Затримка для синхронізації з CSS анімацією (0.5 сек)
}, 300); // 3000 мілісекунд = 3 секунди

document.querySelector('.sub__btn').addEventListener('click', async () => {

    sub = true;

    await updateDoc(docRef, {
        sub: sub
    });

    window.open('https://t.me/+zlMgf3B-4j85OTAy', "_blank");
});


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


//Mining
const miningSpeed = 2 * 60 * 60;
let mineValue = mineFarm * 500;

const claimButton = document.querySelector('.mining__btn');
const timerDisplay = document.querySelector('.mining__time');
const miningProgress = document.querySelector('.mining__num');

claimButton.disabled = true;

function updateTimerDisplay(hours, minutes, seconds, mined) {
    timerDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;

    miningProgress.textContent = `${mined} / ${mineValue}`;
}

function buttonSetActive(active) {

    if(active){

        claimButton.disabled = false;
        claimButton.classList.add('active');
        claimButton.textContent = 'Claim';

        timerDisplay.textContent = '0h 0m 0s';
        miningProgress.textContent = `${mineValue} / ${mineValue}`;
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

        mined = parseInt((miningSpeed-timer)/miningSpeed*mineValue);
        
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

    balance += mineValue;
    updateBalanceDisplay();

    await updateDoc(docRef, {
        lastClaim: serverTimestamp(),
        balance: balance
    });

});

//Boosts

let _boost, _price;

function updateBoostLvlDisplay(){

    document.getElementById('Multitap_lvl').innerText = `Lvl. ${tapFarm}`;
    document.getElementById('Mining_lvl').innerText = `Lvl. ${mineFarm}`;

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
        
        case "Mining":
            return 2000 + 2000 * (mineFarm-1);
            break;

        default:
            break;
    }
}

async function updateBoost(boost, price){

    balance -= price;
    updateBalanceDisplay();

    switch (boost) {
        case "Multitap":
            tapFarm += 1;
            break;
        
        case "Mining":
            mineFarm += 1;
            mineValue += 500;
            break; 

        default:
            break;
    }

    updateBoostLvlDisplay();

    await updateDoc(docRef, {
        balance: balance,
        tapFarm: tapFarm,
        mineFarm: mineFarm
    });

}

boostButtons.forEach(button => {

    button.addEventListener('click', (event) => {

        popup.style.display = 'flex';
        popup.classList.add('open');
        
        
        _boost = button.getAttribute('data-boost');

        _price = getBoostPrice(_boost);

        document.querySelector('.popup__name p').innerText = button.querySelector('.boost__text').innerText;
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



//Tasks
const taskButtons = document.querySelectorAll('.task__btn');

taskButtons.forEach(task => {
    
    let uncompletedSVG = task.querySelector('.uncompleted-svg');
    let completedSVG = task.querySelector('.completed-svg');

    const taskId = task.getAttribute('id');

    if(tasks.includes(taskId)){

        task.disabled = true;

        uncompletedSVG.style.display = 'none';
        completedSVG.style.display = 'block';

    }
    else {

        let loadingSVG = task.querySelector('.loading-svg');
        let completed = false;

        task.addEventListener('click', () => {

            task.disabled = true;

            if(task.hasAttribute('link')) {

                completed = true;
                
                window.open(task.getAttribute('link'), "_blank");

            }

            if(task.hasAttribute('reqFriends')) {

                if(friends >= task.getAttribute('reqFriends')) { 
                    completed = true;
                }
                
            }

            uncompletedSVG.style.display = 'none';
            loadingSVG.style.display = 'block';
    
        })
    
        loadingSVG.addEventListener('animationend', async () => {
            
            loadingSVG.style.display = 'none';

            if (completed){

                completedSVG.style.display = 'block';
                
                const price = parseInt(task.getAttribute('price'));

                balance += price;
                tasks.push(taskId);

                updateBalanceDisplay();

                await updateDoc(docRef, {
                    balance: balance,
                    tasks: tasks
                }); 
            }
            else {

                uncompletedSVG.style.display = 'block';
                task.disabled = false;
            }
    
        })

    }
    
})

//friends

const RefLink = `https://t.me/testtfoxybot?start=${id}`

document.querySelector('.friend__invite-btn').addEventListener('click', () => {

    let text = 'Join to FOXY!!!'

    window.open(`https://t.me/share/url?url=${RefLink}&text=${text}`, "_blank");

})


//rulete

const userButtons = document.querySelectorAll('.user__btn');
const alert = document.querySelector('.alert__user');

userButtons.forEach(userButton => {

    userButton.addEventListener('click', function() {



        showAllert(alert);
    
        // document.querySelector('.main__roule').style.display = 'block';
        // document.querySelector('.main__user').style.display = 'none';
    })
})

alert.addEventListener('animationend', (event) => {
    if (event.animationName === 'alertSlideOut') {
        
        alert.classList.remove('close');
        alert.style.display = 'none';
    }
})
