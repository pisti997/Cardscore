let giocoScelto = "";
let giocatori = [];
let punteggi = [];
let numeroTurno = 1;


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
        alert("Puoi inserire massimo 6 giocatori.");
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
    numeroTurno = 1;
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

    numeroTurno = 1;

    document.getElementById("nuova-partita").style.display = "none";
    document.getElementById("partita").style.display = "block";

    document.getElementById("titolo-partita").textContent =
        giocoScelto;

    document.getElementById("numero-mano").textContent =
        "Turno " + numeroTurno;

    creaSelettoreGiocatori();
    creaTabellone();
}


function creaSelettoreGiocatori() {

    const selettore = document.getElementById("giocatore-punti");

    selettore.innerHTML = "";

    giocatori.forEach(function(nome, indice) {

        const opzione = document.createElement("option");

        opzione.value = indice;
        opzione.textContent = nome;

        selettore.appendChild(opzione);
    });
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
        `;

        tabellone.appendChild(riga);
    });
}


function aggiungiMano() {

    const selettore = document.getElementById("giocatore-punti");
    const input = document.getElementById("punti");

    const indiceGiocatore = Number(selettore.value);
    const punti = Number(input.value);


    if (input.value === "") {
        alert("Inserisci il punteggio.");
        return;
    }


    if (punti < 0) {
        alert("Il punteggio non può essere negativo.");
        return;
    }


    // Aggiungiamo i punti solo al giocatore selezionato
    punteggi[indiceGiocatore] += punti;


    // Passiamo al turno successivo
    numeroTurno++;

    document.getElementById("numero-mano").textContent =
        "Turno " + numeroTurno;


    // Svuotiamo il campo
    input.value = "";


    // Aggiorniamo il tabellone
    creaTabellone();
}
