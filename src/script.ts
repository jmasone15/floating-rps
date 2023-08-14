const iconsArray: IconElement[] = [];
const iconSize = 50;

class IconElement {
    id: number;
    element: HTMLElement = document.createElement("div");
    coordinates: number[];
    increments: number[] = [1, 1];
    speed: number = 10;

    constructor(id: number) {
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

            // Wall Bump
            if (wallBump(true, x, xInc)) {
                this.increments[0] = xInc * -1;
            }
            if (wallBump(false, y, yInc)) {
                this.increments[1] = yInc * -1;
            }

            // Other Shape Bump
            if (xInc === this.increments[0] && yInc === this.increments[1]) {
                this.shapeBump();
            }

            // Move element
            this.coordinates = [x + this.increments[0], y + this.increments[1]];

            // Update class properties
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

            if (
                comparePositions([left, right], [iconRect.left, iconRect.right]) &&
                comparePositions([top, bottom], [iconRect.top, iconRect.bottom])
            ) {
                if (Math.abs(left - iconRect.right) < 2 || Math.abs(right - iconRect.left) < 2) {
                    this.increments[0] = this.increments[0] * -1;
                    updatedIconArray[i].increments[0] = updatedIconArray[i].increments[0] * -1;
                } else if (
                    Math.abs(top - iconRect.bottom) < 2 ||
                    Math.abs(bottom - iconRect.top) < 2
                ) {
                    this.increments[1] = this.increments[1] * -1;
                    updatedIconArray[i].increments[1] = updatedIconArray[i].increments[1] * -1;
                }

                return true;
            }
        }

        return false;
    }
}

const comparePositions = (shapeSidesOne: number[], shapeSidesTwo: number[]) => {
    // This function runs to compare two shapes to see if they are touching either horizontally or vertically.
    // The first step is to figure out which shape is the closest to the starting point of 0,0 on the screen.
    // The next step is determining if the opposite side of the closest shape is touching the opposing side of the other shape.

    let leftTopShape, rightBottomShape;
    if (shapeSidesOne[0] < shapeSidesTwo[0]) {
        leftTopShape = shapeSidesOne;
        rightBottomShape = shapeSidesTwo;
    } else {
        leftTopShape = shapeSidesTwo;
        rightBottomShape = shapeSidesOne;
    }

    return leftTopShape[1] > rightBottomShape[0] || leftTopShape[0] === rightBottomShape[0];
};

const wallBump = (isHorizontal: boolean, value: number, increment: number) => {
    const max = isHorizontal ? window.innerWidth - iconSize : window.innerHeight - iconSize;
    return value + increment > max || value + increment < 0;
};

document.body.addEventListener("click", () => {
    new IconElement(iconsArray.length).init();
});
