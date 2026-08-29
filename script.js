let giocoScelto = "";
let giocatori = [];
let punteggi = [];
let storico = [];
let numeroTurno = 1;
let obiettivoPartita = 500;


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
// CAMBIO OBIETTIVO
// =========================

function cambiaObiettivo() {

    const selettore =
        document.getElementById("obiettivo");

    const personalizzato =
        document.getElementById("obiettivo-personalizzato");


    if (selettore.value === "personalizzato") {

        personalizzato.style.display = "block";

    } else {

        personalizzato.style.display = "none";

        personalizzato.value = "";
    }
}


// =========================
// AGGIUNGI GIOCATORE
// =========================

function aggiungiGiocatore() {

    const input =
        document.getElementById("nome-giocatore");

    const nome =
        input.value.trim();


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

    const lista =
        document.getElementById("lista-giocatori");

    lista.innerHTML = "";


    giocatori.forEach(function(nome, indice) {

        const elemento =
            document.createElement("p");

        elemento.textContent =
            (indice + 1) + ". " + nome;

        lista.appendChild(elemento);
    });
}


// =========================
// TORNA HOME
// =========================

function tornaHome() {

    document.getElementById("home").style.display = "block";

    document.getElementById("nuova-partita").style.display = "none";

    document.getElementById("partita").style.display = "none";


    giocatori = [];

    punteggi = [];

    storico = [];

    numeroTurno = 1;

    obiettivoPartita = 500;
}


// =========================
// INIZIA PARTITA
// =========================

function iniziaPartita() {

    if (giocatori.length < 2) {

        alert("Servono almeno 2 giocatori!");

        return;
    }


    const obiettivo =
        document.getElementById("obiettivo");


    // OBIETTIVO PERSONALIZZATO

    if (obiettivo.value === "personalizzato") {

        const personalizzato =
            document.getElementById(
                "obiettivo-personalizzato"
            );


        const valore =
            Number(personalizzato.value);


        if (!valore || valore <= 0) {

            alert(
                "Inserisci un obiettivo valido."
            );

            return;
        }


        obiettivoPartita = valore;

    } else {

        obiettivoPartita =
            Number(obiettivo.value);
    }


    // AZZERIAMO I PUNTEGGI

    punteggi = [];

    storico = [];


    for (
        let i = 0;
        i < giocatori.length;
        i++
    ) {

        punteggi.push(0);
    }


    numeroTurno = 1;


    // CAMBIO SCHERMATA

    document.getElementById(
        "nuova-partita"
    ).style.display = "none";


    document.getElementById(
        "partita"
    ).style.display = "block";


    document.getElementById(
        "titolo-partita"
    ).textContent = giocoScelto;


    document.getElementById(
        "numero-mano"
    ).textContent =
        "Turno " + numeroTurno;


    document.getElementById(
        "obiettivo-display"
    ).textContent =
        "🎯 Obiettivo: " +
        obiettivoPartita +
        " punti";


    creaSelettoreVincitore();

    creaTabellone();

    mostraStorico();
}


// =========================
// SELETTORE VINCITORE
// =========================

function creaSelettoreVincitore() {

    const selettore =
        document.getElementById(
            "giocatore-vincitore"
        );


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
// TABELLONE
// =========================

function creaTabellone() {

    const tabellone =
        document.getElementById(
            "tabellone"
        );


    tabellone.innerHTML = "";


    giocatori.forEach(function(nome, indice) {

        const riga =
            document.createElement("div");


        riga.className = "score-row";


        const nomeElemento =
            document.createElement("strong");


        nomeElemento.textContent =
            nome;


        const punteggioElemento =
            document.createElement("span");


        punteggioElemento.textContent =
            "Totale: " +
            punteggi[indice];


        riga.appendChild(nomeElemento);

        riga.appendChild(punteggioElemento);


        tabellone.appendChild(riga);
    });
}


// =========================
// AGGIUNGI TURNO
// =========================

function aggiungiMano() {

    const selettore =
        document.getElementById(
            "giocatore-vincitore"
        );


    const input =
        document.getElementById("punti");


    const indiceVincitore =
        Number(selettore.value);


    const punti =
        Number(input.value);


    if (input.value === "") {

        alert(
            "Inserisci il punteggio."
        );

        return;
    }


    if (punti < 0) {

        alert(
            "Il punteggio non può essere negativo."
        );

        return;
    }


    // TUTTI PARTONO DA ZERO

    const puntiTurno =
        new Array(
            giocatori.length
        ).fill(0);


    // SOLO IL VINCITORE PRENDE PUNTI

    puntiTurno[indiceVincitore] =
        punti;


    // AGGIORNIAMO IL TOTALE

    punteggi[indiceVincitore] +=
        punti;


    // SALVIAMO IL TURNO

    storico.push({

        numero: numeroTurno,

        vincitore: indiceVincitore,

        punti: puntiTurno
    });


    // PASSIAMO AL TURNO SUCCESSIVO

    numeroTurno++;


    input.value = "";

    selettore.selectedIndex = 0;


    document.getElementById(
        "numero-mano"
    ).textContent =
        "Turno " + numeroTurno;


    creaTabellone();

    mostraStorico();


    controllaVittoria();
}


// =========================
// STORICO
// =========================

function mostraStorico() {

    const storicoElemento =
        document.getElementById(
            "storico"
        );


    storicoElemento.innerHTML =
        "<h2>📋 Storico turni</h2>";


    if (storico.length === 0) {

        storicoElemento.innerHTML +=
            "<p>Nessun turno ancora registrato.</p>";

        return;
    }


    storico.forEach(function(turno) {

        const riga =
            document.createElement("div");


        riga.className =
            "storico-riga";


        const vincitore =
            giocatori[
                turno.vincitore
            ];


        const punti =
            turno.punti[
                turno.vincitore
            ];


        riga.innerHTML =
            "<strong>Turno " +
            turno.numero +
            "</strong><br>" +
            "🏆 " +
            vincitore +
            " +" +
            punti +
            " punti";


        storicoElemento.appendChild(
            riga
        );
    });
}


// =========================
// ANNULLA ULTIMO TURNO
// =========================

function annullaUltimoTurno() {

    if (storico.length === 0) {

        alert(
            "Non ci sono turni da annullare."
        );

        return;
    }


    const ultimoTurno =
        storico.pop();


    for (
        let i = 0;
        i < giocatori.length;
        i++
    ) {

        punteggi[i] -=
            ultimoTurno.punti[i];
    }


    numeroTurno--;


    document.getElementById(
        "numero-mano"
    ).textContent =
        "Turno " + numeroTurno;


    document.getElementById(
        "punti"
    ).value = "";


    creaTabellone();

    mostraStorico();
}


// =========================
// CONTROLLO VITTORIA
// =========================

function controllaVittoria() {

    for (
        let i = 0;
        i < punteggi.length;
        i++
    ) {

        if (
            punteggi[i] >=
            obiettivoPartita
        ) {

            alert(
                "🏆 " +
                giocatori[i] +
                " ha raggiunto " +
                obiettivoPartita +
                " punti e ha vinto!"
            );

            return;
        }
    }
}
function cambiaObiettivo() {

    const selettore = document.getElementById("obiettivo");
    const campo = document.getElementById("obiettivo-personalizzato");

    if (selettore.value === "personalizzato") {

        campo.style.display = "block";

    } else {

        campo.style.display = "none";
        campo.value = "";
    }
}
