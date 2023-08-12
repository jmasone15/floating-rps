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
    const comparePositions = (p1, p2) => {
        let r1, r2;
        if (p1[0] < p2[0]) {
            r1 = p1;
            r2 = p2;
        }
        else {
            r1 = p2;
            r2 = p1;
        }
        return r1[1] > r2[0] || r1[0] === r2[0];
    };
    setInterval(() => {
        if (x + xIncrement > xMax || x + xIncrement < 0) {
            xIncrement = xIncrement * -1;
        }
        if (y + yIncrement > yMax || y + yIncrement < 0) {
            yIncrement = yIncrement * -1;
        }
        let { left, right, top, bottom } = element.getBoundingClientRect();
        if (comparePositions([left, right], [mainBoundingRect.left, mainBoundingRect.right]) &&
            comparePositions([top, bottom], [mainBoundingRect.top, mainBoundingRect.bottom])) {
            console.log(left, right);
            console.log(mainBoundingRect.left, mainBoundingRect.right);
            if (Math.abs(left - mainBoundingRect.right) < 1 ||
                Math.abs(right - mainBoundingRect.left) < 1) {
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
