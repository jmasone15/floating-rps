const plusIcon = document.getElementById("plus") as HTMLElement;
let iconList: IconObject[] = [];

interface IconObject {
    id: number;
    iconEl: HTMLElement;
    leftPosition: number;
    topPosition: number;
    xDirection: string;
    yDirection: string;
}

const areElementsTouching = (elOne: HTMLElement, elTwo: HTMLElement) => {
    const rectOne = elOne.getBoundingClientRect();
    const rectTwo = elTwo.getBoundingClientRect();

    // Currently the boxes are bumping sometimes. Maybe because it is only checking the exact pixel spot of left/right/top/bottom
    if (rectOne.right === rectTwo.left && rectOne.y >= rectTwo.top && rectOne.y <= rectTwo.bottom) {
        return "right";
    } else if (rectOne.left === rectTwo.right && rectOne.y >= rectTwo.top && rectOne.y <= rectTwo.bottom) {
        return "left";
    } else if (rectOne.bottom === rectTwo.top && rectOne.x >= rectTwo.left && rectOne.x <= rectTwo.right) {
        return "bottom";
    } else if (rectOne.top === rectTwo.bottom && rectOne.x >= rectTwo.left && rectOne.x <= rectTwo.right) {
        return "top";
    } else {
        return "";
    }
};

const updatePosition = (iconElement: IconObject) => {
    let touching: string = "";
    let bumpedId: number = -1;
    let bumpedElement: IconObject;

    for (let i = 0; i < iconList.length; i++) {
        if (iconElement.id === iconList[i].id) {
            continue;
        }

        touching = areElementsTouching(iconElement.iconEl, iconList[i].iconEl);
        if (touching !== "") {
            bumpedId = iconList[i].id;
            break;
        }
    }

    switch (touching) {
        case "left":
            iconElement.xDirection = "left";
            bumpedElement = iconList.filter((i) => i.id === bumpedId)[0];
            bumpedElement.xDirection = "right";
            break;
        case "right":
            iconElement.xDirection = "right";
            bumpedElement = iconList.filter((i) => i.id === bumpedId)[0];
            bumpedElement.xDirection = "left";
            break;
        case "top":
            iconElement.yDirection = "top";
            bumpedElement = iconList.filter((i) => i.id === bumpedId)[0];
            bumpedElement.yDirection = "bottom";
            break;
        case "bottom":
            iconElement.yDirection = "bottom";
            bumpedElement = iconList.filter((i) => i.id === bumpedId)[0];
            bumpedElement.yDirection = "top";
            break;
        default:
            break;
    }

    if (iconElement.xDirection === "left") {
        if (iconElement.leftPosition + 1 > window.innerWidth - iconElement.iconEl.clientWidth) {
            iconElement.xDirection = "right";
            iconElement.leftPosition--;
        } else {
            iconElement.leftPosition++;
        }
    } else {
        if (iconElement.leftPosition - 1 < 0) {
            iconElement.xDirection = "left";
            iconElement.leftPosition++;
        } else {
            iconElement.leftPosition--;
        }
    }

    if (iconElement.yDirection === "top") {
        if (iconElement.topPosition + 1 > window.innerHeight - iconElement.iconEl.clientHeight) {
            iconElement.yDirection = "bottom";
            iconElement.topPosition -= 1;
        } else {
            iconElement.topPosition += 1;
        }
    } else {
        if (iconElement.topPosition - 1 < 0) {
            iconElement.yDirection = "top";
            iconElement.topPosition += 1;
        } else {
            iconElement.topPosition -= 1;
        }
    }

    iconElement.iconEl.setAttribute("style", `left: ${iconElement.leftPosition}px; top: ${iconElement.topPosition}px;`);
};

plusIcon.addEventListener("click", () => {
    const leftStart = Math.floor(Math.random() * (window.innerWidth - 50));
    const topStart = Math.floor(Math.random() * (window.innerHeight - 50));
    const icon = document.createElement("i") as HTMLElement;
    const iconObject = {
        id: iconList.length + 1,
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
    console.log(iconObject.leftPosition, iconObject.topPosition);

    setInterval(() => {
        updatePosition(iconObject);
    }, Math.floor(Math.random() * 10) + 1);
});
