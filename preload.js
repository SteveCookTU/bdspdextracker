const {
    contextBridge,
    ipcRenderer
} = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            let validChannels = ["pokeDivClick", "addImageClick", "checkComplete", "returnHome", "getPath"]
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            let validChannels = ["reloadImage", "isComplete", "initPath"]
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    }
)