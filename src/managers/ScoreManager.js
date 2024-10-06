export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
        this.scoreText = null;
    }

    createScoreText() {
        this.scoreText = this.scene.add
            .text(this.scene.game.config.width / 2, 20, "分数: 0", {
                fontSize: "24px",
                fill: "#000",
            })
            .setOrigin(0.5);
    }

    addScore(points) {
        this.score += points;
        this.scoreText.setText(`分数: ${this.score}`);
    }

    getScore() {
        return this.score;
    }

    reset() {
        this.score = 0;
        this.scoreText.setText("分数: 0");
    }
}
