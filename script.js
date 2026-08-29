let giocoScelto = "";
let giocatori = [];

let punteggi = [];
let storico = [];

let numeroTurno = 1;

let sistemaPunteggio = "semplice";

let obiettivoPartita = 500;

let puntiPerGame = 21;
let gamePerSet = 3;
let setPerMatch = 2;

// Punteggio attuale del Game
let puntiGame = [];

// Game e Set vinti
let gameVinti = [];
let setVinti = [];


// ========================================
// SALVATAGGIO AUTOMATICO
// ========================================

function salvaPartita() {

    const partita = {

        gioco: giocoScelto,

        giocatori: giocatori,

        punteggi: punteggi,

        storico: storico,

        turno: numeroTurno,

        sistema: sistemaPunteggio,

        obiettivo: obiettivoPartita,

        puntiGame: puntiPerGame,

        gameSet: gamePerSet,

        setMatch: setPerMatch,

        puntiAttualiGame: puntiGame,

        gameVinti: gameVinti,

        setVinti: setVinti
    };

    localStorage.setItem(
        "cardscore_partita",
        JSON.stringify(partita)
    );
}


// ========================================
// PARTITA SALVATA
// ========================================

function aggiornaPartitaSalvata() {

    const dati =
        localStorage.getItem(
            "cardscore_partita"
        );

    const sezione =
        document.getElementById(
            "partita-in-corso"
        );

    const contenitore =
        document.getElementById(
            "partita-salvata"
        );

    if (!sezione || !contenitore) {
        return;
    }

    if (!dati) {

        sezione.style.display =
            "none";

        return;
    }

    try {

        const partita =
            JSON.parse(dati);

        if (
            !partita.giocatori ||
            partita.giocatori.length < 2
        ) {

            sezione.style.display =
                "none";

            return;
        }

        let html =
            "<strong>" +
            partita.gioco +
            "</strong><br><br>";

        html +=
            "Turno " +
            partita.turno +
            "<br>";

        if (
            partita.sistema ===
            "game-set"
        ) {

            html +=
                "Game / Set / Match<br><br>";

        } else {

            html +=
                "Punteggio semplice<br><br>";
        }

        partita.giocatori.forEach(
            function(nome, indice) {

                html +=
                    nome +
                    ": " +
                    partita.punteggi[indice] +
                    " punti<br>";
            }
        );

        contenitore.innerHTML =
            html;

        sezione.style.display =
            "block";

    } catch (errore) {

        sezione.style.display =
            "none";
    }
}


// ========================================
// CONTINUA PARTITA
// ========================================

function continuaPartita() {

    const dati =
        localStorage.getItem(
            "cardscore_partita"
        );

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
            partita.giocatori || [];

        punteggi =
            partita.punteggi || [];

        storico =
            partita.storico || [];

        numeroTurno =
            partita.turno || 1;

        sistemaPunteggio =
            partita.sistema || "semplice";

        obiettivoPartita =
            partita.obiettivo || 500;

        puntiPerGame =
            partita.puntiGame || 21;

        gamePerSet =
            partita.gameSet || 3;

        setPerMatch =
            partita.setMatch || 2;

        puntiGame =
            partita.puntiAttualiGame ||
            new Array(
                giocatori.length
            ).fill(0);

        gameVinti =
            partita.gameVinti ||
            new Array(
                giocatori.length
            ).fill(0);

        setVinti =
            partita.setVinti ||
            new Array(
                giocatori.length
            ).fill(0);


        document.getElementById(
            "home"
        ).style.display =
            "none";

        document.getElementById(
            "nuova-partita"
        ).style.display =
            "none";

        document.getElementById(
            "partita"
        ).style.display =
            "block";

        aggiornaSchermataPartita();

    } catch (errore) {

        alert(
            "Errore nel recupero della partita."
        );
    }
}


// ========================================
// NUOVA PARTITA
// ========================================

function nuovaPartita() {

    localStorage.removeItem(
        "cardscore_partita"
    );

    giocoScelto = "";

    giocatori = [];

    punteggi = [];

    storico = [];

    puntiGame = [];

    gameVinti = [];

    setVinti = [];

    numeroTurno = 1;

    sistemaPunteggio =
        "semplice";

    obiettivoPartita =
        500;

    puntiPerGame =
        21;

    gamePerSet =
        3;

    setPerMatch =
        2;


    document.getElementById(
        "partita-in-corso"
    ).style.display =
        "none";

    document.getElementById(
        "home"
    ).style.display =
        "none";

    document.getElementById(
        "nuova-partita"
    ).style.display =
        "block";


    document.getElementById(
        "lista-giocatori"
    ).innerHTML =
        "";

    document.getElementById(
        "nome-giocatore"
    ).value =
        "";

    document.getElementById(
        "sistema-punteggio"
    ).value =
        "semplice";

    document.getElementById(
        "impostazioni-game-set"
    ).style.display =
        "none";

    document.getElementById(
        "impostazioni-semplici"
    ).style.display =
        "block";
}


// ========================================
// SCELTA GIOCO
// ========================================

function scegliGioco(gioco) {

    giocoScelto =
        gioco;

    giocatori = [];

    punteggi = [];

    storico = [];

    puntiGame = [];

    gameVinti = [];

    setVinti = [];

    numeroTurno = 1;


    document.getElementById(
        "home"
    ).style.display =
        "none";

    document.getElementById(
        "nuova-partita"
    ).style.display =
        "block";

    document.getElementById(
        "titolo-gioco"
    ).textContent =
        gioco;

    document.getElementById(
        "lista-giocatori"
    ).innerHTML =
        "";

    document.getElementById(
        "nome-giocatore"
    ).value =
        "";
}


// ========================================
// CAMBIO SISTEMA
// ========================================

function cambiaSistemaPunteggio() {

    const sistema =
        document.getElementById(
            "sistema-punteggio"
        ).value;

    const impostazioni =
        document.getElementById(
            "impostazioni-game-set"
        );

    const semplici =
        document.getElementById(
            "impostazioni-semplici"
        );


    if (
        sistema === "game-set"
    ) {

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


// ========================================
// OBIETTIVO PERSONALIZZATO
// ========================================

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
        ).value =
            "";
    }
}


// ========================================
// AVVIO
// ========================================

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


// ========================================
// AGGIUNGI GIOCATORE
// ========================================

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
            "Puoi inserire massimo 6 giocatori."
        );

        return;
    }


    giocatori.push(nome);

    input.value = "";

    mostraGiocatori();
}


// ========================================
// MOSTRA GIOCATORI
// ========================================

function mostraGiocatori() {

    const lista =
        document.getElementById(
            "lista-giocatori"
        );

    lista.innerHTML =
        "";


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


// ========================================
// TORNA HOME
// ========================================

function tornaHome() {

    document.getElementById(
        "home"
    ).style.display =
        "block";

    document.getElementById(
        "nuova-partita"
    ).style.display =
        "none";

    document.getElementById(
        "partita"
    ).style.display =
        "none";

    aggiornaPartitaSalvata();
}


// ========================================
// INIZIA PARTITA
// ========================================

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


    // ==============================
    // PUNTEGGIO SEMPLICE
    // ==============================

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


            if (
                !valore ||
                valore <= 0
            ) {

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


    // ==============================
    // GAME / SET / MATCH
    // ==============================

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


    punteggi =
        new Array(
            giocatori.length
        ).fill(0);


    puntiGame =
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


    storico = [];

    numeroTurno = 1;


    document.getElementById(
        "nuova-partita"
    ).style.display =
        "none";

    document.getElementById(
        "partita"
    ).style.display =
        "block";


    aggiornaSchermataPartita();

    salvaPartita();
}


// ========================================
// AGGIORNA SCHERMATA
// ========================================

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


    criaSeletorSeguro();


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
            " punti = Game • " +
            gamePerSet +
            " Game = Set • " +
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


// ========================================
// SELETTORE VINCITORE
// ========================================

function criaSeletorSeguro() {

    const selettore =
        document.getElementById(
            "giocatore-vincitore"
        );


    selettore.innerHTML =
        "";


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


// ========================================
// TABELLONE SEMPLICE
// ========================================

function creaTabellone() {

    const tabellone =
        document.getElementById(
            "tabellone"
        );


    tabellone.innerHTML =
        "";


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
                "Totale: " +
                punteggi[indice] +
                "</span>";


            tabellone.appendChild(
                riga
            );
        }
    );
}


// ========================================
// TABELLONE GAME / SET
// ========================================

function creaTabelloneGameSet() {

    const tabellone =
        document.getElementById(
            "tabellone-game-set"
        );


    tabellone.innerHTML =
        "";


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

                "Punti Game: " +
                puntiGame[indice] +

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


// ========================================
// NUOVO TURNO
// ========================================

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
        Number(
            input.value
        );


    if (
        !Number.isFinite(punti) ||
        punti < 0
    ) {

        alert(
            "Inserisci un punteggio valido."
        );

        return;
    }


    // ====================================
    // PUNTEGGIO SEMPLICE
    // ====================================

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

            numero:
                numeroTurno,

            vincitore:
                indice,

            punti:
                punti
        });


        controllaVittoria();
    }


    // ====================================
    // GAME / SET / MATCH
    // ====================================

    else {

        // Aggiungiamo i punti
        // SOLO al Game corrente

        puntiGame[indice] +=
            punti;


        // Aggiungiamo anche
        // al totale storico

        punteggi[indice] +=
            punti;


        storico.push({

            numero:
                numeroTurno,

            vincitore:
                indice,

            punti:
                punti
        });


        // Controlliamo se ha
        // raggiunto il Game

        controllaGame(indice);
    }


    numeroTurno++;


    input.value =
        "";


    selettore.selectedIndex =
        0;


    aggiornaSchermataPartita();


    salvaPartita();
}


// ========================================
// CONTROLLA GAME
// ========================================

function controllaGame(indice) {

    if (
        puntiGame[indice] <
        puntiPerGame
    ) {

        return;
    }


    // Il giocatore ha vinto
    // un Game

    gameVinti[indice]++;


    alert(
        "🎉 " +
        giocatori[indice] +
        " vince il Game!"
    );


    // Azzera i punti del Game

    puntiGame =
        new Array(
            giocatori.length
        ).fill(0);


    // ====================================
    // CONTROLLA SET
    // ====================================

    if (
        gameVinti[indice] >=
        gamePerSet
    ) {

        setVinti[indice]++;


        alert(
            "🏆 " +
            giocatori[indice] +
            " vince il Set!"
        );


        // Azzera i Game

        gameVinti =
            new Array(
                giocatori.length
            ).fill(0);


        // ====================================
        // CONTROLLA MATCH
        // ====================================

        if (
            setVinti[indice] >=
            setPerMatch
        ) {

            alert(
                "🏆🏆🏆 " +
                giocatori[indice] +
                " VINCE LA PARTITA!"
            );


            localStorage.removeItem(
                "cardscore_partita"
            );
        }
    }
}


// ========================================
// STORICO
// ========================================

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
                nome +
                " +" +
                turno.punti +
                " punti";


            elemento.appendChild(
                riga
            );
        }
    );
}


// ========================================
// ANNULLA ULTIMO TURNO
// ========================================

function annullaUltimoTurno() {

    if (
        storico.length === 0
    ) {

        alert(
            "Non ci sono turni da annullare."
        );

        return;
    }


    storico.pop();


    ricalcolaPartita();


    salvaPartita();
}


// ========================================
// RICALCOLA TUTTA LA PARTITA
// ========================================

function ricalcolaPartita() {

    punteggi =
        new Array(
            giocatori.length
        ).fill(0);


    puntiGame =
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
                Number(
                    turno.punti
                ) || 0;


            punteggi[indice] +=
                punti;


            if (
                sistemaPunteggio ===
                "game-set"
            ) {

                puntiGame[indice] +=
                    punti;


                while (
                    puntiGame[indice] >=
                    puntiPerGame
                ) {

                    puntiGame[indice] -=
                        puntiPerGame;


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
}
