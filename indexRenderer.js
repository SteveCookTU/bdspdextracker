let div = document.getElementById("dexGrid")
let innerDiv;
let text;
for (let i = 0; i < 493; i++) {
    innerDiv = document.createElement("DIV")
    innerDiv.setAttribute("class", "pokediv")
    innerDiv.setAttribute("id", (i + 1).toString())
    text = document.createTextNode((i + 1).toString())
    innerDiv.appendChild(text)
    div.appendChild(innerDiv)
    window.api.send("checkComplete", (i + 1).toString())
}

window.api.receive("isComplete", function (args) {
    let temp = document.getElementById(args[0])
    if(args[1])
        temp.setAttribute("complete", "true")
})

let divs = document.getElementsByClassName('pokediv')
for(let i = 0; i < divs.length; i++) {
    console.log('adding click listeners')
    divs[i].addEventListener('click', () => {
        window.api.send("pokeDivClick", divs[i].getAttribute("id"))
    })
}