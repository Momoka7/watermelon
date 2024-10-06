import { FRUITS } from "../config/FruitConfig.js";

export default class FruitFactory {
    constructor(scene) {
        this.scene = scene;
    }

    createFruit(fruitData, x, y) {
        const circle = this.scene.add.circle(
            x,
            y,
            fruitData.radius,
            fruitData.color
        );
        const fruit = this.scene.matter.add.gameObject(circle, {
            shape: { type: "circle", radius: fruitData.radius },
            restitution: 0.3,
            friction: 0.1,
            density: 0.001,
        });

        fruit.setData("fruitData", fruitData);
        fruit.setData("isNew", true);

        this.scene.time.delayedCall(300, () => {
            fruit.setData("isNew", false);
        });

        return fruit;
    }

    createNextFruit() {
        return Phaser.Utils.Array.GetRandom(FRUITS.slice(0, 3));
    }
}
