document.addEventListener('DOMContentLoaded', function(){

    const coin = document.getElementById('coin');
    const balanceText = document.getElementById('balance');
    const energyCurText = document.getElementById('energy_cur');
    const energyMaxText = document.getElementById('energy_max');
    const energyBar = document.getElementById('energy_fill');

    const coinPerTap = 1;
    const energyPerSec = 1;

    const energyMax = parseInt(energyMaxText.textContent);
    let energyCur = parseInt(energyCurText.textContent);
    let balance = parseInt(balanceText.textContent);


    function updateEnergy(newEnergy){
        energyCurText.textContent = newEnergy;
        const energyPercents = (newEnergy/energyMax) * 100;
        energyBar.style.width = `${energyPercents}%`;
    }

    function updateBalance(newBalance) {
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

        if (energyCur>0){
            energyCur -= coinPerTap;
            balance += coinPerTap;

            updateBalance(balance);
            updateEnergy(energyCur);

            const rect = coin.getBoundingClientRect();
            const x = event.pageX;
            const y = event.pageY;
            createFloatingText(`+${coinPerTap}`, x, y);
        }

    })

    function charging(){
        if(energyCur < energyMax) {

            energyCur += energyPerSec;

            updateEnergy(energyCur);

        }
    }

    setInterval(charging, 1000);
})