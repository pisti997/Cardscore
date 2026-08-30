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

let puntiGame = [];
let gameVinti = [];
let setVinti = [];


/* ========================================
   ANIMAZIONI
======================================== */

let animazionePunteggio = null;
let animazioneGame = null;
let animazioneSet = null;
let animazioneMatch = null;

let precedenteLeader = null;
let messaggioTimeout = null;

function mostraMessaggioPartita(tipo, giocatore) {

    let messaggio =
        document.getElementById("messaggio-partita");

    if (!messaggio) {

        messaggio =
            document.createElement("div");

        messaggio.id =
            "messaggio-partita";

        messaggio.setAttribute(
            "role",
            "status"
        );

        messaggio.setAttribute(
            "aria-live",
            "polite"
        );

        const contenitore =
            document.getElementById("partita") ||
            document.body;

        contenitore.appendChild(
            messaggio
        );
    }

    const testi = {
        game: "🎉 GAME!",
        set: "🏆 SET!",
        match: "🏆 PARTITA VINTA!"
    };

    messaggio.innerHTML =
        "<strong>" +
        testi[tipo] +
        "</strong>" +
        "<span>" +
        giocatore +
        (
            tipo === "match"
                ? " ha vinto la partita"
                : " ha vinto il " + tipo
        ) +
        "</span>";

    messaggio.classList.remove(
        "visibile"
    );

    void messaggio.offsetWidth;

    messaggio.classList.add(
        "visibile"
    );

    if (messaggioTimeout) {
        clearTimeout(
            messaggioTimeout
        );
    }

    messaggioTimeout =
        setTimeout(
            function() {

                messaggio.classList.remove(
                    "visibile"
                );

            },
            5000
        );
}


/* ========================================
   SALVA PARTITA
======================================== */

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


/* ========================================
   MOSTRA PARTITA SALVATA
======================================== */

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

        contenitore.innerHTML =
            html;

        sezione.style.display =
            "block";

    } catch (errore) {

        sezione.style.display =
            "none";
    }
}


/* ========================================
   CONTINUA PARTITA
======================================== */

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


/* ========================================
   NUOVA PARTITA
======================================== */

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

    animazionePunteggio = null;
    animazioneGame = null;
    animazioneSet = null;
    animazioneMatch = null;

    precedenteLeader = null;

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

    controllaObiettivo();
}


/* ========================================
   SCELTA GIOCO
======================================== */

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

    precedenteLeader = null;

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


/* ========================================
   CAMBIO SISTEMA
======================================== */

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


/* ========================================
   OBIETTIVO PERSONALIZZATO
======================================== */

function controllaObiettivo() {

    const selettore =
        document.getElementById(
            "obiettivo"
        );

    const campo =
        document.getElementById(
            "campo-personalizzato"
        );

    if (!selettore || !campo) {
        return;
    }

    if (
        selettore.value ===
        "personalizzato"
    ) {

        campo.style.display =
            "block";

    } else {

        campo.style.display =
            "none";

        const input =
            document.getElementById(
                "obiettivo-personalizzato"
            );

        if (input) {
            input.value = "";
        }
    }
}


/* ========================================
   AVVIO
======================================== */

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


/* ========================================
   AGGIUNGI GIOCATORE
======================================== */

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

    if (
        giocatori.length >= 6
    ) {

        alert(
            "Puoi inserire massimo 6 giocatori."
        );

        return;
    }

    giocatori.push(nome);

    input.value = "";

    mostraGiocatori();
}


/* ========================================
   MOSTRA GIOCATORI
======================================== */

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


/* ========================================
   TORNA HOME
======================================== */

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


/* ========================================
   INIZIA PARTITA
======================================== */

function iniziaPartita() {

    if (
        giocatori.length < 2
    ) {

        alert(
            "Servono almeno 2 giocatori!"
        );

        return;
    }

    sistemaPunteggio =
        document.getElementById(
            "sistema-punteggio"
        ).value;


    /* SEMPLICE */

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

            const valore =
                Number(
                    document.getElementById(
                        "obiettivo-personalizzato"
                    ).value
                );

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


    /* GAME / SET / MATCH */

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
            pontosInvalidos()
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

    precedenteLeader = null;

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


/* ========================================
   CONTROLLO VALORI
======================================== */

function pontosInvalidos() {

    return (
        !Number.isFinite(puntiPerGame) ||
        puntiPerGame <= 0 ||

        !Number.isFinite(gamePerSet) ||
        gamePerSet <= 0 ||

        !Number.isFinite(setPerMatch) ||
        setPerMatch <= 0
    );
}


/* ========================================
   AGGIORNA SCHERMATA
======================================== */

function aggiornaSchermataPartita() {

    const titolo =
        document.getElementById(
            "titolo-partita"
        );

    const turno =
        document.getElementById(
            "numero-mano"
        );

    if (titolo) {
        titolo.textContent =
            giocoScelto;
    }

    if (turno) {
        turno.textContent =
            "Turno " +
            numeroTurno;
    }

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

    applicaAnimazioni();
}


/* ========================================
   SELETTORE
======================================== */

function creaSelettoreVincitore() {

    const selettore =
        document.getElementById(
            "giocatore-vincitore"
        );

    if (!selettore) {
        return;
    }

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


/* ========================================
   TABELLONE SEMPLICE
======================================== */

function creaTabellone() {

    const tabellone =
        document.getElementById(
            "tabellone"
        );

    if (!tabellone) {
        return;
    }

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

            riga.dataset.indice =
                indice;

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


/* ========================================
   TABELLONE GAME / SET / MATCH
======================================== */

function creaTabelloneGameSet() {

    const tabellone =
        document.getElementById(
            "tabellone-game-set"
        );

    if (!tabellone) {
        return;
    }

    tabellone.innerHTML =
        "";

    let migliore =
        null;


    /* TROVA LEADER */

    giocatori.forEach(
        function(nome, indice) {

            const valore = {

                set:
                    setVinti[indice],

                game:
                    gameVinti[indice],

                punti:
                    puntiGame[indice]
            };


            if (
                migliore === null
            ) {

                migliore = {

                    indice:
                        indice,

                    valore:
                        valore,

                    pari:
                        false
                };

                return;
            }


            const confronto =
                confrontaGiocatori(
                    valore,
                    migliore.valore
                );


            if (
                confronto > 0
            ) {

                migliore = {

                    indice:
                        indice,

                    valore:
                        valore,

                    pari:
                        false
                };

            } else if (
                confronto === 0
            ) {

                migliore.pari =
                    true;
            }
        }
    );


    /* CONTROLLA CAMBIO LEADER */

    const nuovoLeader =
        migliore &&
        !migliore.pari
            ? migliore.indice
            : null;

    if (
        precedenteLeader !== null &&
        nuovoLeader !== null &&
        precedenteLeader !== nuovoLeader
    ) {

        animazionePunteggio = {
            indice: nuovoLeader
        };
    }

    precedenteLeader =
        nuovoLeader;


    /* CREA RIGHE */

    giocatori.forEach(
        function(nome, indice) {

            const riga =
                document.createElement(
                    "div"
                );

            riga.className =
                "score-row match-row";

            riga.dataset.indice =
                indice;


            if (
                migliore !== null &&
                !migliore.pari &&
                migliore.indice === indice
            ) {

                riga.classList.add(
                    "leader"
                );
            }


            const nomeElemento =
                document.createElement(
                    "strong"
                );

            nomeElemento.textContent =
                nome;


            const puntiElemento =
                document.createElement(
                    "span"
                );

            puntiElemento.textContent =
                puntiGame[indice];


            const gameElemento =
                document.createElement(
                    "span"
                );

            gameElemento.textContent =
                gameVinti[indice];


            const setElemento =
                document.createElement(
                    "span"
                );

            setElemento.textContent =
                setVinti[indice];


            riga.appendChild(
                nomeElemento
            );

            riga.appendChild(
                puntiElemento
            );

            riga.appendChild(
                gameElemento
            );

            riga.appendChild(
                setElemento
            );

            tabellone.appendChild(
                riga
            );
        }
    );


    const stato =
        document.getElementById(
            "stato-match"
        );

    if (stato) {

        if (
            migliore === null
        ) {

            stato.textContent =
                "Match in corso";

        } else if (
            migliore.pari
        ) {

            stato.textContent =
                "Situazione di parità";

        } else {

            stato.textContent =
                "In vantaggio: " +
                giocatori[
                    migliore.indice
                ];
        }
    }
}


/* ========================================
   CONFRONTO GIOCATORI
======================================== */

function confrontaGiocatori(a, b) {

    if (
        a.set > b.set
    ) {
        return 1;
    }

    if (
        a.set < b.set
    ) {
        return -1;
    }


    if (
        a.game > b.game
    ) {
        return 1;
    }

    if (
        a.game < b.game
    ) {
        return -1;
    }


    if (
        a.punti > b.punti
    ) {
        return 1;
    }

    if (
        a.punti < b.punti
    ) {
        return -1;
    }


    return 0;
}


/* ========================================
   NUOVO TURNO
======================================== */

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


    if (
        input.value === ""
    ) {

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


    /* ====================================
       SEMPLICE
    ==================================== */

    if (
        sistemaPunteggio ===
        "semplice"
    ) {

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


        animazionePunteggio = {
            indice: indice
        };

        controllaVittoria();

    }


    /* ====================================
       GAME / SET / MATCH
    ==================================== */

    else {

        puntiGame[indice] +=
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


        animazionePunteggio = {
            indice: indice
        };

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


/* ========================================
   CONTROLLA GAME
======================================== */

function controllaGame(indice) {

    if (
        puntiGame[indice] <
        puntiPerGame
    ) {

        return;
    }


    gameVinti[indice]++;


    animazioneGame = {
        indice: indice
    };
   mostraMessaggioPartita(
    "game",
    giocatori[indice]
);



    /* AZZERA PUNTI GAME */

    puntiGame =
        new Array(
            giocatori.length
        ).fill(0);


    /* ====================================
       SET
    ==================================== */

    if (
        gameVinti[indice] >=
        gamePerSet
    ) {

        setVinti[indice]++;

        animazioneSet = {
            indice: indice
        };
mostraMessaggioPartita(
    "set",
    giocatori[indice]
);


        gameVinti =
            new Array(
                giocatori.length
            ).fill(0);


        /* ====================================
           MATCH
        ==================================== */

        if (
            setVinti[indice] >=
            setPerMatch
        ) {

            animazioneMatch = {
                indice: indice
            };
mostraMessaggioPartita(
    "match",
    giocatori[indice]
);


            localStorage.removeItem(
                "cardscore_partita"
            );
        }
    }
}


/* ========================================
   VITTORIA SEMPLICE
======================================== */

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

            animazioneMatch = {
                indice: i
            };


            alert(
                "🏆 " +
                giocatori[i] +
                " ha vinto la partita!"
            );


            localStorage.removeItem(
                "cardscore_partita"
            );

            return;
        }
    }
}


/* ========================================
   APPLICA ANIMAZIONI
======================================== */

function applicaAnimazioni() {

    /* ------------------------------
       PUNTEGGIO
    ------------------------------ */

    if (
        animazionePunteggio !== null
    ) {

        const elementi =
            document.querySelectorAll(
                ".score-row"
            );

        elementi.forEach(
            function(elemento) {

                if (
                    Number(
                        elemento.dataset.indice
                    ) ===
                    animazionePunteggio.indice
                ) {

                    elemento.classList.remove(
                        "score-pop"
                    );

                    void elemento.offsetWidth;

                    elemento.classList.add(
                        "score-pop"
                    );
                }
            }
        );
    }


    /* ------------------------------
       GAME
    ------------------------------ */

    if (
        animazioneGame !== null
    ) {

        const elementi =
            document.querySelectorAll(
                ".match-row"
            );

        elementi.forEach(
            function(elemento) {

                if (
                    Number(
                        elemento.dataset.indice
                    ) ===
                    animazioneGame.indice
                ) {

                    elemento.classList.remove(
                        "game-won"
                    );

                    void elemento.offsetWidth;

                    elemento.classList.add(
                        "game-won"
                    );
                }
            }
        );
    }


    /* ------------------------------
       SET
    ------------------------------ */

    if (
        animazioneSet !== null
    ) {

        const elementi =
            document.querySelectorAll(
                ".match-row"
            );

        elementi.forEach(
            function(elemento) {

                if (
                    Number(
                        elemento.dataset.indice
                    ) ===
                    animazioneSet.indice
                ) {

                    elemento.classList.remove(
                        "set-won"
                    );

                    void elemento.offsetWidth;

                    elemento.classList.add(
                        "set-won"
                    );
                }
            }
        );
    }


    /* ------------------------------
       MATCH
    ------------------------------ */

    if (
        animazioneMatch !== null
    ) {

        const elementi =
            document.querySelectorAll(
                ".score-row"
            );

        elementi.forEach(
            function(elemento) {

                if (
                    Number(
                        elemento.dataset.indice
                    ) ===
                    animazioneMatch.indice
                ) {

                    elemento.classList.remove(
                        "set-won"
                    );

                    void elemento.offsetWidth;

                    elemento.classList.add(
                        "match-won"
                    );
                }
            }
        );
    }


    /* RESET */

    animazionePunteggio = null;

    animazioneGame = null;

    animazioneSet = null;

    animazioneMatch = null;
}


/* ========================================
   STORICO
======================================== */

function mostraStorico() {

    const elemento =
        document.getElementById(
            "storico"
        );

    if (!elemento) {
        return;
    }

    elemento.innerHTML =
        "<h2>📋 Storico turni</h2>";


    if (
        storico.length === 0
    ) {

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
                "<strong>" +
                "Turno " +
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


/* ========================================
   ANNULLA ULTIMO TURNO
======================================== */

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


/* ========================================
   RICALCOLA PARTITA
======================================== */

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


    precedenteLeader = null;

    aggiornaSchermataPartita();
}
