export default class LeaderboardManager {
    constructor(scene) {
        this.scene = scene;
        this.leaderboardData = [];
        this.leaderboardContainer = null;
        this.isLeaderboardVisible = false;
        this.leaderboardButton = null;
        this.loadingText = null;
    }

    createLeaderboardButton() {
        this.leaderboardButton = this.scene.add
            .text(10, 20, "排行榜", {
                fontSize: "20px",
                fill: "#000",
                backgroundColor: "#4CAF50",
                padding: { x: 10, y: 5 },
            })
            .setInteractive();

        this.leaderboardButton.on("pointerdown", () =>
            this.toggleLeaderboard()
        );
    }

    getLeaderboardButton() {
        return this.leaderboardButton;
    }

    async fetchLeaderboard() {
        try {
            const response = await fetch(
                "https://mellon-ranking.1611639260.workers.dev/rankings"
            );
            this.leaderboardData = await response.json();
            this.updateLeaderboardDisplay();
        } catch (error) {
            console.error("获取排行榜失败:", error);
            this.showErrorMessage("获取排行榜失败，请稍后再试");
        }
    }

    updateLeaderboardDisplay() {
        if (this.loadingText) {
            this.loadingText.destroy();
        }

        if (this.leaderboardContainer) {
            this.leaderboardContainer.removeAll(true);
        } else {
            this.leaderboardContainer = this.scene.add.container(0, 0);
        }

        const { width, height } = this.scene.game.config;

        const background = this.scene.add.rectangle(
            width / 2,
            height / 2,
            width * 0.8,
            height * 0.8,
            0x000000,
            0.8
        );
        this.leaderboardContainer.add(background);

        const title = this.scene.add
            .text(width / 2, height * 0.15, "排行榜", {
                fontSize: "32px",
                fill: "#ffffff",
                padding: { top: 8, bottom: 8 },
            })
            .setOrigin(0.5);
        this.leaderboardContainer.add(title);

        this.leaderboardData.forEach((entry, index) => {
            const yPos = height * 0.25 + index * 40;
            const rankText = this.scene.add.text(
                width * 0.2,
                yPos,
                `${index + 1}`,
                {
                    fontSize: "24px",
                    fill: "#ffffff",
                }
            );
            const nameText = this.scene.add.text(
                width * 0.35,
                yPos,
                entry.username,
                {
                    fontSize: "24px",
                    fill: "#ffffff",
                }
            );
            const scoreText = this.scene.add.text(
                width * 0.7,
                yPos,
                `${entry.score}`,
                {
                    fontSize: "24px",
                    fill: "#ffffff",
                }
            );
            this.leaderboardContainer.add([rankText, nameText, scoreText]);
        });

        const closeButton = this.scene.add
            .text(width * 0.8, height * 0.15, "X", {
                fontSize: "32px",
                fill: "#ffffff",
            })
            .setInteractive();
        closeButton.on("pointerdown", () => this.toggleLeaderboard());
        this.leaderboardContainer.add(closeButton);
    }

    showLoadingMessage() {
        const { width, height } = this.scene.game.config;
        this.loadingText = this.scene.add
            .text(width / 2, height / 2, "请求数据中...", {
                fontSize: "24px",
                fill: "#000",
                padding: { top: 8, bottom: 8 },
            })
            .setOrigin(0.5);
        this.leaderboardContainer.add(this.loadingText);
    }

    showErrorMessage(message) {
        if (this.loadingText) {
            this.loadingText.destroy();
        }
        const { width, height } = this.scene.game.config;
        this.loadingText = this.scene.add
            .text(width / 2, height / 2, message, {
                fontSize: "24px",
                fill: "#ff0000",
                padding: { top: 8, bottom: 8 },
            })
            .setOrigin(0.5);
        this.leaderboardContainer.add(this.loadingText);
    }

    toggleLeaderboard() {
        this.isLeaderboardVisible = !this.isLeaderboardVisible;

        if (this.isLeaderboardVisible) {
            if (!this.leaderboardContainer) {
                this.leaderboardContainer = this.scene.add.container(0, 0);
                this.showLoadingMessage();
                this.fetchLeaderboard();
            } else {
                this.leaderboardContainer.setVisible(true);
            }
        } else if (this.leaderboardContainer) {
            this.leaderboardContainer.setVisible(false);
        }

        // 立即设置canPlaceFruit为false
        this.scene.canPlaceFruit = false;

        // 添加一个短暂的延迟，然后允许放置水果
        this.scene.time.delayedCall(200, () => {
            this.scene.canPlaceFruit = true;
        });
    }

    isLeaderboardOpen() {
        return this.isLeaderboardVisible;
    }

    async submitScore(username, score) {
        try {
            const response = await fetch(
                "https://mellon-ranking.1611639260.workers.dev/rankings/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, score }),
                }
            );
            if (response.ok) {
                console.log("分数提交成功");
                this.fetchLeaderboard(); // 刷新排行榜
                return true;
            } else {
                console.error("分数提交失败");
                return false;
            }
        } catch (error) {
            console.error("提交分数时出错:", error);
            return false;
        }
    }
}
