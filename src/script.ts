const plusIconEl = document.getElementById("plus") as HTMLElement;
let elementCounter = 0;
let iconArray: IconElement[] = [];

class Movement {
    num: number;
    forward: boolean;
    increment: number;
    max: number;

    constructor(num: number, forward: boolean, increment: number, vertical: boolean) {
        this.num = num;
        this.forward = forward;
        this.increment = increment;
        this.max = vertical ? window.innerHeight - 52 : window.innerWidth - 52;
    }

    move() {
        if (this.forward) {
            if (this.num - this.increment < 0) {
                this.forward = false;
                this.num += this.increment;
            } else {
                this.num -= this.increment;
            }
        } else {
            if (this.num + this.increment > this.max) {
                this.forward = true;
                this.num -= this.increment;
            } else {
                this.num += this.increment;
            }
        }
    }
}

class IconElement {
    id: number;
    element: HTMLElement = document.createElement("i");
    xMove: Movement;
    yMove: Movement;

    constructor(id: number, startingX?: number, startingY?: number) {
        this.id = id;
        this.xMove = new Movement(startingX || 0, false, 1, false);
        this.yMove = new Movement(startingY || 0, false, 0, true);
    }

    init() {
        // Update UI
        this.element.setAttribute("class", "fa-solid fa-scissors");
        this.element.setAttribute("style", `left: ${this.xMove.num}px; top: ${this.yMove.num}px;`);
        document.body.appendChild(this.element);

        setInterval(() => {
            this.moveIcon();
        }, 1);

        iconArray.push(this);
        console.dir(this.element);
    }

    moveIcon() {
        this.xMove.move();
        this.yMove.move();

        for (let i = 0; i < iconArray.length; i++) {
            const element = iconArray[i];

            if (element.id !== this.id) {
                if (
                    (this.xMove.num === element.xMove.num ||
                        this.xMove.num === element.xMove.num + 52) &&
                    // this.yMove.num >= element.yMove.num
                    this.yMove.num <= element.yMove.num + 52
                ) {
                    this.xMove.forward = !this.xMove.forward;
                    element.xMove.forward = !element.xMove.forward;
                    break;
                }
            }
        }

        this.element.setAttribute("style", `left: ${this.xMove.num}px; top: ${this.yMove.num}px;`);
    }
}

let newIcon = new IconElement(1, 0, 100);
let newIconTwo = new IconElement(2, window.innerWidth - 70);

newIcon.init();
newIconTwo.init();
