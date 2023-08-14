const iconsArray: IconElement[] = [];
const iconSize = 50;

class IconElement {
    id: number;
    element: HTMLElement = document.createElement("div");
    coordinates: number[];
    increments: number[];
    speed: number = 10;

    constructor(id: number) {
        this.id = id;
        this.coordinates = [
            randomNumber(0, window.innerWidth - iconSize),
            randomNumber(0, window.innerHeight - iconSize)
        ];
        this.increments = [
            coinFlip(-1, 1),
            coinFlip(-1, 1)
        ]
    }

    init() {
        iconsArray.push(this);
        document.body.appendChild(this.element);
        return this.movement();
    }

    flipDirection(isHorizontal: boolean) {
        this.increments[isHorizontal ? 0 : 1] = this.increments[isHorizontal ? 0 : 1] * -1;
    }

    movement() {
        setInterval(() => {
            let x = this.coordinates[0];
            let y = this.coordinates[1];
            let xInc = this.increments[0];
            let yInc = this.increments[1];

            // Wall Bump
            if (wallBump(true, x, xInc)) {
                this.flipDirection(true)
            }
            if (wallBump(false, y, yInc)) {
                this.flipDirection(false)
            }

            // Other Shape Bump
            if (xInc === this.increments[0] && yInc === this.increments[1]) {
                this.shapeBump();
            }

            this.moveShape();
        }, this.speed);
    }

    moveShape() {
        // Move element
        this.coordinates = [this.coordinates[0] + this.increments[0], this.coordinates[1] + this.increments[1]];

        // Update class properties
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
                continue
            }

            const iconRect = iconsArray[i].getDOMCoordinates();

            if (
                comparePositions([left, right], [iconRect.left, iconRect.right]) &&
                comparePositions([top, bottom], [iconRect.top, iconRect.bottom])
            ) {
                if (Math.abs(left - iconRect.right) < 2 || Math.abs(right - iconRect.left) < 2) {
                    this.flipDirection(true);
                    iconsArray[i].flipDirection(true);
                } else if (
                    Math.abs(top - iconRect.bottom) < 2 ||
                    Math.abs(bottom - iconRect.top) < 2
                ) {
                    this.flipDirection(false);
                    iconsArray[i].flipDirection(false);
                }

                this.moveShape()
                iconsArray[i].moveShape()

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

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const coinFlip = (a: any, b: any) => {
    return randomNumber(0, 100) > 49 ? a : b
}

document.body.addEventListener("click", () => {
    new IconElement(iconsArray.length).init();
});
