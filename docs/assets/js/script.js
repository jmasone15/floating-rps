"use strict";
const iconsArray = [];
const iconSize = 40;
const addBtnEl = document.getElementById("add");
const colorModeBtnEl = document.getElementById("color-mode");
const settingsBoxEl = document.querySelector(".settings");
let darkMode = localStorage.getItem("color-mode") === "true";
class IconElement {
    id;
    element = document.createElement("img");
    coordinates;
    increments;
    type;
    speed = 10;
    constructor(id) {
        this.id = id;
        this.coordinates = [
            randomNumber(0, window.innerWidth - iconSize),
            randomNumber(0, window.innerHeight - iconSize)
        ];
        this.increments = [
            coinFlip(-1, 1),
            coinFlip(-1, 1)
        ];
        this.type = threeSidedCoinFlip("rock", "paper", "scissors");
    }
    init() {
        iconsArray.push(this);
        this.updateShapeType(this.type);
        document.body.appendChild(this.element);
        return this.movement();
    }
    flipDirection(isHorizontal) {
        this.increments[isHorizontal ? 0 : 1] = this.increments[isHorizontal ? 0 : 1] * -1;
    }
    movement() {
        setInterval(() => {
            let x = this.coordinates[0];
            let y = this.coordinates[1];
            let xInc = this.increments[0];
            let yInc = this.increments[1];
            if (wallBump(true, x, xInc)) {
                this.flipDirection(true);
            }
            if (wallBump(false, y, yInc)) {
                this.flipDirection(false);
            }
            if (xInc === this.increments[0] && yInc === this.increments[1]) {
                this.shapeBump();
            }
            this.moveShape();
        }, this.speed);
    }
    moveShape() {
        this.coordinates = [this.coordinates[0] + this.increments[0], this.coordinates[1] + this.increments[1]];
        this.element.style.left = `${this.coordinates[0]}px`;
        this.element.style.top = `${this.coordinates[1]}px`;
    }
    getDOMCoordinates() {
        return this.element.getBoundingClientRect();
    }
    updateShapeType(newType) {
        this.type = newType;
        let imagePath = "./assets/images/";
        if (this.type === "rock") {
            imagePath += "icons8-rock-48.png";
        }
        else if (this.type === "paper") {
            imagePath += "icons8-page-facing-up-48.png";
        }
        else {
            imagePath += "icons8-scissors-48.png";
        }
        this.element.setAttribute("src", imagePath);
    }
    shapeBump() {
        const { left, right, top, bottom } = this.getDOMCoordinates();
        for (let i = 0; i < iconsArray.length; i++) {
            if (iconsArray[i].id === this.id) {
                continue;
            }
            const iconRect = iconsArray[i].getDOMCoordinates();
            if (comparePositions([left, right], [iconRect.left, iconRect.right]) &&
                comparePositions([top, bottom], [iconRect.top, iconRect.bottom])) {
                if (Math.abs(left - iconRect.right) < 2 || Math.abs(right - iconRect.left) < 2) {
                    this.flipDirection(true);
                    iconsArray[i].flipDirection(true);
                }
                else if (Math.abs(top - iconRect.bottom) < 2 ||
                    Math.abs(bottom - iconRect.top) < 2) {
                    this.flipDirection(false);
                    iconsArray[i].flipDirection(false);
                }
                const newTypes = typeBump(this.type, iconsArray[i].type);
                this.updateShapeType(newTypes[0]);
                iconsArray[i].updateShapeType(newTypes[1]);
                this.moveShape();
                iconsArray[i].moveShape();
                return true;
            }
        }
        return false;
    }
}
const comparePositions = (shapeSidesOne, shapeSidesTwo) => {
    let leftTopShape, rightBottomShape;
    if (shapeSidesOne[0] < shapeSidesTwo[0]) {
        leftTopShape = shapeSidesOne;
        rightBottomShape = shapeSidesTwo;
    }
    else {
        leftTopShape = shapeSidesTwo;
        rightBottomShape = shapeSidesOne;
    }
    return leftTopShape[1] > rightBottomShape[0] || leftTopShape[0] === rightBottomShape[0];
};
const wallBump = (isHorizontal, value, increment) => {
    const max = isHorizontal ? window.innerWidth - iconSize : window.innerHeight - iconSize;
    return value + increment > max || value + increment < 0;
};
const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const coinFlip = (a, b) => {
    return randomNumber(0, 100) > 49 ? a : b;
};
const threeSidedCoinFlip = (a, b, c) => {
    const randomNum = randomNumber(0, 100);
    if (randomNum >= 0 && randomNum < 33) {
        return a;
    }
    else if (randomNum >= 33 && randomNum < 66) {
        return b;
    }
    else {
        return c;
    }
};
const typeBump = (typeOne, typeTwo) => {
    let newTypes = [typeOne, typeTwo];
    switch (typeOne) {
        case "rock":
            if (typeTwo === "scissors") {
                newTypes[1] = "rock";
            }
            else if (typeTwo === "paper") {
                newTypes[0] = "paper";
            }
            break;
        case "scissors":
            if (typeTwo === "paper") {
                newTypes[1] = "scissors";
            }
            else if (typeTwo === "rock") {
                newTypes[0] = "rock";
            }
            break;
        default:
            if (typeTwo === "rock") {
                newTypes[1] = "paper";
            }
            else if (typeTwo === "scissors") {
                newTypes[0] = "scissors";
            }
            break;
    }
    return newTypes;
};
const updateColorMode = () => {
    localStorage.setItem("color-mode", darkMode.toString());
    document.body.style.backgroundColor = darkMode ? "#0a0e12" : "white";
    settingsBoxEl.style.color = darkMode ? "white" : "black";
    colorModeBtnEl.setAttribute("class", `fa-solid fa-${darkMode ? "sun" : "moon"}`);
};
addBtnEl.addEventListener("click", () => {
    new IconElement(iconsArray.length).init();
});
colorModeBtnEl.addEventListener("click", () => {
    darkMode = !darkMode;
    updateColorMode();
});
updateColorMode();
