const icon = document.getElementById("test") as HTMLElement;
const wrapper = document.getElementById("wrapper") as HTMLElement;
let leftPosition = 0;
let topPosition = 0;
let xDirection = "left";
let yDirection = "top";

const updatePosition = () => {
    if (xDirection === "left") {
        if (leftPosition + 1 > wrapper.offsetWidth) {
            xDirection = "right";
            leftPosition -= 2;
        } else {
            leftPosition += 2;
        }
    } else {
        if (leftPosition - 1 < 0) {
            xDirection = "left";
            leftPosition += 2;
        } else {
            leftPosition -= 2;
        }
    }

    if (yDirection === "top") {
        if (topPosition + 1 > wrapper.clientHeight) {
            yDirection = "bottom";
            topPosition -= 2;
        } else {
            topPosition += 2;
        }
    } else {
        if (topPosition - 1 < 0) {
            yDirection = "top";
            topPosition += 2;
        } else {
            topPosition -= 2;
        }
    }

    icon.setAttribute("style", `left: ${leftPosition}px; top: ${topPosition}px;`);
};

setInterval(updatePosition, 10);

console.log(wrapper.clientWidth, wrapper.offsetWidth, wrapper.scrollWidth);
