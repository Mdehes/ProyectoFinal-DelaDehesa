const userDataContainer = document.getElementById("userDataContainer");
const equippedObjectContainer = document.getElementById("equippedObjectContainer");
const inventoryContainer = document.getElementById("inventoryContainer");
const objectsContainer = document.getElementById("objectsContainer");

const DEFAULT_balance = 400;
const DEFAULT_vitality = 100;
const DEFAULT_attack = 10;
const DEFAULT_critic = 0.05;
const DEFAULT_defense = 10;
const DEFAULT_maxInventory = 3;

class User {
constructor(img, name) {
    this.name = name;
    this.img = img;
    this.balance = DEFAULT_balance;
    this.vitality = DEFAULT_vitality;
    this.attack = DEFAULT_attack;
    this.critic = DEFAULT_critic;
    this.defense = DEFAULT_defense;
    this.inventoryCapacity = DEFAULT_maxInventory;
}
}
const newUser = new User("./assets/user.jpg", "Adventurer");

class Object {
constructor(
    id,
    name,
    img,
    price,
    type,
    weight,
    attribute1,
    attribute2,
    vitality,
    attack,
    critic,
    defense
) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.stock = 1;
    this.price = price;
    this.type = type;
    this.weight = weight;
    this.attribute1 = attribute1;
    this.attribute2 = attribute2;
    this.vitality = vitality;
    this.attack = attack;
    this.critic = critic;
    this.defense = defense;
}
}
const lightSword = new Object("1","Sword of Light","./assets/lightSword.jpg",150,"Light",1,"+20 ATK","+15 DEF",0,20,0,15);
const lightArrow = new Object("2","Arrow of Light","./assets/lightArrow.jpg",130,"Light",1,"+10 ATK","+0.3 CRT",0,10,0.3,0);
const lightStaff = new Object("3","Staff of Light","./assets/lightStaff.jpg",135,"Light",1,"+15 ATK","+15 VIT",15,15,0,0);
const darkSword = new Object("4","Sword of Dark","./assets/darkSword.jpg",150,"Dark",1,"+20 ATK","+15 DEF",0,20,0,15);
const darkArrow = new Object("5","Arrow of Dark","./assets/darkArrow.jpg",130,"Dark",1,"+10 ATK","+0.3 CRT",0,10,0.3,0);
const darkStaff = new Object("6","Staff of Dark","./assets/darkStaff.jpg",135,"Dark",1,"+15 ATK","+15 VIT",15,15,0,0);

let objects = [lightSword,darkSword,lightArrow,darkArrow,lightStaff,darkStaff,];
let inventory = [];
let equippedObjects = [];

initializeUserData();
initializeEquippedObjects();
initializeInventory();
initializeStore();

function resetStore() {
inventory = [];
equippedObjects = [];
newUser.balance = DEFAULT_balance;
newUser.vitality = DEFAULT_vitality;
newUser.attack = DEFAULT_attack;
newUser.critic = DEFAULT_critic;
newUser.defense = DEFAULT_defense;
newUser.inventoryCapacity = DEFAULT_maxInventory;
localStorage.removeItem("equippedObjects");
localStorage.removeItem("inventory");
localStorage.removeItem("userData");
location.reload();
}

function initializeUserData() {
const userData = localStorage.getItem("userData");
if (userData) {
    const parsedData = JSON.parse(userData);
    newUser.balance = parsedData.balance || newUser.balance;
    newUser.vitality = parsedData.vitality || newUser.vitality;
    newUser.attack = parsedData.attack || newUser.attack;
    newUser.critic = parsedData.critic || newUser.critic;
    newUser.defense = parsedData.defense || newUser.defense;
}
const userDataContainer = document.getElementById("userDataContainer");
userDataContainer.innerHTML = "";
const objectDiv = document.createElement("div");
objectDiv.innerHTML = `
    <img id="userIcon" src="${newUser.img}" alt="" class="objectIcon">
    <p>${newUser.name}</p>
    <p>Balance: ${newUser.balance}</p>
    <p>Capacity: ${DEFAULT_maxInventory}</p>
    <p>Vitality: ${newUser.vitality}</p>
    <p>Attack: ${newUser.attack}</p>
    <p>Critic: ${newUser.critic}</p>
    <p>Defense: ${newUser.defense}</p>
`;
userDataContainer.appendChild(objectDiv);
}

function saveUserData() {
const userData = {
    balance: newUser.balance,
    vitality: newUser.vitality,
    attack: newUser.attack,
    critic: newUser.critic,
    defense: newUser.defense,
};
localStorage.setItem("userData", JSON.stringify(userData));
}

function initializeInventory() {
inventoryContainer.innerHTML = '<img id="userIcon" src="./assets/inventory.jpg" alt="" class="objectIcon"> <br><p>Inventory</p>';
const storedInventory = JSON.parse(localStorage.getItem("inventory"));
if (storedInventory && storedInventory.length > 0) {
    inventory = storedInventory;
}
const filteredInventory = inventory.filter(
    (obj) => !equippedObjects.includes(obj)
);
if (inventory.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "";
    inventoryContainer.appendChild(emptyMessage);
} else {
    const inventoryList = document.createElement("ul");
    filteredInventory.forEach((object) => {
    const objectItem = document.createElement("li");
    objectItem.innerHTML = `
    <img id="inventoryIcon" src="${object.img}" alt="${object.name}" class="objectIcon" onclick="equipObject('${object.id}')">
    `;
    inventoryList.appendChild(objectItem);
    });
    inventoryContainer.appendChild(inventoryList);
}
}

function saveInventory() {
localStorage.setItem("inventory", JSON.stringify(inventory));
}

function initializeEquippedObjects() {
const equippedData = localStorage.getItem("equippedObjects");
if (equippedData) {
    equippedObjects = JSON.parse(equippedData);
}
equippedObjectContainer.innerHTML = '<img id="userIcon" src="./assets/equipeddObjects.jpg" alt="" class="objectIcon"> <br><p>Equipped</p>';
;
if (equippedObjects.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "";
    equippedObjectContainer.appendChild(emptyMessage);
} else {
    equippedObjects.forEach((object) => {
    const objectDiv = document.createElement("div");
    objectDiv.innerHTML = `
    <img id="equippedObjectsIcon" src="${object.img}" alt="${object.name}" class="objectIcon">
    `;
    equippedObjectContainer.appendChild(objectDiv);
    });
}
}

function saveEquippedObjects() {
localStorage.setItem("equippedObjects", JSON.stringify(equippedObjects));
}

function equipObject(objectId) {
const object = inventory.find((obj) => obj.id === objectId);
if (!object) {
    Toastify({
    text: "Object not found.",
    duration: 4000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
        color: "red",
        boxShadow: "none",
    },
    }).showToast();
    return;
}
if (equippedObjects.length >= DEFAULT_maxInventory) {
    Toastify({
    text: "You have reached the maximum equipped objects.",
    duration: 4000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
        color: "red",
        boxShadow: "none",
    },
    }).showToast();
    return;
}
newUser.vitality += object.vitality;
newUser.attack += object.attack;
newUser.critic += object.critic;
newUser.defense += object.defense;
saveUserData();
equippedObjects.push(object);
saveInventory();
const objectIndex = inventory.findIndex((obj) => obj.id === objectId);
inventory.splice(objectIndex, 1);
localStorage.setItem("inventory", JSON.stringify(inventory));
Toastify({
    text: object.attribute1,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
    color: "green",
    boxShadow: "none",
    },
}).showToast();
setTimeout(() => {
    Toastify({
    text: object.attribute2,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
        color: "green",
        boxShadow: "none",
    },
    }).showToast();
}, 100);
saveEquippedObjects()
getRandomQuote();
initializeUserData();
initializeStore();
initializeEquippedObjects();
}

function initializeStore() {
const storedInventory = JSON.parse(localStorage.getItem("inventory"));
const storedEquippedObjects = JSON.parse(localStorage.getItem("equippedObjects"));
const userInventory = storedInventory || [];
const userEquippedObjects = storedEquippedObjects || [];
objectsContainer.innerHTML = "";
objects.forEach((object) => {
    if (!userInventory.some((obj) => obj.id === object.id) && !userEquippedObjects.some((obj) => obj.id === object.id)) {
    showObject(object);
    }
});
initializeInventory();
}

function showObject(object) {
const objectDiv = document.createElement("div");
objectDiv.innerHTML = `
    <img src="${object.img}" alt="${object.name}" class="objectIcon">
    <h4>${object.name}</h4>
    <p>Vitality: ${object.vitality}</p>
    <p>Attack: ${object.attack}</p>
    <p>Critic: ${object.critic}</p>
    <p>Defense: ${object.defense}</p>
    <p>Price: ${object.price}</p>
    <button onclick="addObjectToInventory('${object.id}')" id="addButton">Add</button>
`;
objectsContainer.appendChild(objectDiv);
}

function addObjectToInventory(objectId) {
const object = objects.find((obj) => obj.id === objectId);
const indexObject = objects.findIndex((obj) => obj.id === objectId);
if (indexObject !== -1) {
    objects.splice(indexObject, 1);
}
if (!object) {
    Toastify({
    text: "Object not found.",
    duration: 4000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
        color: "red",
        boxShadow: "none",
    },
    }).showToast();
} else if (newUser.inventoryCapacity < object.weight) {
    Toastify({
    text: "Your inventory capacity is insufficient",
    duration: 4000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
        color: "red",
        boxShadow: "none",
    },
    }).showToast();
} else if (newUser.balance < object.price) {
    Toastify({
    text: "Your balance is insufficient.",
    duration: 4000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
        color: "red",
        boxShadow: "none",
    },
    }).showToast();
} else {
    newUser.balance -= object.price;
    newUser.inventoryCapacity -= object.weight;
    saveUserData();
    inventory.push(object);
    saveInventory();
    localStorage.setItem("inventory", JSON.stringify(inventory));
    const pagraph = document.getElementById("pagraph");
    pagraph.innerHTML = `Why don't you try it on?<br>Seeing you having that piece in your hands inspires me..<br>Something comes to my mind!`;
    

    Toastify({
    text: `+${object.name}`,
    duration: 4000,
    gravity: "top",
    position: "right",
    backgroundColor: "transparent",
    style: {
        color: "green",
        boxShadow: "none",
    },
    }).showToast();
    initializeUserData();
    initializeStore();
}
}

function getRandomQuote() {
return fetch("https://api.quotable.io/quotes/random")
    .then((response) => response.json())
    .then((data) => {
    return { content: data[0].content};
    })
    .then(({ content }) => {
    const quoteText = `${content}`;
    const pagraph = document.getElementById("pagraph");
    pagraph.textContent = `${quoteText}`;
    });
}