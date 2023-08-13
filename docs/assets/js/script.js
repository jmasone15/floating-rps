"use strict";
const bigSquare = document.querySelector("main");
const mainBoundingRect = bigSquare.getBoundingClientRect();
const addElement = () => {
    const newDiv = document.createElement("div");
    document.body.appendChild(newDiv);
    return moveElement(newDiv);
};
const moveElement = (element) => {
    let x = 0;
    let y = 0;
    let xIncrement = 2;
    let yIncrement = 2;
    const xMax = window.innerWidth - 25;
    const yMax = window.innerHeight - 25;
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
    const test = setInterval(() => {
        if (x + xIncrement > xMax || x + xIncrement < 0) {
            xIncrement = xIncrement * -1;
        }
        if (y + yIncrement > yMax || y + yIncrement < 0) {
            yIncrement = yIncrement * -1;
        }
        let { left, right, top, bottom } = element.getBoundingClientRect();
        if (comparePositions([left, right], [mainBoundingRect.left, mainBoundingRect.right]) &&
            comparePositions([top, bottom], [mainBoundingRect.top, mainBoundingRect.bottom])) {
            console.log(left, right, top, bottom);
            console.log(mainBoundingRect.left, mainBoundingRect.right, mainBoundingRect.top, mainBoundingRect.bottom);
            const leftBump = Math.abs(left - mainBoundingRect.right) < 2;
            const rightBump = Math.abs(right - mainBoundingRect.left) < 2;
            const topBump = Math.abs(top - mainBoundingRect.bottom) < 2;
            const bottomBump = Math.abs(bottom - mainBoundingRect.top) < 2;
            if (leftBump) {
                console.log("Left Bump");
            }
            else if (rightBump) {
                console.log("Right Bump");
            }
            else if (topBump) {
                console.log("Top Bump");
            }
            else if (bottomBump) {
                console.log("Bottom Bump");
            }
            if (leftBump || rightBump) {
                xIncrement = xIncrement * -1;
            }
            else {
                yIncrement = yIncrement * -1;
            }
        }
        x = x + xIncrement;
        y = y + yIncrement;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }, 10);
};
document.body.addEventListener("click", addElement);
