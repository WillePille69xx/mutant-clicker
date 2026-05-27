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
        description: 'First Spark: You generated your first DNA!',
        requiredClicks: 1,
        acquired: false,
    },
    {
        description: 'Pocket Scientist: You reached 100 DNA.',
        requiredMoney: 100,
        acquired: false,
    },
    {
        description: 'Lab Assistant: You bought your first upgrade.',
        requiredUpgrades: 1,
        acquired: false,
    },
    {
        description: 'Gene Collector: You reached 1,000 DNA.',
        requiredMoney: 1000,
        acquired: false,
    },
    {
        description: 'Mutation Starter: You bought 5 upgrades.',
        requiredUpgrades: 5,
        acquired: false,
    },
    {
        description: 'Click Goblin: You clicked 250 times.',
        requiredClicks: 250,
        acquired: false,
    },
    {
        description: 'Biohazard Budget: You reached 10,000 DNA.',
        requiredMoney: 10000,
        acquired: false,
    },
    {
        description: 'Mutant Manager: You bought 15 upgrades.',
        requiredUpgrades: 15,
        acquired: false,
    },
    {
        description: 'Industrial Mutation: You reached 100 DNA per second.',
        requiredMps: 100,
        acquired: false,
    },
    {
        description: 'Lab Overclocked: You reached 1,000 DNA per second.',
        requiredMps: 1000,
        acquired: false,
    },
    {
        description: 'The Army Begins: You bought 30 upgrades.',
        requiredUpgrades: 30,
        acquired: false,
    },
    {
        description: 'World Threat: You reached 1,000,000 DNA.',
        requiredMoney: 1000000,
        acquired: false,
    },
    {
        description: 'Genetic Overlord: You clicked 10,000 times.',
        requiredClicks: 10000,
        acquired: false,
    },
    {
        description: 'Cosmic Mutation: You reached 25,000 DNA per second.',
        requiredMps: 25000,
        acquired: false,
    },
    {
        description: 'Nice Mutation: You reached exactly 69 DNA. Hehe, Nice.',
        requiredMoney: 69,
        acquired: false,
    },
]


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
        } if (
            achievement.requiredClicks &&
            numberOfClicks >= achievement.requiredClicks
        ) {
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        } if (
            achievement.requiredMoney &&
            money >= achievement.requiredMoney
        ) {
            achievement.acquired = true
            message(achievement.description, 'achievement')
            return false
        } if (
            achievement.requiredMps &&
            moneyPerSecond >= achievement.requiredMps
        ) {
            achievement.acquired = true
            message(achievement.description, 'achievement')
            return false
        }

        return true
    })

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
let upgrades = [
    {
        name: 'Basic Gene Splicer',
        description: 'A rusty tool that slices DNA just well enough.',
        image: '/img/upgrades/gene-splicer.png',
        cost: 10,
        amount: 1,
    },
    {
        name: 'DNA Amplifier',
        description: 'Boosts weak DNA signals into usable mutation energy.',
        image: '/img/upgrades/DNA-Amplifier.png',
        cost: 75,
        amount: 3,
    },
    {
        name: 'Toxic Serum Mixer',
        description: 'Mixes glowing green serum. Probably safe.',
        image: '/img/upgrades/Toxic-Serum-Mixer.png',
        cost: 250,
        amount: 8,
    },
    {
        name: 'Mutation Chamber',
        description: 'A suspicious pod where experiments become stronger.',
        image: '/img/upgrades/Mutation-Chamber.png',
        cost: 750,
        amount: 20,
    },
    {
        name: 'Cloning Vat',
        description: 'Creates tiny unstable mutants that produce DNA.',
        image: '/img/upgrades/Cloning-Vat.png',
        cost: 2500,
        amount: 60,
    },
    {
        name: 'Radioactive Reactor',
        description: 'Powers the whole lab with questionable radiation.',
        image: '/img/upgrades/Radioactive-Reactor.png',
        cost: 10000,
        amount: 180,
    },
    {
        name: 'Alien DNA Extractor',
        description: 'Extracts rare DNA from mysterious alien samples.',
        image: '/img/upgrades/Alien-DNA-Extractor.png',
        cost: 50000,
        amount: 750,
    },
    {
        name: 'Mutant Assembly Line',
        description: 'Mass-produces your mutant army automatically.',
        image: '/img/upgrades/Mutant-Assembly-Line.png',
        cost: 200000,
        amount: 2500,
    },
    {
        name: 'World Domination Lab',
        description: 'A full evil-scientist headquarters.',
        image: '/img/upgrades/World-Domination-Lab.png',
        cost: 1000000,
        amount: 12000,
    },
    {
        name: 'Cosmic Mutation Core',
        description: 'A reality-bending core full of impossible DNA.',
        image: '/img/upgrades/Cosmic-Mutation-Core.png',
        cost: 7500000,
        amount: 75000,
    },
    {
        name: 'Clicker Glove',
        description: 'Makes every click inject extra mutation power.',
        image: '/img/upgrades/Clicker-Glove.png',
        cost: 500,
        clicks: 2,
    },
    {
        name: 'Cybernetic Finger',
        description: 'Precision clicking enhanced with metal joints.',
        image: '/img/upgrades/Cybernetic-Finger.png',
        cost: 5000,
        clicks: 10,
    },
    {
        name: 'Mad Scientist Reflexes',
        description: 'Your clicks become dangerously efficient.',
        image: '/img/upgrades/Mad-Scientist-Reflexes.png',
        cost: 50000,
        clicks: 50,
    },
]

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

    const card = document.createElement('div')
    card.classList.add('card')

    const img = document.createElement('img', { is: 'upgrade-image' })
    img.src = upgrade.image
    img.alt = upgrade.name
    img.classList.add('upgrade-image')

    const content = document.createElement('div')
    content.classList.add('card-content')

    const header = document.createElement('p')
    header.classList.add('title')

    const description = document.createElement('p')
    description.classList.add('description')
    description.textContent = upgrade.description

    const cost = document.createElement('p')
    cost.classList.add('cost')

    if (upgrade.amount) {
        header.textContent =
            `${upgrade.name}, +${upgrade.amount} DNA/sec.`
    } else {
        header.textContent =
            `${upgrade.name}, +${upgrade.clicks} DNA/click.`
    }

    cost.textContent =
        `Buy for ${Math.round(upgrade.cost)} DNA.`

    card.addEventListener('click', () => {
        if (money >= upgrade.cost) {
            acquiredUpgrades++
            money -= upgrade.cost

            upgrade.cost =
                Math.round(upgrade.cost * 1.5)

            cost.textContent =
                `Buy for ${Math.round(upgrade.cost)} DNA.`
            moneyPerSecond +=
                upgrade.amount ? upgrade.amount : 0
            moneyPerClick +=
                upgrade.clicks ? upgrade.clicks : 0
            message('Upgrade purchased!', 'success')
            saveProgress()
        } else {
            message(
                'You cannot afford this upgrade.',
                'warning'
            )
        }
    })

    content.appendChild(header)
    content.appendChild(description)
    content.appendChild(cost)
    card.appendChild(img)
    card.appendChild(content)

    return card
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

  if (data.upgrades_data) {
    upgrades = JSON.parse(data.upgrades_data)
}
  if (data.achievements_data) {
    achievements = JSON.parse(data.achievements_data)
  }
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
      upgradesData: JSON.stringify(upgrades),
      achievementsData: JSON.stringify(achievements),
      numberOfClicks
    })
  })
}

setInterval(saveProgress, 5000)


console.log("Script Loaded"); // Make sure the JS file is being loaded correctly