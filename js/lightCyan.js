(function (window) {
 
    var aGameObjects = [];
    var aToRemove = [];
    var nFps = 24;
    var nDrawInterval = 0;
 
     var oCanvas = {
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
 
    var fpGameInterval = function () {
        oGameExecution.remove();
        oGameExecution.update();
        oGameExecution.draw();
    };
 
    var fpCallGameObjectMethods = function (sMethodName, oArgs) {
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
 
    var oGameExecution = {
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
        startGame : function () {
            nDrawInterval = 1 / nFps * 1000;
            setInterval(fpGameInterval, nDrawInterval);
        }
    };
 
}(window));