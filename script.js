let giocoScelto = "";
let giocatori = [];
let punteggi = [];
let storico = [];

let numeroTurno = 1;

let obiettivoPartita = 500;

let sistemaPunteggio = "semplice";

let puntiPerGame = 21;
let gamePerSet = 3;
let setPerMatch = 2;

let gameVinti = [];
let setVinti = [];


// ========================
// SALVA PARTITA
// ========================

function salvaPartita() {

    const partita = {

        gioco: giocoScelto,

        giocatori: giocatori,

        punteggi: punteggi,

        storico: storico,

        turno: numeroTurno,

        obiettivo: obiettivoPartita,

        sistema: sistemaPunteggio,

        puntiGame: puntiPerGame,

        gameSet: gamePerSet,

        setMatch: setPerMatch,

        gameVinti: gameVinti,

        setVinti: setVinti
    };


    localStorage.setItem(
        "cardscore_partita",
        JSON.stringify(partita)
    );
}


// ========================
// MOSTRA PARTITA SALVATA
// ========================

function aggiornaPartitaSalvata() {

    const dati =
        localStorage.getItem("cardscore_partita");


    const sezione =
        document.getElementById("partita-in-corso");


    const contenitore =
        document.getElementById("partita-salvata");


    if (!sezione || !contenitore) {
        return;
    }


    if (!dati) {

        sezione.style.display = "none";

        return;
    }


    try {

        const partita =
            JSON.parse(dati);


        let html =
            "<strong>" +
            partita.gioco +
            "</strong><br>";


        html +=
            "Turno " +
            partita.turno +
            "<br><br>";


        partita.giocatori.forEach(
            function(nome, indice) {

                html +=
                    nome +
                    ": " +
                    partita.punteggi[indice] +
                    " punti<br>";
            }
        );


        contenitore.innerHTML = html;

        sezione.style.display = "block";


    } catch (errore) {

        sezione.style.display = "none";
    }
}


// ========================
// CONTINUA PARTITA
// ========================

function continuaPartita() {

    const dati =
        localStorage.getItem("cardscore_partita");


    if (!dati) {

        alert(
            "Non c'è nessuna partita salvata."
        );

        return;
    }


    try {

        const partita =
            JSON.parse(dati);


        giocoScelto =
            partita.gioco;

        giocatori =
            partita.giocatori;

        punteggi =
            partita.punteggi;

        storico =
            partita.storico || [];

        numeroTurno =
            partita.turno;

        obiettivoPartita =
            partita.obiettivo;

        sistemaPunteggio =
            partita.sistema || "semplice";

        puntiPerGame =
            partita.puntiGame || 21;

        gamePerSet =
            partita.gameSet || 3;

        setPerMatch =
            partita.setMatch || 2;

        gameVinti =
            partita.gameVinti ||
            new Array(giocatori.length).fill(0);

        setVinti =
            partita.setVinti ||
            new Array(giocatori.length).fill(0);


        document.getElementById(
            "home"
        ).style.display = "none";


        document.getElementById(
            "nuova-partita"
        ).style.display = "none";


        document.getElementById(
            "partita"
        ).style.display = "block";


        aggiornaSchermataPartita();


    } catch (errore) {

        alert(
            "Non è stato possibile recuperare la partita."
        );
    }
}


// ========================
// NUOVA PARTITA
// ========================

function nuovaPartita() {

    localStorage.removeItem(
        "cardscore_partita"
    );


    giocatori = [];

    punteggi = [];

    storico = [];

    gameVinti = [];

    setVinti = [];

    numeroTurno = 1;


    document.getElementById(
        "partita-in-corso"
    ).style.display = "none";


    document.getElementById(
        "home"
    ).style.display = "none";


    document.getElementById(
        "nuova-partita"
    ).style.display = "block";
}


// ========================
// SCELTA GIOCO
// ========================

function scegliGioco(gioco) {

    giocoScelto = gioco;


    giocatori = [];

    punteggi = [];

    storico = [];

    numeroTurno = 1;


    document.getElementById(
        "home"
    ).style.display = "none";


    document.getElementById(
        "nuova-partita"
    ).style.display = "block";


    document.getElementById(
        "titolo-gioco"
    ).textContent = gioco;
}


// ========================
// SISTEMA DI PUNTEGGIO
// ========================

function cambiaSistemaPunteggio() {

    const sistema =
        document.getElementById(
            "sistema-punteggio"
        ).value;


    sistemaPunteggio =
        sistema;


    const impostazioni =
        document.getElementById(
            "impostazioni-game-set"
        );


    const semplici =
        document.getElementById(
            "impostazioni-semplici"
        );


    if (sistema === "game-set") {

        impostazioni.style.display =
            "block";

        semplici.style.display =
            "none";

    } else {

        impostazioni.style.display =
            "none";

        semplici.style.display =
            "block";
    }
}


// ========================
// OBIETTIVO PERSONALIZZATO
// ========================

function controllaObiettivo() {

    const selettore =
        document.getElementById(
            "obiettivo"
        );


    const campo =
        document.getElementById(
            "campo-personalizzato"
        );


    if (
        selettore.value ===
        "personalizzato"
    ) {

        campo.style.display =
            "block";

    } else {

        campo.style.display =
            "none";

        document.getElementById(
            "obiettivo-personalizzato"
        ).value = "";
    }
}


// ========================
// INIZIALIZZAZIONE
// ========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const sistema =
            document.getElementById(
                "sistema-punteggio"
            );


        if (sistema) {

            sistema.addEventListener(
                "change",
                cambiaSistemaPunteggio
            );
        }


        const obiettivo =
            document.getElementById(
                "obiettivo"
            );


        if (obiettivo) {

            obiettivo.addEventListener(
                "change",
                controllaObiettivo
            );
        }


        aggiornaPartitaSalvata();
    }
);


// ========================
// AGGIUNGI GIOCATORE
// ========================

function aggiungiGiocatore() {

    const input =
        document.getElementById(
            "nome-giocatore"
        );


    const nome =
        input.value.trim();


    if (nome === "") {

        alert(
            "Inserisci un nome."
        );

        return;
    }


    if (giocatori.length >= 6) {

        alert(
            "Massimo 6 giocatori."
        );

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
        document.getElementById(
            "lista-giocatori"
        );


    lista.innerHTML = "";


    giocatori.forEach(
        function(nome, indice) {

            const elemento =
                document.createElement(
                    "p"
                );


            elemento.textContent =
                (indice + 1) +
                ". " +
                nome;


            lista.appendChild(
                elemento
            );
        }
    );
}


// ========================
// TORNA HOME
// ========================

function tornaHome() {

    document.getElementById(
        "home"
    ).style.display = "block";


    document.getElementById(
        "nuova-partita"
    ).style.display = "none";


    document.getElementById(
        "partita"
    ).style.display = "none";


    aggiornaPartitaSalvata();
}


// ========================
// INIZIA PARTITA
// ========================

function iniziaPartita() {

    if (giocatori.length < 2) {

        alert(
            "Servono almeno 2 giocatori!"
        );

        return;
    }


    sistemaPunteggio =
        document.getElementById(
            "sistema-punteggio"
        ).value;


    // ========================
    // SISTEMA SEMPLICE
    // ========================

    if (
        sistemaPunteggio ===
        "semplice"
    ) {

        const selettore =
            document.getElementById(
                "obiettivo"
            );


        if (
            selettore.value ===
            "personalizzato"
        ) {

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


            obiettivoPartita =
                valore;

        } else {

            obiettivoPartita =
                Number(
                    selettore.value
                );
        }
    }


    // ========================
    // GAME / SET / MATCH
    // ========================

    if (
        sistemaPunteggio ===
        "game-set"
    ) {

        puntiPerGame =
            Number(
                document.getElementById(
                    "punti-game"
                ).value
            );


        gamePerSet =
            Number(
                document.getElementById(
                    "game-set"
                ).value
            );


        setPerMatch =
            Number(
                document.getElementById(
                    "set-match"
                ).value
            );


        if (
            puntiPerGame <= 0 ||
            gamePerSet <= 0 ||
            setPerMatch <= 0
        ) {

            alert(
                "Inserisci valori validi."
            );

            return;
        }
    }


    punteggi = [];

    storico = [];


    gameVinti = [];

    setVinti = [];


    for (
        let i = 0;
        i < giocatori.length;
        i++
    ) {

        punteggi.push(0);

        gameVinti.push(0);

        setVinti.push(0);
    }


    numeroTurno = 1;


    document.getElementById(
        "nuova-partita"
    ).style.display = "none";


    document.getElementById(
        "partita"
    ).style.display = "block";


    aggiornaSchermataPartita();


    salvaPartita();
}


// ========================
// AGGIORNA SCHERMATA
// ========================

function aggiornaSchermataPartita() {

    document.getElementById(
        "titolo-partita"
    ).textContent =
        giocoScelto;


    document.getElementById(
        "numero-mano"
    ).textContent =
        "Turno " +
        numeroTurno;


    creaSelettoreVincitore();


    if (
        sistemaPunteggio ===
        "game-set"
    ) {

        document.getElementById(
            "punteggio-game-set"
        ).style.display =
            "block";


        document.getElementById(
            "punteggio-semplice"
        ).style.display =
            "none";


        document.getElementById(
            "obiettivo-display"
        ).textContent =
            "🎯 " +
            puntiPerGame +
            " punti = Game | " +
            gamePerSet +
            " Game = Set | " +
            setPerMatch +
            " Set = Match";


        creaTabelloneGameSet();

    } else {

        document.getElementById(
            "punteggio-game-set"
        ).style.display =
            "none";


        document.getElementById(
            "punteggio-semplice"
        ).style.display =
            "block";


        document.getElementById(
            "obiettivo-display"
        ).textContent =
            "🎯 Obiettivo: " +
            obiettivoPartita +
            " punti";


        creaTabellone();
    }


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
                document.createElement(
                    "option"
                );


            opzione.value =
                indice;


            opzione.textContent =
                nome;


            selettore.appendChild(
                opzione
            );
        }
    );
}


// ========================
// TABELLONE SEMPLICE
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
                document.createElement(
                    "div"
                );


            riga.className =
                "score-row";


            riga.innerHTML =
                "<strong>" +
                nome +
                "</strong>" +
                "<span>Totale: " +
                punteggi[indice] +
                "</span>";


            tabellone.appendChild(
                riga
            );
        }
    );
}


// ========================
// TABELLONE GAME / SET
// ========================

function creaTabelloneGameSet() {

    const tabellone =
        document.getElementById(
            "tabellone-game-set"
        );


    tabellone.innerHTML = "";


    giocatori.forEach(
        function(nome, indice) {

            const riga =
                document.createElement(
                    "div"
                );


            riga.className =
                "score-row";


            riga.innerHTML =
                "<strong>" +
                nome +
                "</strong>" +

                "<span>" +

                "Punti: " +
                punteggi[indice] +

                " | Game: " +
                gameVinti[indice] +

                " | Set: " +
                setVinti[indice] +

                "</span>";


            tabellone.appendChild(
                riga
            );
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
        document.getElementById(
            "punti"
        );


    const indice =
        Number(
            selettore.value
        );


    if (input.value === "") {

        alert(
            "Inserisci il punteggio."
        );

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


    // ========================
    // SISTEMA SEMPLICE
    // ========================

    if (
        sistemaPunteggio ===
        "semplice"
    ) {

        const puntiTurno =
            new Array(
                giocatori.length
            ).fill(0);


        puntiTurno[indice] =
            punti;


        punteggi[indice] +=
            punti;


        storico.push({

            numero: numeroTurno,

            vincitore: indice,

            punti: pontosTurno

        });

    }


    // ========================
    // GAME / SET / MATCH
    // ========================

    if (
        sistemaPunteggio ===
        "game-set"
    ) {

        punteggi[indice] +=
            punti;


        let gameConquistati =
            Math.floor(
                punteggi[indice] /
                pontosPerGame
            );


        while (
            gameConquistati >
            gameVinti[indice]
        ) {

            gameVinti[indice]++;


            if (
                gameVinti[indice] >=
                gamePerSet
            ) {

                gameVinti[indice] = 0;

                setVinti[indice]++;


                if (
                    setVinti[indice] >=
                    setPerMatch
                ) {

                    setVinti[indice] =
                        setPerMatch;

                    alert(
                        "🏆 " +
                        giocatori[indice] +
                        " ha vinto la partita!"
                    );
                }
            }
        }


        storico.push({

            numero: numeroTurno,

            vincitore: indice,

            pontos: pontos

        });
    }


    numeroTurno++;


    input.value = "";


    selettore.selectedIndex = 0;


    aggiornaSchermataPartita();


    salvaPartita();
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
                document.createElement(
                    "div"
                );


            riga.className =
                "storico-riga";


            const nome =
                giocatori[
                    turno.vincitore
                ];


            riga.innerHTML =
                "<strong>Turno " +
                turno.numero +
                "</strong><br>" +
                "🏆 " +
                nome;


            elemento.appendChild(
                riga
            );
        }
    );
}


// ========================
// ANNULLA ULTIMO TURNO
// ========================

function annullaUltimoTurno() {

    if (storico.length === 0) {

        alert(
            "Non ci sono turni da annullare."
        );

        return;
    }


    // Per sicurezza, ricalcoliamo
    // tutta la partita dall'inizio.


    storico.pop();


    punteggi =
        new Array(
            giocatori.length
        ).fill(0);


    gameVinti =
        new Array(
            giocatori.length
        ).fill(0);


    setVinti =
        new Array(
            giocatori.length
        ).fill(0);


    storico.forEach(
        function(turno) {

            const indice =
                turno.vincitore;


            const punti =
                turno.punti ||
                turno.pontos ||
                0;


            punteggi[indice] +=
                punti;


            if (
                sistemaPunteggio ===
                "game-set"
            ) {

                while (
                    Math.floor(
                        punteggi[indice] /
                        puntiPerGame
                    ) >
                    gameVinti[indice]
                ) {

                    gameVinti[indice]++;


                    if (
                        gameVinti[indice] >=
                        gamePerSet
                    ) {

                        gameVinti[indice] = 0;

                        setVinti[indice]++;
                    }
                }
            }
        }
    );


    numeroTurno =
        storico.length + 1;


    aggiornaSchermataPartita();

    salvaPartita();
}
