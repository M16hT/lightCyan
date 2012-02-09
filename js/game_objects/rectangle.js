lightCyan.addGameObject("rectangulo", function () {

	var nAxisX = 50;
	var nAxisY = 50;
	var nWidth = 25;
	var nHeight = 25;
	var nSpeed = 5;

	var bMoveRight = false;
	var bMoveLeft = false;
	var bMoveUp = false;
	var bMoveDown = false;

	return {
		update : function (canvas) {

			if (bMoveRight === true) {
				nAxisX += nSpeed;
			}
			if (bMoveLeft === true) {
				nAxisX -= nSpeed;
			}
			if (bMoveUp === true) {
				nAxisY -= nSpeed;
			}
			if (bMoveDown === true) {
				nAxisY += nSpeed;
			}
		},
		draw : function (canvas) {
			canvas.bufferContext.beginPath();
			canvas.bufferContext.rect(nAxisX, nAxisY, nWidth, nHeight);
			canvas.bufferContext.fillStyle = "#000";
			canvas.bufferContext.closePath();
			canvas.bufferContext.fill();
		},
		keydown : function (nKeyCode) {
			if (nKeyCode === 39) {
				bMoveRight = true;
			}
			if (nKeyCode === 37) {
				bMoveLeft = true;
			}
			if (nKeyCode === 38) {
				bMoveUp = true;
			}
			if (nKeyCode === 40) {
				bMoveDown = true;
			}
		},
		keyup : function (nKeyCode) {
			if (nKeyCode === 39) {
				bMoveRight = false;
			}
			if (nKeyCode === 37) {
				bMoveLeft = false;
			}
			if (nKeyCode === 38) {
				bMoveUp = false;
			}
			if (nKeyCode === 40) {
				bMoveDown = false;
			}
		}
	};
});