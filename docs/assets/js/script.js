"use strict";
const plusIcon = document.getElementById("plus");
let iconList = [];
const updatePosition = (iconElement) => {
    if (iconElement.xDirection === "left") {
        if (iconElement.leftPosition + 1 > window.innerWidth - iconElement.iconEl.clientWidth) {
            iconElement.xDirection = "right";
            iconElement.leftPosition -= 1;
        }
        else {
            iconElement.leftPosition += 1;
        }
    }
    else {
        if (iconElement.leftPosition - 1 < 0) {
            iconElement.xDirection = "left";
            iconElement.leftPosition += 1;
        }
        else {
            iconElement.leftPosition -= 1;
        }
    }
    if (iconElement.yDirection === "top") {
        if (iconElement.topPosition + 1 > window.innerHeight - iconElement.iconEl.clientHeight) {
            iconElement.yDirection = "bottom";
            iconElement.topPosition -= 1;
        }
        else {
            iconElement.topPosition += 1;
        }
    }
    else {
        if (iconElement.topPosition - 1 < 0) {
            iconElement.yDirection = "top";
            iconElement.topPosition += 1;
        }
        else {
            iconElement.topPosition -= 1;
        }
    }
    iconElement.iconEl.setAttribute("style", `left: ${iconElement.leftPosition}px; top: ${iconElement.topPosition}px;`);
};
plusIcon.addEventListener("click", () => {
    const leftStart = Math.floor(Math.random() * (window.innerWidth - 50));
    const topStart = Math.floor(Math.random() * (window.innerHeight - 50));
    const icon = document.createElement("i");
    const iconObject = {
        iconEl: icon,
        leftPosition: leftStart,
        topPosition: topStart,
        xDirection: Math.floor(Math.random() * 100) > 49 ? "left" : "right",
        yDirection: Math.floor(Math.random() * 100) > 49 ? "top" : "bottom"
    };
    icon.setAttribute("style", `left: ${iconObject.leftPosition}px; top: ${iconObject.topPosition}px;`);
    icon.setAttribute("class", "fa-solid fa-scissors");
    document.body.appendChild(icon);
    iconList.push(iconObject);
    setInterval(() => {
        updatePosition(iconObject);
    }, Math.floor(Math.random() * 10) + 1);
});
