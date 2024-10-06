import Phaser from "phaser";
import { FRUITS } from "../config/FruitConfig.js";
import FruitFactory from "../managers/FruitFactory.js";
import ScoreManager from "../managers/ScoreManager.js";
import BoundaryManager from "../managers/BoundaryManager.js";
import GameOverManager from "../managers/GameOverManager.js";
import LeaderboardManager from "../managers/LeaderboardManager.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.nextFruit = null;
        this.nextFruitIndicator = null;
        this.gameOver = false;
        this.canPlaceFruit = true; // 添加这个新属性
    }

    create() {
        this.gameOver = false;

        this.fruitFactory = new FruitFactory(this);
        this.scoreManager = new ScoreManager(this);
        this.boundaryManager = new BoundaryManager(this);
        this.gameOverManager = new GameOverManager(this);
        this.leaderboardManager = new LeaderboardManager(this);

        this.matter.world.setBounds(
            0,
            0,
            this.game.config.width,
            this.game.config.height
        );

        this.scoreManager.createScoreText();
        this.leaderboardManager.createLeaderboardButton();

        this.nextFruitIndicator = this.add.circle(
            this.game.config.width - 40,
            40,
            20,
            0xffffff
        );

        this.boundaryManager.createBoundary();

        this.createNextFruit();
        this.input.on("pointerdown", this.handlePointerDown, this);

        this.matter.world.on("collisionstart", this.handleCollision, this);

        this.boundaryManager.startBoundaryCheck(this.checkBoundary.bind(this));
    }

    handlePointerDown(pointer) {
        if (this.gameOver || !this.canPlaceFruit) {
            return;
        }

        const leaderboardButton =
            this.leaderboardManager.getLeaderboardButton();
        if (
            leaderboardButton &&
            leaderboardButton.getBounds().contains(pointer.x, pointer.y)
        ) {
            // 点击了排行榜按钮，不需要在这里处理
            return;
        }

        // 检查点击是否在排行榜容器内
        if (
            this.leaderboardManager.leaderboardContainer &&
            this.leaderboardManager.leaderboardContainer.visible &&
            this.leaderboardManager.leaderboardContainer
                .getBounds()
                .contains(pointer.x, pointer.y)
        ) {
            return;
        }

        this.dropFruit(pointer);
    }

    createNextFruit() {
        this.nextFruit = this.fruitFactory.createNextFruit();
        if (this.nextFruitIndicator) {
            this.nextFruitIndicator.setFillStyle(this.nextFruit.color);
            this.nextFruitIndicator.setRadius(this.nextFruit.radius);
        }
    }

    dropFruit(pointer) {
        if (!this.nextFruit) return;

        const x = pointer.x;
        const y = 50;
        this.fruitFactory.createFruit(this.nextFruit, x, y);
        this.createNextFruit();
    }

    handleCollision(event) {
        event.pairs.forEach((pair) => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            const fruitA = bodyA.gameObject;
            const fruitB = bodyB.gameObject;

            if (fruitA && fruitB) {
                const dataA = fruitA.getData("fruitData");
                const dataB = fruitB.getData("fruitData");

                if (
                    dataA &&
                    dataB &&
                    dataA.name === dataB.name &&
                    dataA.nextFruit
                ) {
                    this.mergeFruits(fruitA, fruitB, dataA.nextFruit);
                    this.scoreManager.addScore(dataA.score);
                }
            }

            if (
                (bodyA.label === "boundary" || bodyB.label === "boundary") &&
                ((fruitA && !fruitA.getData("isNew")) ||
                    (fruitB && !fruitB.getData("isNew")))
            ) {
                this.gameOver = true;
                this.showGameOver();
            }
        });
    }

    checkBoundary() {
        if (this.gameOver) return;

        const fruits = this.matter.world.localWorld.bodies.filter(
            (body) => body.gameObject && body.gameObject.getData("fruitData")
        );
        for (let fruit of fruits) {
            if (
                fruit.position.y <=
                    this.boundaryManager.boundarySensor.position.y &&
                !fruit.gameObject.getData("isNew")
            ) {
                this.gameOver = true;
                this.showGameOver();
                break;
            }
        }
    }

    mergeFruits(fruitA, fruitB, nextFruitName) {
        const nextFruitData = FRUITS.find((f) => f.name === nextFruitName);
        const midX = (fruitA.x + fruitB.x) / 2;
        const midY = (fruitA.y + fruitB.y) / 2;

        fruitA.destroy();
        fruitB.destroy();

        this.fruitFactory.createFruit(nextFruitData, midX, midY);
    }

    showGameOver() {
        this.gameOverManager.showGameOverDialog(
            this.scoreManager.getScore(),
            () => {
                this.scene.restart();
            },
            async (username, score) => {
                return await this.leaderboardManager.submitScore(
                    username,
                    score
                );
            }
        );
    }

    shutdown() {
        this.boundaryManager.stopBoundaryCheck();
        this.input.off("pointerdown", this.handlePointerDown, this);
        this.matter.world.off("collisionstart", this.handleCollision, this);
    }
}
