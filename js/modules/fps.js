lightCyan.addModule("fps", function (sandbox) {

	var currentFps = 0,
		frameCount = 0,
		lastFps = new Date().getTime(),
		oBuffer = sandbox.canvas.bufferContext;

	return {
		init : function () {
			sandbox.meeting.listen(["#draw#"], this.drawFps, this);
		},

		drawFps : function(oNotification) {

			var thisFrame = new Date().getTime();
			var diffTime = Math.ceil((thisFrame - lastFps));

			if (diffTime >= 1000) {
				currentFps = frameCount;
				frameCount = 0.0;
				lastFps = thisFrame;
			}

			oBuffer.save();
			oBuffer.fillStyle = '#000';
			oBuffer.font = 'bold 12px sans-serif';
			oBuffer.fillText('FPS: ' + currentFps, 10, 15);
			oBuffer.restore();
			frameCount += 1;

		}
	};

});