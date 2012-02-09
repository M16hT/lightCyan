(function (window) {

	var oMeeting, fpPreStart, fpGameInterval, fpCallGameObjectMethods, oGameExecution,
		oModules = {},
		aGameObjects = [],
		aToRemove = [],
		nFps = 24,
		nDrawInterval = 0,
		oCanvas = {
			main : null,
			mainContext : null,
			buffer : null,
			bufferContext : null
		};

	window.addEventListener("keydown", function (eEvent) {
		oGameExecution.keyPush(eEvent);
	}, false);

	window.addEventListener("keyup", function (eEvent) {
		oGameExecution.keyPush(eEvent);
	}, false);

	oPreStart = {
		buildModules : function () {
			var sModule,
				oModule,
				oSandbox = {
					meeting : oMeeting,
					canvas : oCanvas,
					settings : {
						fps : nFps
					}
				};

			// Build Modules.
			for (sModule in oModules) {
				if (oModules.hasOwnProperty(sModule)) {
					oModule = oModules[sModule];
					if (typeof oModule !== 'undefined') {
						oModule.oInstance = oModule.fpBuilder(oSandbox);
										
						if (oModule.oInstance.init) {
							oModule.oInstance.init();
						}
					}
				}
			}
		},
		startGame : function () {

			oMeeting.speak({
				message : "#start#",
				data : null
			});

			nDrawInterval = 1 / nFps * 1000;
			setInterval(fpGameInterval, nDrawInterval);
		}
	};

	fpGameInterval = function () {
		oGameExecution.remove();
		oGameExecution.update();
		oGameExecution.draw();
	};

	fpCallGameObjectMethods = function (sMethodName, oArgs) {
		var oCurrentGameObject = null;
		var nObjectCount = 0;
		var nGameObjectsLength = aGameObjects.length;

		for (nObjectCount = 0; nObjectCount < nGameObjectsLength; nObjectCount += 1) {
			oCurrentGameObject = aGameObjects[nObjectCount];
			if (oCurrentGameObject[sMethodName]) {
				oCurrentGameObject[sMethodName](oArgs);
			}
		}
	};

	oMeeting = {

		speak : function (oNotification) {
			var nListenersLength,
				nCount,
				oListener,
				aMeetingList = oMeeting[oNotification.message];

			if (typeof aMeetingList !== 'undefined') {
				nListenersLength = aMeetingList.length;
				for (nCount = 0; nCount < nListenersLength; nCount += 1) {
					oListener = aMeetingList[nCount];
					oListener.handler.call(oListener.module, oNotification);
				}
			}
		},

		listen : function (aMessages, fpHandler, oModule) {
			var sMessage = '',
				nMessage = 0,
				nMessages = aMessages.length;

			for (nMessage = 0; nMessage < nMessages; nMessage += 1) {
				sMessage = aMessages[nMessage];
				if (typeof oMeeting[sMessage] === 'undefined') {
					oMeeting[sMessage] = [];
				}
				oMeeting[sMessage].push({
					module: oModule,
					handler: fpHandler
				});
			}
		}
	};

	oGameExecution = {
		remove : function () {
			var nRemoveLength = aToRemove.length;
			var nCount = 0;
			var nCurrentObject = 0;

			for (nCount = 0; nCount < nRemoveLength; nCount += 1) {
				nCurrentObject = aToRemove[nCount];
				aGameObjects.splice(nCurrentObject, 1);
			}

			aToRemove = [];
		},
		update : function () {
			fpCallGameObjectMethods("update", oCanvas);

			// Reordenamos los objetos en el eje Z.
			aGameObjects.sort(function(oObjA, oObjB) {
				return oObjA.z - oObjB.z;
			});
		},
		draw : function () {
			oCanvas.bufferContext.clearRect(0, 0, oCanvas.buffer.width, oCanvas.buffer.height);
			fpCallGameObjectMethods("draw", oCanvas);

			oMeeting.speak({
				message : "#draw#",
				data : null
			});

			oCanvas.mainContext.clearRect(0, 0, oCanvas.main.width, oCanvas.main.height);
			oCanvas.mainContext.drawImage(oCanvas.buffer, 0, 0);
		},
		keyPush : function (eEvent) {
			var sEventType = eEvent.type;
			var nKeyCode = eEvent.keyCode;

			// Control and F5 keys.
			if (nKeyCode !== 17 && nKeyCode !== 116) {
				eEvent.preventDefault();
			}

			fpCallGameObjectMethods(sEventType, nKeyCode);
		}
	};

	// Métodos públicos.
	window.lightCyan = {
		setFps : function (nNewFps) {
			if (typeof nNewFps === 'number') {
				nFps = nNewFps;
			}
		},
		setCanvas : function (sCanvasId) {
			var oMainCanvas;
			if (typeof sCanvasId === 'string') {
				oCanvas.main = document.getElementById(sCanvasId);
				if (oCanvas.main !== null) {
					oCanvas.mainContext = oCanvas.main.getContext('2d');
					oCanvas.buffer = document.createElement('canvas');
					oCanvas.buffer.width = oCanvas.main.width;
					oCanvas.buffer.height = oCanvas.main.height;
					oCanvas.bufferContext = oCanvas.buffer.getContext('2d');
				}
			}
		},
		addGameObject : function (sObjectId, fpObjectBuilder) {
			var oFinalObject = null;
			if (typeof sObjectId === 'string') {
				oFinalObject = fpObjectBuilder();

				if (typeof oFinalObject === 'object') {
					oFinalObject.__id = sObjectId;
					aGameObjects.push(oFinalObject);
				}
			}
		},
		removeGameObject : function (sObjectId) {
			if (typeof sObjectId === 'string') {
				var oCurrentGameObject = null;
				var nObjectCount = 0;
				var nGameObjectsLength = aGameObjects.length;

				for (nObjectCount = 0; nObjectCount < nGameObjectsLength; nObjectCount += 1) {
					oCurrentGameObject = aGameObjects[nObjectCount];
					if (oCurrentGameObject.__id === sObjectId) {
						aToRemove.push(nObjectCount);
					}
				}
			}
		},
		addModule : function (sModuleId, fpBuilder) {
			if (typeof sModuleId === 'string') {
				if (typeof oModules[sModuleId] === 'undefined') {
					oModules[sModuleId] = {
						fpBuilder : fpBuilder,
						oInstance : null
					};
				}
			}
		},
		startGame : function () {
			oPreStart.buildModules();
			oPreStart.startGame();
		}
	};

}(window));