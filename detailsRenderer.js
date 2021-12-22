const btnImage = document.getElementById("addImage")
const btnReturn = document.getElementById("return")
const img = document.getElementById("img")
let num = window.location.search.substr(5)
window.api.send("getPath", num)
img.onerror = function() {
    img.hidden = true
}

btnImage.addEventListener('click', () => {
    console.log(num)
    window.api.send("addImageClick", num)
})

btnReturn.addEventListener('click', () => {
    window.api.send("returnHome", "")
})

window.api.receive("reloadImage", function(args) {
    img.hidden = false
    img.setAttribute("src", args)
})

window.api.receive("initPath", function (args) {
    img.setAttribute("src", args)
})