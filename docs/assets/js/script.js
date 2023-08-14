"use strict";
const iconsArray = [];
const iconSize = 50;
class IconElement {
    id;
    element = document.createElement("div");
    coordinates;
    increments = [1, 1];
    speed = 10;
    constructor(id) {
        this.id = id;
        this.coordinates = [
            Math.floor(Math.random() * window.innerWidth - iconSize),
            Math.floor(Math.random() * window.innerHeight - iconSize)
        ];
    }
    init() {
        iconsArray.push(this);
        document.body.appendChild(this.element);
        return this.movement();
    }
    movement() {
        setInterval(() => {
            let x = this.coordinates[0];
            let y = this.coordinates[1];
            let xInc = this.increments[0];
            let yInc = this.increments[1];
            if (wallBump(true, x, xInc)) {
                this.increments[0] = xInc * -1;
            }
            if (wallBump(false, y, yInc)) {
                this.increments[1] = yInc * -1;
            }
            if (xInc === this.increments[0] && yInc === this.increments[1]) {
                this.shapeBump();
            }
            this.coordinates = [x + this.increments[0], y + this.increments[1]];
            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
        }, this.speed);
    }
    getDOMCoordinates() {
        return this.element.getBoundingClientRect();
    }
    shapeBump() {
        const updatedIconArray = iconsArray.filter(icon => icon.id !== this.id);
        const { left, right, top, bottom } = this.getDOMCoordinates();
        for (let i = 0; i < updatedIconArray.length; i++) {
            const iconRect = updatedIconArray[i].getDOMCoordinates();
            if (comparePositions([left, right], [iconRect.left, iconRect.right]) &&
                comparePositions([top, bottom], [iconRect.top, iconRect.bottom])) {
                if (Math.abs(left - iconRect.right) < 2 || Math.abs(right - iconRect.left) < 2) {
                    this.increments[0] = this.increments[0] * -1;
                    updatedIconArray[i].increments[0] = updatedIconArray[i].increments[0] * -1;
                }
                else if (Math.abs(top - iconRect.bottom) < 2 ||
                    Math.abs(bottom - iconRect.top) < 2) {
                    this.increments[1] = this.increments[1] * -1;
                    updatedIconArray[i].increments[1] = updatedIconArray[i].increments[1] * -1;
                }
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
document.body.addEventListener("click", () => {
    new IconElement(iconsArray.length).init();
});
