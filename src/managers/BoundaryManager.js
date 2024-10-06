export default class BoundaryManager {
    constructor(scene) {
        this.scene = scene;
        this.boundarySensor = null;
        this.boundaryCheckEvent = null;
    }

    createBoundary() {
        const boundaryY = 100;
        this.scene.add
            .line(0, boundaryY, 0, 0, this.scene.game.config.width, 0, 0xff0000)
            .setOrigin(0);

        this.boundarySensor = this.scene.matter.add.rectangle(
            this.scene.game.config.width / 2,
            boundaryY,
            this.scene.game.config.width,
            10,
            { isSensor: true, isStatic: true }
        );
        this.boundarySensor.label = "boundary";
    }

    startBoundaryCheck(checkCallback) {
        this.boundaryCheckEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: checkCallback,
            callbackScope: this.scene,
            loop: true,
        });
    }

    stopBoundaryCheck() {
        if (this.boundaryCheckEvent) {
            this.boundaryCheckEvent.remove();
        }
    }
}
