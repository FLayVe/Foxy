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

const id = "2";
const docRef = doc(db, "users", `${id}`);

document.addEventListener("DOMContentLoaded", async function(){
    
    let docSnap = await getDoc(docRef);

    if (!docSnap.exists()){

        await setDoc(docRef, {
            balance: 0
        })

        docSnap = await getDoc(docRef);
    }
    //Database user ecists

    let coinPerTap = 1;
    let energyPerSec = 1;
    let energyCur = 100;
    let energyMax = 100;
    let balance = docSnap.data().balance;

    const coin = document.getElementById('coin');
    const balanceText = document.getElementById('balance');
    const energyCurText = document.getElementById('energy_cur');
    const energyMaxText = document.getElementById('energy_max');
    const energyBar = document.getElementById('energy_fill');

    function startConfig(){

        updateBalanceText(balance);
        updateEnergyText(energyCur); 
        energyMaxText.textContent = energyMax;

    }

    function updateEnergyText(newEnergy){
        energyCurText.textContent = newEnergy;
        const energyPercents = (newEnergy/energyMax) * 100;
        energyBar.style.width = `${energyPercents}%`;
    }

    function updateBalanceText(newBalance) {
        balanceText.textContent = newBalance;
    }

    function createFloatingText(text, x, y){

        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;
        document.body.appendChild(floatingText);

        setTimeout(() => {
            floatingText.remove();
        }, 1000);

    }

    coin.addEventListener('click', function(event){

        if (energyCur > 0){
            energyCur -= coinPerTap;
            balance += coinPerTap;

            updateBalanceText(balance);
            updateEnergyText(energyCur);

            const rect = coin.getBoundingClientRect();
            const x = event.pageX;
            const y = event.pageY;
            createFloatingText(`+${coinPerTap}`, x, y);
        }

    }) //coinTap

    function charging(){

        if(energyCur < energyMax) {

            energyCur += energyPerSec;

            updateEnergyText(energyCur);

        }
    }

    async function updateDatabase(){

        await updateDoc(docRef, {
            balance: balance
        })

    }

    setInterval(charging, 1000);
    setInterval(updateDatabase, 2000);

    startConfig();
})

