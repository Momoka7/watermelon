import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

const config = {
    title: "合成大西瓜",
    type: Phaser.AUTO,
    width: 480,
    height: 720,
    parent: "game-container",
    backgroundColor: "#F3F3F3",
    pixelArt: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "matter",
        matter: {
            gravity: { y: 0.5 },
            debug: false,
        },
    },
    dom: {
        createContainer: true,
    },
    scene: [GameScene],
};

new Phaser.Game(config);
