let giocoScelto = "";
let giocatori = [];
let punteggi = [];
let numeroMano = 1;

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
        alert("Inserisci un nome.");
        return;
    }

    if (giocatori.length >= 6) {
        alert("Massimo 6 giocatori.");
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
    document.getElementById("home").style.display = "block";
    document.getElementById("nuova-partita").style.display = "none";
    document.getElementById("partita").style.display = "none";

    giocatori = [];
    punteggi = [];
    numeroMano = 1;
}

function iniziaPartita() {
    if (giocatori.length < 2) {
        alert("Servono almeno 2 giocatori!");
        return;
    }

    punteggi = [];

    for (let i = 0; i < giocatori.length; i++) {
        punteggi.push(0);
    }

    numeroMano = 1;

    document.getElementById("nuova-partita").style.display = "none";
    document.getElementById("partita").style.display = "block";

    document.getElementById("titolo-partita").textContent = giocoScelto;

    creaTabellone();
}

function creaTabellone() {
    const tabellone = document.getElementById("tabellone");

    tabellone.innerHTML = "";

    giocatori.forEach(function(nome, indice) {

        const riga = document.createElement("div");

        riga.className = "score-row";

        riga.innerHTML = `
            <strong>${nome}</strong>
            <span>Totale: ${punteggi[indice]}</span>

            <input
                type="number"
                id="punteggio-${indice}"
                placeholder="Punti"
                min="0"
            >
        `;

        tabellone.appendChild(riga);
    });
}

function aggiungiMano() {
    let nuoviPunteggi = [];

    for (let i = 0; i < giocatori.length; i++) {

        const input = document.getElementById("punteggio-" + i);

        if (input.value === "") {
            alert("Inserisci i punti di tutti i giocatori.");
            return;
        }

        const punti = Number(input.value);

        if (punti < 0) {
            alert("I punti non possono essere negativi.");
            return;
        }

        nuoviPunteggi.push(punti);
    }

    for (let i = 0; i < giocatori.length; i++) {
        punteggi[i] += nuoviPunteggi[i];
    }

    numeroMano++;

    document.getElementById("numero-mano").textContent =
        "Mano " + numeroMano;

    creaTabellone();
}
