let giocoScelto = "";
let giocatori = [];
let punteggi = [];
let storico = [];
let numeroTurno = 1;


// =========================
// SCELTA DEL GIOCO
// =========================

function scegliGioco(gioco) {

    giocoScelto = gioco;

    document.getElementById("home").style.display = "none";
    document.getElementById("nuova-partita").style.display = "block";

    document.getElementById("titolo-gioco").textContent = gioco;
}


// =========================
// AGGIUNGI GIOCATORE
// =========================

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


// =========================
// MOSTRA GIOCATORI
// =========================

function mostraGiocatori() {

    const lista = document.getElementById("lista-giocatori");

    lista.innerHTML = "";

    giocatori.forEach(function(nome, indice) {

        const elemento = document.createElement("p");

        elemento.textContent =
            (indice + 1) + ". " + nome;

        lista.appendChild(elemento);
    });
}


// =========================
// TORNA ALLA HOME
// =========================

function tornaHome() {

    document.getElementById("home").style.display = "block";
    document.getElementById("nuova-partita").style.display = "none";
    document.getElementById("partita").style.display = "none";

    giocatori = [];
    punteggi = [];
    storico = [];
    numeroTurno = 1;
}


// =========================
// INIZIA PARTITA
// =========================

function iniziaPartita() {

    if (giocatori.length < 2) {
        alert("Servono almeno 2 giocatori!");
        return;
    }

    punteggi = [];
    storico = [];

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
    mostraStorico();
}


// =========================
// SELETTORE GIOCATORI
// =========================

function creaSelettoreGiocatori() {

    const selettore =
        document.getElementById("giocatore-punti");

    selettore.innerHTML = "";

    giocatori.forEach(function(nome, indice) {

        const opzione =
            document.createElement("option");

        opzione.value = indice;
        opzione.textContent = nome;

        selettore.appendChild(opzione);
    });
}


// =========================
// TABELLONE TOTALI
// =========================

function creaTabellone() {

    const tabellone =
        document.getElementById("tabellone");

    tabellone.innerHTML = "";

    giocatori.forEach(function(nome, indice) {

        const riga =
            document.createElement("div");

        riga.className = "score-row";

        riga.innerHTML = `
            <strong>${nome}</strong>
            <span>Totale: ${punteggi[indice]}</span>
        `;

        tabellone.appendChild(riga);
    });
}


// =========================
// STORICO TURNI
// =========================

function mostraStorico() {

    let storicoElemento =
        document.getElementById("storico");

    if (!storicoElemento) {

        storicoElemento =
            document.createElement("div");

        storicoElemento.id = "storico";

        document.getElementById("partita")
            .appendChild(storicoElemento);
    }

    storicoElemento.innerHTML =
        "<h2>Storico turni</h2>";

    if (storico.length === 0) {

        storicoElemento.innerHTML +=
            "<p>Nessun turno ancora registrato.</p>";

        return;
    }

    storico.forEach(function(turno) {

        const riga =
            document.createElement("div");

        riga.className = "storico-riga";

        let testo =
            "<strong>Turno " +
            turno.numero +
            "</strong><br>";

        giocatori.forEach(function(nome, indice) {

            testo +=
                nome +
                ": " +
                turno.punti[indice] +
                " punti<br>";
        });

        riga.innerHTML = testo;

        storicoElemento.appendChild(riga);
    });
}


// =========================
// AGGIUNGI NUOVO TURNO
// =========================

function aggiungiMano() {

    const selettore =
        document.getElementById("giocatore-punti");

    const input =
        document.getElementById("punti");

    const indiceGiocatore =
        Number(selettore.value);

    const punti =
        Number(input.value);


    // Controllo punteggio

    if (input.value === "") {

        alert("Inserisci il punteggio.");

        return;
    }


    if (punti < 0) {

        alert("Il punteggio non può essere negativo.");

        return;
    }


    // Tutti i giocatori partono da zero

    const puntiTurno =
        new Array(giocatori.length).fill(0);


    // Solo il giocatore selezionato riceve punti

    puntiTurno[indiceGiocatore] =
        punti;


    // Aggiorna il totale

    punteggi[indiceGiocatore] +=
        punti;


    // Salva il turno

    storico.push({

        numero: numeroTurno,

        punti: puntiTurno

    });


    // Passa al turno successivo

    numeroTurno++;


    document.getElementById("numero-mano").textContent =
        "Turno " + numeroTurno;


    // Svuota il campo punti

    input.value = "";


    // Torna automaticamente al primo giocatore

    selettore.selectedIndex = 0;


    // Aggiorna schermata

    creaTabellone();

    mostraStorico();
}


// =========================
// ANNULLA ULTIMO TURNO
// =========================

function annullaUltimoTurno() {

    // Controlla se esiste un turno da annullare

    if (storico.length === 0) {

        alert("Non ci sono turni da annullare.");

        return;
    }


    // Recupera l'ultimo turno

    const ultimoTurno =
        storico.pop();


    // Togli i punti dal totale

    for (let i = 0; i < giocatori.length; i++) {

        punteggi[i] -=
            ultimoTurno.punti[i];
    }


    // Torna al turno precedente

    numeroTurno--;


    // Aggiorna il numero del turno

    document.getElementById("numero-mano").textContent =
        "Turno " + numeroTurno;


    // Svuota il campo punti

    document.getElementById("punti").value = "";


    // Aggiorna tabellone e storico

    creaTabellone();

    mostraStorico();
}
