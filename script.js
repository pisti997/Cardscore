/* =========================================================
   CARDSCORE
   SCRIPT COMPLETO
========================================================= */


/* =========================================================
   STATO DELLA PARTITA
========================================================= */

let giocoScelto = "";

let giocatori = [];
let punteggi = [];
let storico = [];

let numeroTurno = 0;

let sistemaPunteggio = "semplice";

let obiettivoPartita = 500;

let puntiPerGame = 21;
let gamePerSet = 3;
let setPerMatch = 2;

let puntiGame = [];
let gameVinti = [];
let setVinti = [];
let matchVinti = [];

let storicoGame = [];
let storicoSet = [];

let partitaIniziata = null;

let messaggioTimeout = null;

const STORAGE_KEY = "cardscore_partita";


/* =========================================================
   ELEMENTI
========================================================= */

function elemento(id) {
    return document.getElementById(id);
}


/* =========================================================
   CAMBIO PAGINA
========================================================= */

function mostraPagina(id) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const pagina = elemento(id);

    if (pagina) {
        pagina.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
}


/* =========================================================
   HOME
========================================================= */

function tornaHome() {

    mostraPagina("home");

    aggiornaPartitaSalvata();
}


/* =========================================================
   NUOVA PARTITA
========================================================= */

function nuovaPartita() {

    giocoScelto = "";

    giocatori = [];

    punteggi = [];

    storico = [];

    numeroTurno = 0;

    sistemaPunteggio = "semplice";

    obiettivoPartita = 500;

    puntiPerGame = 21;

    gamePerSet = 3;

    setPerMatch = 2;

    puntiGame = [];

    gameVinti = [];

    setVinti = [];

    matchVinti = [];

    storicoGame = [];

    storicoSet = [];

    partitaIniziata = null;


    elemento("gioco-selezionato").textContent = "—";

    elemento("sistema-punteggio").value = "semplice";

    elemento("obiettivo-partita").value = 500;

    elemento("punti-per-game").value = 21;

    elemento("game-per-set").value = 3;

    elemento("set-per-match").value = 2;


    aggiornaListaGiocatori();

    cambiaSistemaPunteggio();

    mostraPagina("nuova-partita");
}


/* =========================================================
   SCELTA GIOCO
========================================================= */

function scegliGioco(gioco) {

    nuovaPartita();

    giocoScelto = gioco;

    elemento("gioco-selezionato").textContent = gioco;

    mostraPagina("nuova-partita");
}


/* =========================================================
   GIOCATORI
========================================================= */

function aggiornaListaGiocatori() {

    const lista = elemento("lista-giocatori");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";


    giocatori.forEach((nome, indice) => {

        const riga = document.createElement("div");

        riga.className = "player-row";


        const input = document.createElement("input");

        input.type = "text";

        input.className = "player-input";

        input.placeholder =
            `Nome giocatore ${indice + 1}`;

        input.value = nome;

        input.maxLength = 20;

        input.autocomplete = "off";


        input.addEventListener("input", function () {

            giocatori[indice] =
                this.value;

        });


        riga.appendChild(input);


        if (giocatori.length > 2) {

            const removeButton =
                document.createElement("button");

            removeButton.type = "button";

            removeButton.className =
                "remove-player";

            removeButton.setAttribute(
                "aria-label",
                "Rimuovi giocatore"
            );

            removeButton.textContent = "×";


            removeButton.addEventListener(
                "click",
                function () {

                    giocatori.splice(indice, 1);

                    aggiornaListaGiocatori();

                }
            );


            riga.appendChild(removeButton);
        }


        lista.appendChild(riga);

    });


    const counter =
        elemento("numero-giocatori");

    if (counter) {
        counter.textContent =
            giocatori.length;
    }
}


/* =========================================================
   AGGIUNGI GIOCATORE
========================================================= */

function aggiungiGiocatore() {

    if (giocatori.length >= 6) {

        alert(
            "Puoi inserire massimo 6 giocatori."
        );

        return;
    }


    giocatori.push("");

    aggiornaListaGiocatori();


    setTimeout(() => {

        const inputs =
            document.querySelectorAll(
                ".player-input"
            );

        if (inputs.length) {

            inputs[
                inputs.length - 1
            ].focus();

        }

    }, 50);
}


/* =========================================================
   SISTEMA PUNTEGGIO
========================================================= */

function cambiaSistemaPunteggio() {

    const select =
        elemento("sistema-punteggio");

    if (!select) {
        return;
    }


    sistemaPunteggio =
        select.value;


    const semplice =
        elemento("impostazioni-semplice");

    const gameSet =
        elemento("impostazioni-game-set");


    if (
        sistemaPunteggio ===
        "semplice"
    ) {

        semplice.classList.remove(
            "hidden"
        );

        gameSet.classList.add(
            "hidden"
        );

    } else {

        semplice.classList.add(
            "hidden"
        );

        gameSet.classList.remove(
            "hidden"
        );
    }
}


/* =========================================================
   INIZIA PARTITA
========================================================= */

function iniziaPartita() {

    const inputs =
        document.querySelectorAll(
            ".player-input"
        );


    giocatori =
        Array.from(inputs)
            .map(input =>
                input.value.trim()
            )
            .filter(nome =>
                nome.length > 0
            );


    if (giocatori.length < 2) {

        alert(
            "Inserisci almeno 2 giocatori."
        );

        return;
    }


    if (giocatori.length > 6) {

        alert(
            "Puoi inserire massimo 6 giocatori."
        );

        return;
    }


    if (!giocoScelto) {

        alert(
            "Seleziona prima un gioco."
        );

        return;
    }


    sistemaPunteggio =
        elemento("sistema-punteggio").value;


    if (
        sistemaPunteggio ===
        "semplice"
    ) {

        obiettivoPartita =
            parseInt(
                elemento(
                    "obiettivo-partita"
                ).value,
                10
            );


        if (
            !Number.isFinite(
                obiettivoPartita
            ) ||
            obiettivoPartita <= 0
        ) {

            alert(
                "Inserisci un obiettivo valido."
            );

            return;
        }

    } else {

        puntiPerGame =
            parseInt(
                elemento(
                    "punti-per-game"
                ).value,
                10
            );

        gamePerSet =
            parseInt(
                elemento(
                    "game-per-set"
                ).value,
                10
            );

        setPerMatch =
            parseInt(
                elemento(
                    "set-per-match"
                ).value,
                10
            );


        if (
            !Number.isFinite(
                puntiPerGame
            ) ||
            puntiPerGame <= 0 ||
            !Number.isFinite(
                gamePerSet
            ) ||
            gamePerSet <= 0 ||
            !Number.isFinite(
                setPerMatch
            ) ||
            setPerMatch <= 0
        ) {

            alert(
                "Controlla le impostazioni del match."
            );

            return;
        }
    }


    /* RESET */

    punteggi =
        giocatori.map(() => 0);

    puntiGame =
        giocatori.map(() => 0);

    gameVinti =
        giocatori.map(() => 0);

    setVinti =
        giocatori.map(() => 0);

    matchVinti =
        giocatori.map(() => 0);

    storico = [];

    storicoGame = [];

    storicoSet = [];

    numeroTurno = 0;


    /* TIMER */

    partitaIniziata =
        Date.now();


    mostraPagina("partita");

    aggiornaSchermataPartita();

    salvaPartita();

    aggiornaPartitaSalvata();
}


/* =========================================================
   AGGIORNA SCHERMATA PARTITA
========================================================= */

function aggiornaSchermataPartita() {

    const titolo =
        elemento("titolo-partita");

    const turno =
        elemento("numero-mano");


    if (titolo) {

        titolo.textContent =
            giocoScelto || "Partita";

    }


    if (turno) {

        turno.textContent =
            `Turno ${numeroTurno + 1}`;

    }
const banner = elemento("banner-game-set");

if (banner) {
    banner.setAttribute(
        "data-turn",
        numeroTurno + 1
    );
}

    if (
        sistemaPunteggio ===
        "semplice"
    ) {

        elemento(
            "obiettivo-container"
        ).classList.remove(
            "hidden"
        );

        elemento(
            "obiettivo-testo"
        ).textContent =
            obiettivoPartita;

        elemento(
            "tabellone-semplice"
        ).classList.remove(
            "hidden"
        );

        elemento(
            "tabellone-game-set"
        ).classList.add(
            "hidden"
        );

        elemento(
            "banner-game-set"
        ).classList.add(
            "hidden"
        );


        creaTabelloneSemplice();

    } else {

        elemento(
            "obiettivo-container"
        ).classList.add(
            "hidden"
        );

        elemento(
            "tabellone-semplice"
        ).classList.add(
            "hidden"
        );

        elemento(
            "tabellone-game-set"
        ).classList.remove(
            "hidden"
        );

        elemento(
            "banner-game-set"
        ).classList.remove(
            "hidden"
        );


        creaTabelloneGameSet();
    }


    creaSelettoreGiocatore();

    creaQuickButtons();

    mostraStorico();
}


/* =========================================================
   TABELLONE SEMPLICE
========================================================= */

function creaTabelloneSemplice() {

    const tabellone =
        elemento("tabellone-semplice");

    if (!tabellone) {
        return;
    }

    tabellone.innerHTML = "";


    giocatori.forEach(
        (nome, indice) => {

            const riga =
                document.createElement(
                    "div"
                );

            riga.className =
                "simple-score-row";


            const nomeElement =
                document.createElement(
                    "strong"
                );

            nomeElement.className =
                "simple-player-name";

            nomeElement.textContent =
                nome;


            const score =
                document.createElement(
                    "span"
                );

            score.className =
                "simple-player-score";

            score.textContent =
                punteggi[indice];


            riga.appendChild(
                nomeElement
            );

            riga.appendChild(
                score
            );


            if (
                punteggi[indice] ===
                Math.max(...punteggi) &&
                punteggi[indice] > 0
            ) {

                riga.classList.add(
                    "leader"
                );
            }


            tabellone.appendChild(
                riga
            );
        }
    );
}


/* =========================================================
   TABELLONE GAME / SET / MATCH
========================================================= */

function creaTabelloneGameSet() {

    const tabellone =
        elemento("tabellone-game-set");

    if (!tabellone) {
        return;
    }

    tabellone.innerHTML = "";


    /* INTESTAZIONI */

    const labels =
        document.createElement(
            "div"
        );

    labels.className =
        "scoreboard-labels";


    labels.innerHTML = `
        <span></span>
        <span>GAMES</span>
        <span>SETS</span>
        <span>MATCH</span>
        <span>PUNTI</span>
    `;


    tabellone.appendChild(
        labels
    );


    /* GIOCATORI */

    giocatori.forEach(
        (nome, indice) => {

            const riga =
                document.createElement(
                    "div"
                );

            riga.className =
                "match-row";


            /* NOME */

            const player =
                document.createElement(
                    "div"
                );

            player.className =
                "match-player";


            const strong =
                document.createElement(
                    "strong"
                );

            strong.textContent =
                nome;


            const sub =
                document.createElement(
                    "span"
                );

            sub.textContent =
                `Game ${puntiGame[indice]} / ${puntiPerGame}`;


            player.appendChild(
                strong
            );

            player.appendChild(
                sub
            );


            /* GAMES */

            const games =
                document.createElement(
                    "span"
                );

            games.className =
                "match-stat";

            games.textContent =
                gameVinti[indice];


            if (
                gameVinti[indice] > 0
            ) {

                games.classList.add(
                    "active"
                );
            }


            /* SETS */

            const sets =
                document.createElement(
                    "span"
                );

            sets.className =
                "match-stat";

            sets.textContent =
                setVinti[indice];


            if (
                setVinti[indice] > 0
            ) {

                sets.classList.add(
                    "active"
                );
            }


            /* MATCH */

            const match =
                document.createElement(
                    "span"
                );

            match.className =
                "match-stat";

            match.textContent =
                matchVinti[indice];


            if (
                matchVinti[indice] > 0
            ) {

                match.classList.add(
                    "won"
                );
            }


            /* PUNTEGGIO TOTALE */

            const punti =
                document.createElement(
                    "span"
                );

            punti.className =
                "score-big";

            punti.textContent =
                punteggi[indice];


            riga.appendChild(
                player
            );

            riga.appendChild(
                games
            );

            riga.appendChild(
                sets
            );

            riga.appendChild(
                match
            );

            riga.appendChild(
                punti
            );


            tabellone.appendChild(
                riga
            );
        }
    );
}


/* =========================================================
   SELETTORE GIOCATORE
========================================================= */

function creaSelettoreGiocatore() {

    const select =
        elemento(
            "giocatore-vincitore"
        );

    if (!select) {
        return;
    }


    const valorePrecedente =
        select.value;


    select.innerHTML = "";


    giocatori.forEach(
        (nome, indice) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                indice;

            option.textContent =
                nome;

            select.appendChild(
                option
            );
        }
    );


    if (
        valorePrecedente !== "" &&
        giocatori[
            parseInt(
                valorePrecedente,
                10
            )
        ]
    ) {

        select.value =
            valorePrecedente;
    }
}


/* =========================================================
   BOTTONI RAPIDI
========================================================= */

function creaQuickButtons() {

    const container =
        elemento("quick-buttons");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    giocatori.forEach(
        (nome, indice) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "quick-button";

            button.textContent =
                `+1 ${nome}`;


            button.addEventListener(
                "click",
                () => {

                    elemento(
                        "giocatore-vincitore"
                    ).value =
                        indice;

                    elemento(
                        "punti-mano"
                    ).value = 1;

                    aggiungiMano();
                }
            );


            container.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   AGGIUNGI TURNO
========================================================= */

function aggiungiMano() {

    const indice =
        parseInt(
            elemento(
                "giocatore-vincitore"
            ).value,
            10
        );


    const punti =
        parseInt(
            elemento(
                "punti-mano"
            ).value,
            10
        );


    if (
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= giocatori.length
    ) {

        alert(
            "Seleziona un giocatore."
        );

        return;
    }


    if (
        !Number.isFinite(punti) ||
        punti <= 0
    ) {

        alert(
            "Inserisci un numero di punti valido."
        );

        return;
    }


    numeroTurno++;


    storico.push({

        turno:
            numeroTurno,

        giocatore:
            indice,

        nome:
            giocatori[indice],

        punti:
            punti

    });


    punteggi[indice] += punti;


    if (
        sistemaPunteggio ===
        "game-set"
    ) {

        puntiGame[indice] +=
            punti;

        controllaGame(indice);

    } else {

        controllaVittoria();
    }


    elemento(
        "punti-mano"
    ).value = 1;


    aggiornaSchermataPartita();

    salvaPartita();
}


/* =========================================================
   CONTROLLO GAME
========================================================= */

function controllaGame(indice) {

    if (
        puntiGame[indice] <
        puntiPerGame
    ) {

        return;
    }


    gameVinti[indice]++;


    storicoGame.push({

        vincitore:
            indice,

        nome:
            giocatori[indice],

        punti:
            puntiGame[indice],

        game:
            [...gameVinti]

    });


    mostraMessaggioPartita(
        "game",
        `${giocatori[indice]} vince il Game!`
    );


    /* AZZERA PUNTI GAME */

    puntiGame =
        giocatori.map(
            (_, i) =>
                i === indice
                    ? 0
                    : puntiGame[i]
        );


    /* CONTROLLO SET */

    if (
        gameVinti[indice] >=
        gamePerSet
    ) {

        setVinti[indice]++;


        storicoSet.push({

            vincitore:
                indice,

            nome:
                giocatori[indice],

            game:
                [...gameVinti]

        });


        mostraMessaggioPartita(
            "set",
            `${giocatori[indice]} vince il Set!`
        );


        /* RESET GAME */

        gameVinti =
            giocatori.map(
                () => 0
            );

        puntiGame =
            giocatori.map(
                () => 0
            );


        /* CONTROLLO MATCH */

        if (
            setVinti[indice] >=
            setPerMatch
        ) {

            terminaMatch(
                indice
            );

            return;
        }
    }
}


/* =========================================================
   CONTROLLO VITTORIA SEMPLICE
========================================================= */

function controllaVittoria() {

    const indiceVincitore =
        punteggi.findIndex(
            punteggio =>
                punteggio >=
                obiettivoPartita
        );


    if (
        indiceVincitore === -1
    ) {

        return;
    }


    terminaMatch(
        indiceVincitore
    );
}


/* =========================================================
   TERMINA MATCH
========================================================= */

function terminaMatch(
    indiceVincitore
) {

    matchVinti =
        giocatori.map(
            () => 0
        );


    matchVinti[
        indiceVincitore
    ] = 1;


    localStorage.removeItem(
        STORAGE_KEY
    );


    lanciaConfetti();


    setTimeout(
        () => {

            mostraSchermataVittoria(
                indiceVincitore
            );

        },
        350
    );
}


/* =========================================================
   MESSAGGIO GAME / SET
========================================================= */

function mostraMessaggioPartita(
    tipo,
    testo
) {

    const precedente =
        document.querySelector(
            ".match-message"
        );


    if (precedente) {
        precedente.remove();
    }


    if (messaggioTimeout) {

        clearTimeout(
            messaggioTimeout
        );
    }


    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "cardscore-overlay";


    const messaggio =
        document.createElement(
            "div"
        );

    messaggio.className =
        "match-message";


    let etichetta =
        "MATCH";

    let icona =
        "🏆";


    if (tipo === "game") {

        etichetta =
            "GAME";

        icona =
            "🎯";

    }


    if (tipo === "set") {

        etichetta =
            "SET";

        icona =
            "🏆";
    }


    messaggio.innerHTML = `

        <div class="match-message-icon">
            ${icona}
        </div>

        <div class="match-message-label">
            ${etichetta}
        </div>

        <h2>
            ${escapeHTML(testo)}
        </h2>

        <p>
            Continua a giocare!
        </p>

    `;


    document.body.appendChild(
        overlay
    );

    document.body.appendChild(
        messaggio
    );


    messaggioTimeout =
        setTimeout(
            () => {

                messaggio.remove();

                overlay.remove();

            },
            tipo === "set"
                ? 1500
                : 1200
        );
}


/* =========================================================
   SCHERMATA VITTORIA
========================================================= */

function mostraSchermataVittoria(
    indiceVincitore
) {

    const precedente =
        document.querySelector(
            ".victory-screen"
        );


    if (precedente) {
        precedente.remove();
    }


    const durata =
        calcolaDurataPartita();


    const durataTesto =
        formattaDurata(
            durata
        );


    const vittorieGame =
        gameVinti[
            indiceVincitore
        ] || 0;


    const vittorieSet =
        setVinti[
            indiceVincitore
        ] || 0;


    const screen =
        document.createElement(
            "div"
        );

    screen.className =
        "victory-screen";


    let recapHTML = "";


    if (
        storicoSet.length
    ) {

        recapHTML = `

            <div class="recap-title">
                RISULTATO DEI SET
            </div>

        `;


        storicoSet.forEach(
            (set, indice) => {

                const risultati =
                    set.game
                        .map(
                            (valore, i) =>
                                `${giocatori[i]} ${valore}`
                        )
                        .join(
                            " · "
                        );


                recapHTML += `

                    <div class="recap-set">
                        Set ${indice + 1}
                        ·
                        ${escapeHTML(
                            set.nome
                        )}
                        ·
                        ${escapeHTML(
                            risultati
                        )}
                    </div>

                `;
            }
        );
    }


    screen.innerHTML = `

        <div class="victory-content">

            <div class="victory-trophy">
                🏆
            </div>

            <div class="victory-label">
                PARTITA
            </div>

            <h1>
                PARTITA VINTA!
            </h1>

            <div class="victory-winner">
                ${escapeHTML(
                    giocatori[
                        indiceVincitore
                    ]
                )}
            </div>

            <div class="victory-score">
                Punteggio finale:
                <strong>
                    ${punteggi[
                        indiceVincitore
                    ]}
                </strong>
            </div>


            <div class="victory-stats">

                <div class="victory-stat">

                    <strong>
                        ${durataTesto}
                    </strong>

                    <span>
                        DURATA
                    </span>

                </div>


                <div class="victory-stat">

                    <strong>
                        ${numeroTurno}
                    </strong>

                    <span>
                        TURNI
                    </span>

                </div>


                <div class="victory-stat">

                    <strong>
                        ${vittorieGame}
                    </strong>

                    <span>
                        GAMES
                    </span>

                </div>

            </div>


            <div class="victory-stats">

                <div class="victory-stat">

                    <strong>
                        ${vittorieSet}
                    </strong>

                    <span>
                        SETS
                    </span>

                </div>


                <div class="victory-stat">

                    <strong>
                        ${matchVinti[
                            indiceVincitore
                        ]}
                    </strong>

                    <span>
                        MATCH
                    </span>

                </div>


                <div class="victory-stat">

                    <strong>
                        ${punteggi[
                            indiceVincitore
                        ]}
                    </strong>

                    <span>
                        PUNTI
                    </span>

                </div>

            </div>


            ${recapHTML}


            <div class="victory-actions">

                <button
                    type="button"
                    class="victory-home-button"
                    onclick="chiudiVittoriaEHome()"
                >
                    Torna alla home
                </button>


                <button
                    type="button"
                    class="victory-new-button"
                    onclick="chiudiVittoriaENuova()"
                >
                    Nuova partita
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        screen
    );
}


/* =========================================================
   CHIUDI VITTORIA
========================================================= */

function chiudiVittoriaEHome() {

    const screen =
        document.querySelector(
            ".victory-screen"
        );


    if (screen) {
        screen.remove();
    }


    tornaHome();
}


function chiudiVittoriaENuova() {

    const screen =
        document.querySelector(
            ".victory-screen"
        );


    if (screen) {
        screen.remove();
    }


    nuovaPartita();
}


/* =========================================================
   DURATA PARTITA
========================================================= */

function calcolaDurataPartita() {

    if (!partitaIniziata) {
        return 0;
    }


    return Math.max(
        0,
        Date.now() -
        partitaIniziata
    );
}


function formattaDurata(
    millisecondi
) {

    const secondi =
        Math.floor(
            millisecondi / 1000
        );


    const minuti =
        Math.floor(
            secondi / 60
        );


    const ore =
        Math.floor(
            minuti / 60
        );


    if (ore > 0) {

        return `${ore}h ${
            minuti % 60
        }m`;

    }


    if (minuti > 0) {

        return `${minuti} min`;

    }


    return `${secondi} sec`;
}


/* =========================================================
   STORICO
========================================================= */

function creaRigaStorico(
    elementoStorico
) {

    const riga =
        document.createElement(
            "div"
        );

    riga.className =
        "history-row";


    const turno =
        document.createElement(
            "div"
        );

    turno.className =
        "history-turn";

    turno.textContent =
        `Turno ${elementoStorico.turno}`;


    const dettagli =
        document.createElement(
            "div"
        );

    dettagli.className =
        "history-details";


    const nome =
        document.createElement(
            "span"
        );

    nome.className =
        "history-player";

    nome.textContent =
        elementoStorico.nome;


    const punti =
        document.createElement(
            "span"
        );

    punti.className =
        "history-points";

    punti.textContent =
        `+${elementoStorico.punti} punti`;


    dettagli.appendChild(
        nome
    );

    dettagli.appendChild(
        punti
    );


    const freccia =
        document.createElement(
            "span"
        );

    freccia.className =
        "history-arrow";

    freccia.textContent =
        "›";


    riga.appendChild(
        turno
    );

    riga.appendChild(
        dettagli
    );

    riga.appendChild(
        freccia
    );


    return riga;
}


function mostraStorico() {

    const container =
        elemento("storico-turni");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!storico.length) {

        container.innerHTML = `

            <div class="history-empty">
                Nessun turno ancora registrato
            </div>

        `;

        return;
    }


    storico
        .slice(-5)
        .reverse()
        .forEach(
            turno => {

                container.appendChild(
                    creaRigaStorico(
                        turno
                    )
                );

            }
        );
}


/* =========================================================
   STORICO COMPLETO
========================================================= */

function mostraStoricoCompleto() {

    const container =
        elemento(
            "storico-completo-lista"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!storico.length) {

        container.innerHTML = `

            <div class="history-empty">
                Nessun turno ancora registrato
            </div>

        `;

    } else {

        storico
            .slice()
            .reverse()
            .forEach(
                turno => {

                    container.appendChild(
                        creaRigaStorico(
                            turno
                        )
                    );

                }
            );
    }


    mostraPagina(
        "storico-completo"
    );
}


/* =========================================================
   CHIUDI STORICO
========================================================= */

function chiudiStorico() {

    mostraPagina(
        "partita"
    );

    aggiornaSchermataPartita();
}


/* =========================================================
   ANNULLA ULTIMO TURNO
========================================================= */

function annullaUltimoTurno() {

    if (!storico.length) {

        alert(
            "Non ci sono turni da annullare."
        );

        return;
    }


    storico.pop();


    numeroTurno =
        storico.length;


    ricalcolaPartita();


    aggiornaSchermataPartita();

    salvaPartita();
}


/* =========================================================
   RICALCOLA PARTITA
========================================================= */

function ricalcolaPartita() {

    punteggi =
        giocatori.map(
            () => 0
        );

    puntiGame =
        giocatori.map(
            () => 0
        );

    gameVinti =
        giocatori.map(
            () => 0
        );

    setVinti =
        giocatori.map(
            () => 0
        );

    matchVinti =
        giocatori.map(
            () => 0
        );

    storicoGame = [];

    storicoSet = [];


    storico.forEach(
        turno => {

            const indice =
                turno.giocatore;


            punteggi[indice] +=
                turno.punti;


            if (
                sistemaPunteggio ===
                "game-set"
            ) {

                puntiGame[indice] +=
                    turno.punti;


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

                        gameVinti =
                            giocatori.map(
                                () => 0
                            );

                        setVinti[indice]++;


                        if (
                            setVinti[indice] >=
                            setPerMatch
                        ) {

                            matchVinti =
                                giocatori.map(
                                    () => 0
                                );

                            matchVinti[indice] =
                                1;

                        }
                    }
                }
            }
        }
    );
}


/* =========================================================
   SALVATAGGIO
========================================================= */

function salvaPartita() {

    if (
        !giocoScelto ||
        !giocatori.length
    ) {

        return;
    }


    const dati = {

        giocoScelto,

        giocatori,

        punteggi,

        storico,

        numeroTurno,

        sistemaPunteggio,

        obiettivoPartita,

        puntiPerGame,

        gamePerSet,

        setPerMatch,

        puntiGame,

        gameVinti,

        setVinti,

        matchVinti,

        storicoGame,

        storicoSet,

        partitaIniziata

    };


    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(dati)
        );

    } catch (errore) {

        console.error(
            "Errore salvataggio:",
            errore
        );
    }
}


/* =========================================================
   AGGIORNA PARTITA SALVATA
========================================================= */

function aggiornaPartitaSalvata() {

    const card =
        elemento(
            "partita-in-corso"
        );


    const titolo =
        elemento(
            "partita-salvata-titolo"
        );


    const info =
        elemento(
            "partita-salvata-info"
        );


    if (!card) {
        return;
    }


    let dati = null;


    try {

        const salvata =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (salvata) {

            dati =
                JSON.parse(
                    salvata
                );
        }

    } catch (errore) {

        console.error(
            "Errore lettura partita:",
            errore
        );
    }


    if (
        !dati ||
        !dati.giocatori ||
        !dati.giocatori.length
    ) {

        card.classList.add(
            "hidden"
        );

        return;
    }


    card.classList.remove(
        "hidden"
    );


    if (titolo) {

        titolo.textContent =
            dati.giocoScelto ||
            "Partita";

    }


    if (info) {

        info.textContent =
            `${dati.giocatori.length} giocatori · Turno ${
                dati.numeroTurno
            }`;
    }
}


/* =========================================================
   CONTINUA PARTITA
========================================================= */

function continuaPartita() {

    let dati = null;


    try {

        const salvata =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!salvata) {

            alert(
                "Non c'è nessuna partita salvata."
            );

            return;
        }


        dati =
            JSON.parse(
                salvata
            );

    } catch (errore) {

        console.error(
            "Errore caricamento:",
            errore
        );

        alert(
            "Impossibile caricare la partita."
        );

        return;
    }


    giocoScelto =
        dati.giocoScelto || "";


    giocatori =
        Array.isArray(
            dati.giocatori
        )
            ? dati.giocatori
            : [];


    punteggi =
        Array.isArray(
            dati.punteggi
        )
            ? dati.punteggi
            : giocatori.map(
                () => 0
            );


    storico =
        Array.isArray(
            dati.storico
        )
            ? dati.storico
            : [];


    numeroTurno =
        dati.numeroTurno ||
        storico.length;


    sistemaPunteggio =
        dati.sistemaPunteggio ||
        "semplice";


    obiettivoPartita =
        dati.obiettivoPartita ||
        500;


    puntiPerGame =
        dati.puntiPerGame ||
        21;


    gamePerSet =
        dati.gamePerSet ||
        3;


    setPerMatch =
        dati.setPerMatch ||
        2;


    puntiGame =
        Array.isArray(
            dati.puntiGame
        )
            ? dati.puntiGame
            : giocatori.map(
                () => 0
            );


    gameVinti =
        Array.isArray(
            dati.gameVinti
        )
            ? dati.gameVinti
            : giocatori.map(
                () => 0
            );


    setVinti =
        Array.isArray(
            dati.setVinti
        )
            ? dati.setVinti
            : giocatori.map(
                () => 0
            );


    matchVinti =
        Array.isArray(
            dati.matchVinti
        )
            ? dati.matchVinti
            : giocatori.map(
                () => 0
            );


    storicoGame =
        Array.isArray(
            dati.storicoGame
        )
            ? dati.storicoGame
            : [];


    storicoSet =
        Array.isArray(
            dati.storicoSet
        )
            ? dati.storicoSet
            : [];


    partitaIniziata =
        dati.partitaIniziata ||
        Date.now();


    mostraPagina(
        "partita"
    );


    aggiornaSchermataPartita();
}


/* =========================================================
   ESCI DALLA PARTITA
========================================================= */

function esciPartita() {

    salvaPartita();

    mostraPagina(
        "home"
    );

    aggiornaPartitaSalvata();
}


/* =========================================================
   CONFETTI
========================================================= */

function lanciaConfetti() {

    let canvas =
        elemento(
            "confetti-canvas"
        );


    if (!canvas) {

        canvas =
            document.createElement(
                "canvas"
            );

        canvas.id =
            "confetti-canvas";

        document.body.appendChild(
            canvas
        );
    }


    const ctx =
        canvas.getContext("2d");


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        window.innerWidth * dpr;

    canvas.height =
        window.innerHeight * dpr;

    canvas.style.width =
        `${window.innerWidth}px`;

    canvas.style.height =
        `${window.innerHeight}px`;


    ctx.scale(
        dpr,
        dpr
    );


    const pezzi = [];


    for (
        let i = 0;
        i < 140;
        i++
    ) {

        pezzi.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                -20 -
                Math.random() *
                200,

            size:
                5 +
                Math.random() *
                7,

            speed:
                2 +
                Math.random() *
                4,

            angle:
                Math.random() *
                Math.PI *
                2,

            rotation:
                Math.random() *
                0.2 -
                0.1,

            gravity:
                0.08 +
                Math.random() *
                0.08,

            opacity: 1

        });
    }


    let frame;


    function animazione() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        let ancora = false;


        pezzi.forEach(
            pezzo => {

                pezzo.y +=
                    pezzo.speed;

                pezzo.speed +=
                    pezzo.gravity;

                pezzo.x +=
                    Math.sin(
                        pezzo.angle
                    ) * 1.2;

                pezzo.angle +=
                    pezzo.rotation;

                pezzo.opacity -=
                    0.003;


                if (
                    pezzo.y <
                        window.innerHeight +
                        30 &&
                    pezzo.opacity > 0
                ) {

                    ancora = true;

                    ctx.save();

                    ctx.globalAlpha =
                        pezzo.opacity;

                    ctx.translate(
                        pezzo.x,
                        pezzo.y
                    );

                    ctx.rotate(
                        pezzo.angle
                    );


                    const colori = [
                        "#1f6043",
                        "#f9dfa0",
                        "#d1ebf3",
                        "#e7d9ee",
                        "#ffffff"
                    ];


                    ctx.fillStyle =
                        colori[
                            Math.floor(
                                Math.random() *
                                colori.length
                            )
                        ];


                    ctx.fillRect(
                        -pezzo.size / 2,
                        -pezzo.size / 2,
                        pezzo.size,
                        pezzo.size * 1.5
                    );


                    ctx.restore();
                }
            }
        );


        if (ancora) {

            frame =
                requestAnimationFrame(
                    animazione
                );

        } else {

            cancelAnimationFrame(
                frame
            );

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );
        }
    }


    animazione();
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    testo
) {

    return String(testo)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   INIZIALIZZAZIONE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const addButton =
            elemento(
                "aggiungi-giocatore"
            );


        if (addButton) {

            addButton.addEventListener(
                "click",
                aggiungiGiocatore
            );
        }


        /* Due giocatori iniziali */

        if (
            giocatori.length === 0
        ) {

            giocatori = [
                "",
                ""
            ];

            aggiornaListaGiocatori();
        }


        cambiaSistemaPunteggio();

        aggiornaPartitaSalvata();

    }
);