export default class GameOverManager {
    constructor(scene) {
        this.scene = scene;
    }

    showGameOverDialog(score, restartCallback, submitScoreCallback) {
        const { width, height } = this.scene.game.config;

        const overlay = this.scene.add
            .rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0);

        const gameOverText = this.scene.add
            .text(width / 2, height / 2 - 100, "游戏结束", {
                fontSize: "32px",
                fill: "#ffffff",
            })
            .setOrigin(0.5);

        const finalScoreText = this.scene.add
            .text(width / 2, height / 2 - 50, `最终分数: ${score}`, {
                fontSize: "24px",
                fill: "#ffffff",
            })
            .setOrigin(0.5);

        // 使用 Phaser 的文本输入
        const usernameInput = this.scene.add
            .text(width / 2, height / 2, "点击输入用户名", {
                fontSize: "20px",
                fill: "#ffffff",
                backgroundColor: "#333333",
                padding: { x: 10, y: 5 },
            })
            .setOrigin(0.5)
            .setInteractive();

        this.scene.input.keyboard.on("keydown", (event) => {
            if (event.keyCode === 8 && usernameInput.text.length > 0) {
                usernameInput.text = usernameInput.text.substr(
                    0,
                    usernameInput.text.length - 1
                );
            } else if (
                event.keyCode === 32 ||
                (event.keyCode >= 48 && event.keyCode <= 90)
            ) {
                usernameInput.text += event.key;
            }
        });

        usernameInput.on("pointerdown", () => {
            if (usernameInput.text === "点击输入用户名") {
                usernameInput.text = "";
            }
        });

        const submitButton = this.scene.add
            .text(width / 2, height / 2 + 50, "提交分数", {
                fontSize: "24px",
                fill: "#ffffff",
                backgroundColor: "#4CAF50",
                padding: { x: 10, y: 5 },
            })
            .setOrigin(0.5)
            .setInteractive();

        const successText = this.scene.add
            .text(width / 2, height / 2 + 50, "分数提交成功", {
                fontSize: "24px",
                fill: "#ffffff",
            })
            .setOrigin(0.5)
            .setVisible(false);

        submitButton.on("pointerdown", () => {
            const username = usernameInput.text;
            if (username && username !== "点击输入用户名") {
                submitButton.disableInteractive();
                submitButton.setAlpha(0.5);
                submitScoreCallback(username, score).then((success) => {
                    if (success) {
                        submitButton.setVisible(false);
                        successText.setVisible(true);
                    } else {
                        submitButton.setInteractive();
                        submitButton.setAlpha(1);
                    }
                });
            }
        });

        const restartButton = this.scene.add
            .text(width / 2, height / 2 + 100, "重新开始", {
                fontSize: "24px",
                fill: "#ffffff",
                backgroundColor: "#1a65ac",
                padding: { x: 10, y: 5 },
            })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on("pointerdown", restartCallback);
    }
}
