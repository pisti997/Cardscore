let giocoScelto = "";
let giocatori = [];
let punteggi = [];
let storico = [];
let numeroTurno = 1;
let obiettivoPartita = 500;


// ========================
// SCELTA GIOCO
// ========================

function scegliGioco(gioco) {

    giocoScelto = gioco;

    document.getElementById("home").style.display = "none";

    document.getElementById("nuova-partita").style.display = "block";

    document.getElementById("titolo-gioco").textContent = gioco;
}


// ========================
// OBIETTIVO PERSONALIZZATO
// ========================

document.getElementById("obiettivo").addEventListener(
    "change",
    function() {

        const campo =
            document.getElementById("campo-personalizzato");

        if (this.value === "personalizzato") {

            campo.style.display = "block";

        } else {

            campo.style.display = "none";

            document.getElementById(
                "obiettivo-personalizzato"
            ).value = "";
        }
    }
);


// ========================
// AGGIUNGI GIOCATORE
// ========================

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

        alert("Massimo 6 giocatori.");

        return;
    }


    giocatori.push(nome);

    input.value = "";

    mostraGiocatori();
}


// ========================
// MOSTRA GIOCATORI
// ========================

function mostraGiocatori() {

    const lista =
        document.getElementById("lista-giocatori");

    lista.innerHTML = "";


    giocatori.forEach(
        function(nome, indice) {

            const elemento =
                document.createElement("p");

            elemento.textContent =
                (indice + 1) + ". " + nome;

            lista.appendChild(elemento);
        }
    );
}


// ========================
// TORNA HOME
// ========================

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


// ========================
// INIZIA PARTITA
// ========================

function iniziaPartita() {

    if (giocatori.length < 2) {

        alert("Servono almeno 2 giocatori!");

        return;
    }


    const selettore =
        document.getElementById("obiettivo");


    if (selettore.value === "personalizzato") {

        const campo =
            document.getElementById(
                "obiettivo-personalizzato"
            );


        const valore =
            Number(campo.value);


        if (!valore || valore <= 0) {

            alert(
                "Inserisci un obiettivo valido."
            );

            return;
        }


        obiettivoPartita = valore;

    } else {

        obiettivoPartita =
            Number(selettore.value);
    }


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


    document.getElementById(
        "nuova-partita"
    ).style.display = "none";


    document.getElementById(
        "partita"
    ).style.display = "block";


    document.getElementById(
        "titolo-partita"
    ).textContent =
        giocoScelto;


    document.getElementById(
        "numero-mano"
    ).textContent =
        "Turno 1";


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


// ========================
// SELETTORE VINCITORE
// ========================

function creaSelettoreVincitore() {

    const selettore =
        document.getElementById(
            "giocatore-vincitore"
        );


    selettore.innerHTML = "";


    giocatori.forEach(
        function(nome, indice) {

            const opzione =
                document.createElement("option");

            opzione.value = indice;

            opzione.textContent = nome;

            selettore.appendChild(opzione);
        }
    );
}


// ========================
// TABELLONE
// ========================

function creaTabellone() {

    const tabellone =
        document.getElementById(
            "tabellone"
        );


    tabellone.innerHTML = "";


    giocatori.forEach(
        function(nome, indice) {

            const riga =
                document.createElement("div");

            riga.className = "score-row";


            const nomeElemento =
                document.createElement("strong");

            nomeElemento.textContent =
                nome;


            const puntiElemento =
                document.createElement("span");

            puntiElemento.textContent =
                "Totale: " +
                punteggi[indice];


            riga.appendChild(nomeElemento);

            riga.appendChild(puntiElemento);


            tabellone.appendChild(riga);
        }
    );
}


// ========================
// NUOVO TURNO
// ========================

function aggiungiMano() {

    const selettore =
        document.getElementById(
            "giocatore-vincitore"
        );


    const input =
        document.getElementById("punti");


    const indiceVincitore =
        Number(selettore.value);


    if (input.value === "") {

        alert("Inserisci il punteggio.");

        return;
    }


    const punti =
        Number(input.value);


    if (punti < 0) {

        alert(
            "Il punteggio non può essere negativo."
        );

        return;
    }


    const puntiTurno =
        new Array(
            giocatori.length
        ).fill(0);


    puntiTurno[indiceVincitore] =
        punti;


    punteggi[indiceVincitore] +=
        punti;


    storico.push({

        numero: numeroTurno,

        vincitore: indiceVincitore,

        punti: puntiTurno
    });


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


// ========================
// STORICO
// ========================

function mostraStorico() {

    const elemento =
        document.getElementById(
            "storico"
        );


    elemento.innerHTML =
        "<h2>📋 Storico turni</h2>";


    if (storico.length === 0) {

        elemento.innerHTML +=
            "<p>Nessun turno ancora registrato.</p>";

        return;
    }


    storico.forEach(
        function(turno) {

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


            elemento.appendChild(riga);
        }
    );
}


// ========================
// ANNULLA TURNO
// ========================

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


// ========================
// CONTROLLO VITTORIA
// ========================

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
