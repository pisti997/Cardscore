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

    document.getElementById("titolo-partita").textContent =
        giocoScelto;

    creaTabellone();
}


function creaTabellone() {

    const tabellone = document.getElementById("tabellone");

    tabellone.innerHTML = "";

    giocatori.forEach(function(nome, indice) {

        const riga = document.createElement("div");

        riga.className = "score-row";

        riga.innerHTML = `
            <div>
                <strong>${nome}</strong>
                <br>
                <span>Totale: ${punteggi[indice]}</span>
            </div>

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

    let validi = true;
    let nuoviPunteggi = [];

    for (let i = 0; i < giocatori.length; i++) {

        const input = document.getElementById("punteggio-" + i);

        const punti = Number(input.value);

        if (input.value === "" || punti < 0) {
            validi = false;
            break;
        }

        nuoviPunteggi.push(punti);
    }

    if (!validi) {
        alert("Inserisci i punti di tutti i giocatori.");
        return;
    }

    for (let i = 0; i < giocatori.length; i++) {
        punteggi[i] += nuoviPunteggi[i];
    }

    numeroMano++;

    document.getElementById("numero-mano").textContent =
        "Mano " + numeroMano;

    creaTabellone();
}
