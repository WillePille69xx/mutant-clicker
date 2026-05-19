/* Med document.queryselector(selector) kan vi hämta
 * de element som vi behöver från html dokumentet.
 * Vi spearar elementen i const variabler då vi inte kommer att
 * ändra dess värden.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * Viktigt: queryselector ger oss ett html element eller flera om det finns.
 */
const clickerButton = document.querySelector('#game-button');
const moneyTracker = document.querySelector('#money');
const mpsTracker = document.querySelector('#mps'); // money per second
const mpcTracker = document.querySelector('#mpc'); // money per click
const upgradesTracker = document.querySelector('#upgrades');
const upgradeList = document.querySelector('#upgradelist');
const msgbox = document.querySelector('#msgbox');
const audioAchievement = document.querySelector('#swoosh');

/* Följande variabler använder vi för att hålla reda på hur mycket pengar som
 * spelaren, har och tjänar.
 * last används för att hålla koll på tiden.
 * För dessa variabler kan vi inte använda const, eftersom vi tilldelar dem nya
 * värden, utan då använder vi let.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
 */
let money = 0;
let moneyPerClick = 1;
let moneyPerSecond = 0;
let acquiredUpgrades = 0;
let last = 0;
let numberOfClicks = 0; // hur många gånger har spelare eg. klickat
let active = false; // exempel för att visa att du kan lägga till klass för att indikera att spelare får valuta

// likt upgrades skapas här en array med objekt som innehåller olika former
// av achievements.
// requiredSOMETHING är vad som krävs för att få dem

let achievements = [
    {
        description: 'Gene Splicer has been unlocked, let the experiments begin!',
        requiredUpgrades: 1,
        acquired: false,
    },
    {
        description: 'The first mutant is alive, you’re on your way!',
        requiredUpgrades: 5,
        acquired: false,
    },
    {
        description: 'Mutant Army Recruiter, you’re getting stronger!',
        requiredUpgrades: 20,
        acquired: false,
    },
    {
        description: 'A true mad scientist, the lab is thriving!',
        requiredUpgrades: 50,
        acquired: false,
    },
    {
        description: 'Unleashed chaos, mutants everywhere!',
        requiredClicks: 1000,
        acquired: false,
    },
    {
        description: 'You’ve mutated your first creature into a beast!',
        requiredClicks: 5000,
        acquired: false,
    },
    {
        description: 'Genetic Overlord, your mutant army grows!',
        requiredClicks: 15000,
        acquired: false,
    },
    {
        description: 'World Destruction is within your reach!',
        requiredClicks: 50000,
        acquired: false,
    },
    {
        description: 'Pure Evil, the lab has reached maximum chaos!',
        requiredUpgrades: 100,
        acquired: false,
    },
    {
        description: 'Cosmic Mutation! You’ve unlocked the ultimate DNA formula!',
        requiredUpgrades: 200,
        acquired: false,
    },
    {
        description: 'You’re a true master of genetic manipulation!',
        requiredMoney: 1000000,
        acquired: false,
    },
    {
        description: 'Rookie achievement, you’ve clicked the button!',
        requiredClicks: 1,
        acquired: false,
    },
    {
        description: 'You’re getting up in the world!',
        requiredMoney: 100,
        acquired: false,
    },
    {
        description: 'Wow, you’re pretty good!',
        requiredMoney: 1000,
        acquired: false,
    },
    {
        description: 'lol, 69',
        requiredMoney: 69,
        acquired: false,
    },
    {
        description: 'Guess what? You’re a pro!',
        requiredMoney: 50000,
        acquired: false,
    },
];


/* Med ett valt element, som knappen i detta fall så kan vi skapa listeners
 * med addEventListener så kan vi lyssna på ett specifikt event på ett html-element
 * som ett klick.
 * Detta kommer att driva klickerknappen i spelet.
 * Efter 'click' som är händelsen vi lyssnar på så anges en callback som kommer
 * att köras vi varje klick. I det här fallet så använder vi en anonym funktion.
 * Koden som körs innuti funktionen är att vi lägger till moneyPerClick till
 * money.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
clickerButton.addEventListener(
    'click',
    () => {
        // vid click öka score med moneyPerClick
        money += moneyPerClick;
        // håll koll på hur många gånger spelaren klickat
        numberOfClicks += 1;
        // console.log(clicker.score);
    },
    false
);

/* För att driva klicker spelet så kommer vi att använda oss av en metod som heter
 * requestAnimationFrame.
 * requestAnimationFrame försöker uppdatera efter den refresh rate som användarens
 * maskin har, vanligtvis 60 gånger i sekunden.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 * funktionen step används som en callback i requestanaimationframe och det är
 * denna metod som uppdaterar webbsidans text och pengarna.
 * Sist i funktionen så kallar den på sig själv igen för att fortsätta uppdatera.
 */
function step(timestamp) {
    moneyTracker.textContent = Math.round(money);
    mpsTracker.textContent = moneyPerSecond;
    mpcTracker.textContent = moneyPerClick;
    upgradesTracker.textContent = acquiredUpgrades;

    if (timestamp >= last + 1000) {
        money += moneyPerSecond;
        last = timestamp;
    }

    if (moneyPerSecond > 0 && !active) {
        mpsTracker.classList.add('active');
        active = true;
    }

    // achievements, utgår från arrayen achievements med objekt
    // koden nedan muterar (ändrar) arrayen och tar bort achievements
    // som spelaren klarat
    // villkoren i första ifsatsen ser till att achivments som är klarade
    // tas bort. Efter det så kontrolleras om spelaren har uppfyllt kriterierna
    // för att få den achievement som berörs.
    achievements = achievements.filter((achievement) => {
        if (achievement.acquired) {
            return false;
        }
        if (
            achievement.requiredUpgrades &&
            acquiredUpgrades >= achievement.requiredUpgrades
        ) {
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        } else if (
            achievement.requiredClicks &&
            numberOfClicks >= achievement.requiredClicks
        ) {
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        }
        return true;
    });

    window.requestAnimationFrame(step);
}

/* Här använder vi en listener igen. Den här gången så lyssnar iv efter window
 * objeket och när det har laddat färdigt webbsidan(omvandlat html till dom)
 * När detta har skett så skapar vi listan med upgrades, för detta använder vi
 * en forEach loop. För varje element i arrayen upgrades så körs metoden upgradeList
 * för att skapa korten. upgradeList returnerar ett kort som vi fäster på webbsidan
 * med appendChild.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * Efter det så kallas requestAnimationFrame och spelet är igång.
 */
window.addEventListener('load', async () => {
    await loadProgress()
    upgrades.forEach((upgrade) => {
        upgradeList.appendChild(createCard(upgrade))
    })
    window.requestAnimationFrame(step)
})

/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
const upgrades = [
    {
        name: 'Basic Gene Splicer',
        cost: 10,
        amount: 1,
    },
    {
        name: 'DNA Amplification',
        cost: 100,
        amount: 5,
    },
    {
        name: 'Mutation Chamber',
        cost: 500,
        amount: 15,
    },
    {
        name: 'Toxic Serum',
        cost: 1500,
        amount: 40,
    },
    {
        name: 'Mutant Cloning Vat',
        cost: 5000,
        amount: 100,
    },
    {
        name: 'Radioactive Lab',
        cost: 15000,
        amount: 300,
    },
    {
        name: 'Alien DNA Extractor',
        cost: 50000,
        amount: 1000,
    },
    {
        name: 'Monster Army Factory',
        cost: 150000,
        amount: 3000,
    },
    {
        name: 'World Domination Lab',
        cost: 500000,
        amount: 10000,
    },
    {
        name: 'Cosmic Mutation Core',
        cost: 1000000,
        amount: 25000,
    },
];

/* createCard är en funktion som tar ett upgrade objekt som parameter och skapar
 * ett html kort för det.
 * För att skapa nya html element så används document.createElement(), elementen
 * sparas i en variabel så att vi kan manipulera dem ytterligare.
 * Vi kan lägga till klasser med classList.add() och text till elementet med
 * textcontent = 'värde'.
 * Sedan skapas en listener för kortet och i den hittar vi logiken för att köpa
 * en uppgradering.
 * Funktionen innehåller en del strängar och konkatenering av dessa, det kan göras
 * med +, variabel + 'text'
 * Sist så fäster vi kortets innehåll i kortet och returnerar elementet.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
 */
function createCard(upgrade) {
    const card = document.createElement('div');
    card.classList.add('card');
    const header = document.createElement('p');
    header.classList.add('title');
    const cost = document.createElement('p');
    if (upgrade.amount) {
        header.textContent = `${upgrade.name}, +${upgrade.amount} per second.`;
    } else {
        header.textContent = `${upgrade.name}, +${upgrade.clicks} per click.`;
    }
    cost.textContent = `Buy for ${upgrade.cost} DNA.`;

    card.addEventListener('click', (e) => {
        if (money >= upgrade.cost) {
            acquiredUpgrades++;
            money -= upgrade.cost;
            upgrade.cost *= 1.5;
            cost.textContent = 'Buy for ' + Math.round(upgrade.cost) + ' DNA.';
            moneyPerSecond += upgrade.amount ? upgrade.amount : 0;
            moneyPerClick += upgrade.clicks ? upgrade.clicks : 0;
            message('Congratulation you have bought an uppgrade!', 'success');
        } else {
            message('You Cannot Afford. Broke ass.', 'warning');
        }
    });

    card.appendChild(header);
    card.appendChild(cost);
    return card;
}

/* Message visar hur vi kan skapa ett html element och ta bort det.
 * appendChild används för att lägga till och removeChild för att ta bort.
 * Detta görs med en timer.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 */
function message(text, type) {
    const p = document.createElement('p');
    p.classList.add(type);
    p.textContent = text;
    msgbox.appendChild(p);

    msgbox.classList.add('active');

    if (type === 'achievement') {
        audioAchievement.play();
    }
    setTimeout(() => {
        // Add fade-out animation to the message
        p.style.animation = 'fadeOut 0.3s forwards';
    }, 3000); // Keep the message visible for 1.5 seconds

    // After the message fades out, remove the msgbox itself
    setTimeout(() => {
        p.parentNode.removeChild(p);
        if (msgbox.children.length === 0) {
            msgbox.classList.remove('active'); // Hide the msgbox
        }
    }, 2000); // The total duration of the message display (1.5s for reading + 0.5s for fade out)
}

async function loadProgress() {
  const response = await fetch("/get_progress")
  const data = await response.json()

  money = data.dna || 0
  moneyPerClick = data.money_per_click || 1
  moneyPerSecond = data.money_per_second || 0
  acquiredUpgrades = data.upgrades || 0
  numberOfClicks = data.clicks || 0
}

async function saveProgress() {
  await fetch("/save_progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dna: Math.round(money),
      moneyPerClick,
      moneyPerSecond,
      acquiredUpgrades,
      numberOfClicks
    })
  })
}

setInterval(saveProgress, 5000)


console.log("Script Loaded"); // Make sure the JS file is being loaded correctly