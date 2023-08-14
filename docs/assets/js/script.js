"use strict";
const iconsArray = [];
const iconSize = 50;
class IconElement {
    id;
    element = document.createElement("div");
    coordinates;
    increments;
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
    }
    init() {
        iconsArray.push(this);
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
document.body.addEventListener("click", () => {
    new IconElement(iconsArray.length).init();
});
