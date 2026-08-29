let giocoScelto = "";
let giocatori = [];

function scegliGioco(gioco) {

    giocoScelto = gioco;

    document.getElementById("home").style.display = "none";
    document.getElementById("nuova-partita").style.display = "block";

    document.getElementById("titolo-gioco").textContent = gioco;
}

function aggiungiGiocatore() {

    const input = document.getElementById("nome-giocatore");
    const nome = input.value.trim();

    if (nome === "") {
        return;
    }

    giocatori.push(nome);

    input.value = "";

    mostraGiocatori();
}

function mostraGiocatori() {

    const lista = document.getElementById("lista-giocatori");

    lista.innerHTML = "";

    giocatori.forEach(function(nome, indice) {

        const elemento = document.createElement("p");

        elemento.textContent = (indice + 1) + ". " + nome;

        lista.appendChild(elemento);
    });
}

function tornaHome() {

    document.getElementById("nuova-partita").style.display = "none";
    document.getElementById("home").style.display = "block";

    giocatori = [];
}

function iniziaPartita() {

    if (giocatori.length < 2) {
        alert("Servono almeno 2 giocatori!");
        return;
    }

    alert(
        "Partita di " +
        giocoScelto +
        " iniziata!\n\nGiocatori: " +
        giocatori.join(", ")
    );
}
