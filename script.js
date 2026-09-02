/* =========================================================
   CARDSCORE - SCRIPT COMPLETO
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
   UTILITY
========================================================= */

function elemento(id) {
    return document.getElementById(id);
}


function escapeHTML(testo) {
    return String(testo)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   PAGINE
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

    const gioco = elemento("gioco-selezionato");
    const sistema = elemento("sistema-punteggio");
    const obiettivo = elemento("obiettivo-partita");
    const punti = elemento("punti-per-game");
    const games = elemento("game-per-set");
    const sets = elemento("set-per-match");

    if (gioco) gioco.textContent = "—";
    if (sistema) sistema.value = "semplice";
    if (obiettivo) obiettivo.value = 500;
    if (punti) punti.value = 21;
    if (games) games.value = 3;
    if (sets) sets.value = 2;

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

    const elementoGioco = elemento("gioco-selezionato");

    if (elementoGioco) {
        elementoGioco.textContent = gioco;
    }

    mostraPagina("nuova-partita");
}


/* =========================================================
   GIOCATORI
========================================================= */

function aggiornaListaGiocatori() {

    const lista = elemento("lista-giocatori");

    if (!lista) return;

    lista.innerHTML = "";

    giocatori.forEach((nome, indice) => {

        const riga = document.createElement("div");
        riga.className = "player-row";

        const input = document.createElement("input");

        input.type = "text";
        input.className = "player-input";
        input.placeholder = `Nome giocatore ${indice + 1}`;
        input.value = nome;
        input.maxLength = 20;
        input.autocomplete = "off";

        input.addEventListener("input", function () {
            giocatori[indice] = this.value;
        });

        riga.appendChild(input);

        if (giocatori.length > 2) {

            const removeButton = document.createElement("button");

            removeButton.type = "button";
            removeButton.className = "remove-player";
            removeButton.setAttribute(
                "aria-label",
                "Rimuovi giocatore"
            );

            removeButton.textContent = "×";

            removeButton.addEventListener("click", function () {

                giocatori.splice(indice, 1);

                aggiornaListaGiocatori();
            });

            riga.appendChild(removeButton);
        }

        lista.appendChild(riga);
    });

    const counter = elemento("numero-giocatori");

    if (counter) {
        counter.textContent = giocatori.length;
    }
}


function aggiungiGiocatore() {

    if (giocatori.length >= 6) {

        alert("Puoi inserire massimo 6 giocatori.");

        return;
    }

    giocatori.push("");

    aggiornaListaGiocatori();

    setTimeout(() => {

        const inputs =
            document.querySelectorAll(".player-input");

        if (inputs.length) {
            inputs[inputs.length - 1].focus();
        }

    }, 50);
}


/* =========================================================
   SISTEMA PUNTEGGIO
========================================================= */

function cambiaSistemaPunteggio() {

    const select = elemento("sistema-punteggio");

    if (!select) return;

    sistemaPunteggio = select.value;

    const semplice =
        elemento("impostazioni-semplice");

    const gameSet =
        elemento("impostazioni-game-set");

    if (!semplice || !gameSet) return;

    if (sistemaPunteggio === "game-set") {

        semplice.classList.add("hidden");
        gameSet.classList.remove("hidden");

    } else {

        semplice.classList.remove("hidden");
        gameSet.classList.add("hidden");
    }
}


/* =========================================================
   INIZIA PARTITA
========================================================= */

function iniziaPartita() {

    const inputs =
        document.querySelectorAll(".player-input");

    giocatori = Array.from(inputs)
        .map(input => input.value.trim())
        .filter(nome => nome.length > 0);

    if (giocatori.length < 2) {

        alert("Inserisci almeno 2 giocatori.");

        return;
    }

    if (giocatori.length > 6) {

        alert("Puoi inserire massimo 6 giocatori.");

        return;
    }

    if (!giocoScelto) {

        alert("Seleziona prima un gioco.");

        return;
    }


    /* =====================================================
       LEGGIAMO SEMPRE I VALORI DIRETTAMENTE DAL FORM
       ===================================================== */

    const selectSistema =
        elemento("sistema-punteggio");

    sistemaPunteggio =
        selectSistema
            ? selectSistema.value
            : "semplice";


    if (sistemaPunteggio === "semplice") {

        obiettivoPartita = parseInt(
            elemento("obiettivo-partita").value,
            10
        );

        if (
            !Number.isFinite(obiettivoPartita) ||
            obiettivoPartita <= 0
        ) {

            alert("Inserisci un obiettivo valido.");

            return;
        }

    } else {

        puntiPerGame = parseInt(
            elemento("punti-per-game").value,
            10
        );

        gamePerSet = parseInt(
            elemento("game-per-set").value,
            10
        );

        setPerMatch = parseInt(
            elemento("set-per-match").value,
            10
        );


        if (
            !Number.isFinite(puntiPerGame) ||
            puntiPerGame <= 0 ||
            !Number.isFinite(gamePerSet) ||
            gamePerSet <= 0 ||
            !Number.isFinite(setPerMatch) ||
            setPerMatch <= 0
        ) {

            alert(
                "Controlla le impostazioni del match."
            );

            return;
        }
    }


    /* =====================================================
       RESET COMPLETO
       ===================================================== */

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

    partitaIniziata = Date.now();


    mostraPagina("partita");

    aggiornaSchermataPartita();

    salvaPartita();

    aggiornaPartitaSalvata();
}


/* =========================================================
   SCHERMATA PARTITA
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

    const banner =
        elemento("banner-game-set");

    if (banner) {
        banner.setAttribute(
            "data-turn",
            numeroTurno + 1
        );
    }


    if (sistemaPunteggio === "game-set") {

        const obiettivo =
            elemento("obiettivo-container");

        const semplice =
            elemento("tabellone-semplice");

        const gameSet =
            elemento("tabellone-game-set");

        const gameBanner =
            elemento("banner-game-set");

        if (obiettivo) {
            obiettivo.classList.add("hidden");
        }

        if (semplice) {
            semplice.classList.add("hidden");
        }

        if (gameSet) {
            gameSet.classList.remove("hidden");
        }

        if (gameBanner) {
            gameBanner.classList.remove("hidden");
        }

        creaTabelloneGameSet();

    } else {

        const obiettivo =
            elemento("obiettivo-container");

        const semplice =
            elemento("tabellone-semplice");

        const gameSet =
            elemento("tabellone-game-set");

        const gameBanner =
            elemento("banner-game-set");

        if (obiettivo) {
            obiettivo.classList.remove("hidden");
        }

        const testo =
            elemento("obiettivo-testo");

        if (testo) {
            testo.textContent = obiettivoPartita;
        }

        if (semplice) {
            semplice.classList.remove("hidden");
        }

        if (gameSet) {
            gameSet.classList.add("hidden");
        }

        if (gameBanner) {
            gameBanner.classList.add("hidden");
        }

        creaTabelloneSemplice();
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

    if (!tabellone) return;

    tabellone.innerHTML = "";

    const massimo =
        Math.max(...punteggi);

    giocatori.forEach((nome, indice) => {

        const riga =
            document.createElement("div");

        riga.className =
            "simple-score-row";

        const nomeElement =
            document.createElement("strong");

        nomeElement.className =
            "simple-player-name";

        nomeElement.textContent =
            nome;

        const score =
            document.createElement("span");

        score.className =
            "simple-player-score";

        score.textContent =
            punteggi[indice];

        riga.appendChild(nomeElement);
        riga.appendChild(score);

        if (
            punteggi[indice] === massimo &&
            punteggi[indice] > 0
        ) {
            riga.classList.add("leader");
        }

        tabellone.appendChild(riga);
    });
}


/* =========================================================
   TABELLONE GAME / SET / MATCH
========================================================= */

function creaTabelloneGameSet() {

    const tabellone =
        elemento("tabellone-game-set");

    if (!tabellone) return;

    tabellone.innerHTML = "";


    const labels =
        document.createElement("div");

    labels.className =
        "scoreboard-labels";

    labels.innerHTML = `
        <span></span>
        <span>GAMES</span>
        <span>SETS</span>
        <span>MATCH</span>
        <span>PUNTI</span>
    `;

    tabellone.appendChild(labels);


    giocatori.forEach((nome, indice) => {

        const riga =
            document.createElement("div");

        riga.className =
            "match-row";


        const player =
            document.createElement("div");

        player.className =
            "match-player";


        const strong =
            document.createElement("strong");

        strong.textContent =
            nome;


        const sub =
            document.createElement("span");

        sub.textContent =
            `Game ${puntiGame[indice]} / ${puntiPerGame}`;


        player.appendChild(strong);
        player.appendChild(sub);


        /* GAMES */

        const games =
            document.createElement("span");

        games.className =
            "match-stat";

        games.textContent =
            gameVinti[indice];


        if (gameVinti[indice] > 0) {
            games.classList.add("active");
        }


        /* SETS */

        const sets =
            document.createElement("span");

        sets.className =
            "match-stat";

        sets.textContent =
            setVinti[indice];


        if (setVinti[indice] > 0) {
            sets.classList.add("active");
        }


        /* MATCH */

        const match =
            document.createElement("span");

        match.className =
            "match-stat";

        match.textContent =
            matchVinti[indice];


        if (matchVinti[indice] > 0) {
            match.classList.add("won");
        }


        /* PUNTI TOTALI */

        const punti =
            document.createElement("span");

        punti.className =
            "score-big";

        punti.textContent =
            punteggi[indice];


        riga.appendChild(player);
        riga.appendChild(games);
        riga.appendChild(sets);
        riga.appendChild(match);
        riga.appendChild(punti);

        tabellone.appendChild(riga);
    });
}


/* =========================================================
   SELETTORE GIOCATORE
========================================================= */

function creaSelettoreGiocatore() {

    const select =
        elemento("giocatore-vincitore");

    if (!select) return;

    const precedente =
        select.value;

    select.innerHTML = "";

    giocatori.forEach((nome, indice) => {

        const option =
            document.createElement("option");

        option.value =
            indice;

        option.textContent =
            nome;

        select.appendChild(option);
    });


    if (
        precedente !== "" &&
        giocatori[parseInt(precedente, 10)]
    ) {

        select.value = precedente;
    }
}


/* =========================================================
   BOTTONI RAPIDI
========================================================= */

function creaQuickButtons() {

    const container =
        elemento("quick-buttons");

    if (!container) return;

    container.innerHTML = "";

    giocatori.forEach((nome, indice) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "quick-button";

        button.textContent =
            `+1 ${nome}`;

        button.addEventListener(
            "click",
            function () {

                const select =
                    elemento("giocatore-vincitore");

                const punti =
                    elemento("punti-mano");

                if (select) {
                    select.value = indice;
                }

                if (punti) {
                    punti.value = 1;
                }

                aggiungiMano();
            }
        );

        container.appendChild(button);
    });
}


/* =========================================================
   AGGIUNGI TURNO
========================================================= */

function aggiungiMano() {

    /*
       IMPORTANTISSIMO:
       leggiamo il sistema direttamente dal select ogni volta.
       Questo evita che il Game/Set/Match venga ignorato.
    */

    const selectSistema =
        elemento("sistema-punteggio");

    sistemaPunteggio =
        selectSistema
            ? selectSistema.value
            : sistemaPunteggio;


    const selectGiocatore =
        elemento("giocatore-vincitore");

    const inputPunti =
        elemento("punti-mano");


    const indice =
        parseInt(
            selectGiocatore
                ? selectGiocatore.value
                : "",
            10
        );

    const punti =
        parseInt(
            inputPunti
                ? inputPunti.value
                : "",
            10
        );


    if (
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= giocatori.length
    ) {

        alert("Seleziona un giocatore.");

        return;
    }


    if (
        !Number.isFinite(punti) ||
        punti <= 0
    ) {

        alert("Inserisci un numero di punti valido.");

        return;
    }


    numeroTurno++;


    storico.push({

        turno: numeroTurno,

        giocatore: indice,

        nome: giocatori[indice],

        punti: punti
    });


    /* PUNTEGGIO TOTALE DEL MATCH */

    punteggi[indice] =
        Number(punteggi[indice] || 0) + punti;


    /* =====================================================
       GAME / SET / MATCH
    ===================================================== */

    if (sistemaPunteggio === "game-set") {

        puntiGame[indice] =
            Number(puntiGame[indice] || 0) + punti;

        controllaGame(indice);

    } else {

        controllaVittoria();
    }


    if (inputPunti) {
        inputPunti.value = 1;
    }


    aggiornaSchermataPartita();

    salvaPartita();
}


/* =========================================================
   CONTROLLO GAME
========================================================= */

function controllaGame(indice) {

    if (sistemaPunteggio !== "game-set") {
        return;
    }


    /*
       RILEGGIAMO I VALORI NUMERICI
       DIRETTAMENTE DALLE VARIABILI DEL MATCH.
    */

    const limiteGame =
        Number(puntiPerGame);

    const limiteSet =
        Number(gamePerSet);

    const limiteMatch =
        Number(setPerMatch);


    if (
        !Number.isFinite(limiteGame) ||
        limiteGame <= 0
    ) {

        console.error(
            "ERRORE: puntiPerGame non valido",
            puntiPerGame
        );

        return;
    }


    if (!Number.isFinite(puntiGame[indice])) {
        puntiGame[indice] = 0;
    }


    /*
       USIAMO WHILE:
       se vengono assegnati 25 punti con un Game da 21,
       viene assegnato il Game e i 4 punti restano
       nel Game successivo.
    */

    while (
        puntiGame[indice] >= limiteGame
    ) {

        /* Togliamo i punti necessari al Game */

        puntiGame[indice] -= limiteGame;


        /* Incrementiamo i Game vinti */

        gameVinti[indice] =
            Number(gameVinti[indice] || 0) + 1;


        /* Salviamo lo storico */

        storicoGame.push({

            vincitore: indice,

            nome: giocatori[indice],

            punti: limiteGame,

            game: [...gameVinti],

            set: [...setVinti]
        });


        /* Mostriamo il messaggio */

        mostraMessaggioPartita(
            "game",
            `${giocatori[indice]} vince il Game!`
        );


        /* =================================================
           CONTROLLO SET
        ================================================= */

        if (
            gameVinti[indice] >= limiteSet
        ) {

            setVinti[indice] =
                Number(setVinti[indice] || 0) + 1;


            /*
               Salviamo il risultato del Set PRIMA
               di azzerare i Game.
            */

            storicoSet.push({

                vincitore: indice,

                nome: giocatori[indice],

                game: [...gameVinti],

                set: [...setVinti]
            });


            mostraMessaggioPartita(
                "set",
                `${giocatori[indice]} vince il Set!`
            );


            /* =================================================
               CONTROLLO MATCH
            ================================================= */

            if (
                setVinti[indice] >= limiteMatch
            ) {

                terminaMatch(indice);

                return;
            }


            /*
               NUOVO SET
            */

            gameVinti =
                giocatori.map(() => 0);

            puntiGame =
                giocatori.map(() => 0);

            return;
        }
    }
}


/* =========================================================
   VITTORIA PUNTEGGIO SEMPLICE
========================================================= */

function controllaVittoria() {

    if (sistemaPunteggio !== "semplice") {
        return;
    }


    const vincitore =
        punteggi.findIndex(
            punteggio =>
                punteggio >= obiettivoPartita
        );


    if (vincitore === -1) {
        return;
    }


    terminaMatch(vincitore);
}


/* =========================================================
   TERMINA MATCH
========================================================= */

function terminaMatch(indiceVincitore) {

    matchVinti =
        giocatori.map(() => 0);

    matchVinti[indiceVincitore] = 1;


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

function mostraMessaggioPartita(tipo, testo) {

    const precedente =
        document.querySelector(
            ".match-message"
        );

    if (precedente) {
        precedente.remove();
    }


    const precedenteOverlay =
        document.querySelector(
            ".cardscore-overlay"
        );

    if (precedenteOverlay) {
        precedenteOverlay.remove();
    }


    if (messaggioTimeout) {
        clearTimeout(messaggioTimeout);
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "cardscore-overlay";


    const messaggio =
        document.createElement("div");

    messaggio.className =
        "match-message";


    let etichetta = "MATCH";
    let icona = "🏆";


    if (tipo === "game") {
        etichetta = "GAME";
        icona = "🎯";
    }


    if (tipo === "set") {
        etichetta = "SET";
        icona = "🏆";
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


    document.body.appendChild(overlay);
    document.body.appendChild(messaggio);


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

function mostraSchermataVittoria(indiceVincitore) {

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
        formattaDurata(durata);


    const vittorieGame =
        gameVinti[indiceVincitore] || 0;

    const vittorieSet =
        setVinti[indiceVincitore] || 0;


    const screen =
        document.createElement("div");

    screen.className =
        "victory-screen";


    let recapHTML = "";


    if (storicoSet.length) {

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
                        .join(" · ");


                recapHTML += `
                    <div class="recap-set">
                        Set ${indice + 1}
                        ·
                        ${escapeHTML(set.nome)}
                        ·
                        ${escapeHTML(risultati)}
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
                    giocatori[indiceVincitore]
                )}
            </div>

            <div class="victory-score">
                Punteggio finale:
                <strong>
                    ${punteggi[indiceVincitore]}
                </strong>
            </div>


            <div class="victory-stats">

                <div class="victory-stat">
                    <strong>${durataTesto}</strong>
                    <span>DURATA</span>
                </div>

                <div class="victory-stat">
                    <strong>${numeroTurno}</strong>
                    <span>TURNI</span>
                </div>

                <div class="victory-stat">
                    <strong>${vittorieGame}</strong>
                    <span>GAMES</span>
                </div>

            </div>


            <div class="victory-stats">

                <div class="victory-stat">
                    <strong>${vittorieSet}</strong>
                    <span>SETS</span>
                </div>

                <div class="victory-stat">
                    <strong>
                        ${matchVinti[indiceVincitore]}
                    </strong>
                    <span>MATCH</span>
                </div>

                <div class="victory-stat">
                    <strong>
                        ${punteggi[indiceVincitore]}
                    </strong>
                    <span>PUNTI</span>
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


    document.body.appendChild(screen);
}


/* =========================================================
   CHIUSURA VITTORIA
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
   DURATA
========================================================= */

function calcolaDurataPartita() {

    if (!partitaIniziata) {
        return 0;
    }

    return Math.max(
        0,
        Date.now() - partitaIniziata
    );
}


function formattaDurata(millisecondi) {

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
        return `${ore}h ${minuti % 60}m`;
    }

    if (minuti > 0) {
        return `${minuti} min`;
    }

    return `${secondi} sec`;
}


/* =========================================================
   STORICO
========================================================= */

function creaRigaStorico(elementoStorico) {

    const riga =
        document.createElement("div");

    riga.className =
        "history-row";


    const turno =
        document.createElement("div");

    turno.className =
        "history-turn";

    turno.textContent =
        `Turno ${elementoStorico.turno}`;


    const dettagli =
        document.createElement("div");

    dettagli.className =
        "history-details";


    const nome =
        document.createElement("span");

    nome.className =
        "history-player";

    nome.textContent =
        elementoStorico.nome;


    const punti =
        document.createElement("span");

    punti.className =
        "history-points";

    punti.textContent =
        `+${elementoStorico.punti} punti`;


    dettagli.appendChild(nome);
    dettagli.appendChild(punti);


    const freccia =
        document.createElement("span");

    freccia.className =
        "history-arrow";

    freccia.textContent =
        "›";


    riga.appendChild(turno);
    riga.appendChild(dettagli);
    riga.appendChild(freccia);


    return riga;
}


function mostraStorico() {

    const container =
        elemento("storico-turni");

    if (!container) return;

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
        .forEach(turno => {

            container.appendChild(
                creaRigaStorico(turno)
            );

        });
}


function mostraStoricoCompleto() {

    const container =
        elemento("storico-completo-lista");

    if (!container) return;

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
            .forEach(turno => {

                container.appendChild(
                    creaRigaStorico(turno)
                );

            });
    }


    mostraPagina("storico-completo");
}


function chiudiStorico() {

    mostraPagina("partita");

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
        giocatori.map(() => 0);

    puntiGame =
        giocatori.map(() => 0);

    gameVinti =
        giocatori.map(() => 0);

    setVinti =
        giocatori.map(() => 0);

    matchVinti =
        giocatori.map(() => 0);

    storicoGame = [];
    storicoSet = [];


    storico.forEach(turno => {

        const indice =
            Number(turno.giocatore);

        const punti =
            Number(turno.punti);


        if (
            !Number.isInteger(indice) ||
            indice < 0 ||
            indice >= giocatori.length
        ) {
            return;
        }


        punteggi[indice] += punti;


        if (sistemaPunteggio !== "game-set") {
            return;
        }


        puntiGame[indice] += punti;


        while (
            puntiGame[indice] >= puntiPerGame
        ) {

            puntiGame[indice] -= puntiPerGame;

            gameVinti[indice]++;


            storicoGame.push({

                vincitore: indice,

                nome: giocatori[indice],

                punti: puntiPerGame,

                game: [...gameVinti],

                set: [...setVinti]
            });


            if (
                gameVinti[indice] >= gamePerSet
            ) {

                setVinti[indice]++;


                storicoSet.push({

                    vincitore: indice,

                    nome: giocatori[indice],

                    game: [...gameVinti],

                    set: [...setVinti]
                });


                if (
                    setVinti[indice] >= setPerMatch
                ) {

                    matchVinti =
                        giocatori.map(() => 0);

                    matchVinti[indice] = 1;

                    return;
                }


                gameVinti =
                    giocatori.map(() => 0);

                puntiGame =
                    giocatori.map(() => 0);

                break;
            }
        }
    });
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
   PARTITA SALVATA
========================================================= */

function aggiornaPartitaSalvata() {

    const card =
        elemento("partita-in-corso");

    const titolo =
        elemento("partita-salvata-titolo");

    const info =
        elemento("partita-salvata-info");


    if (!card) return;


    let dati = null;


    try {

        const salvata =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (salvata) {
            dati = JSON.parse(salvata);
        }

    } catch (errore) {

        console.error(
            "Errore lettura partita:",
            errore
        );
    }


    if (
        !dati ||
        !Array.isArray(dati.giocatori) ||
        !dati.giocatori.length
    ) {

        card.classList.add("hidden");

        return;
    }


    card.classList.remove("hidden");


    if (titolo) {

        titolo.textContent =
            dati.giocoScelto ||
            "Partita";
    }


    if (info) {

        info.textContent =
            `${dati.giocatori.length} giocatori · Turno ${dati.numeroTurno || 0}`;
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
            JSON.parse(salvata);

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
        Array.isArray(dati.giocatori)
            ? dati.giocatori
            : [];


    punteggi =
        Array.isArray(dati.punteggi)
            ? dati.punteggi
            : giocatori.map(() => 0);


    storico =
        Array.isArray(dati.storico)
            ? dati.storico
            : [];


    numeroTurno =
        Number.isFinite(Number(dati.numeroTurno))
            ? Number(dati.numeroTurno)
            : storico.length;


    sistemaPunteggio =
        dati.sistemaPunteggio ||
        "semplice";


    obiettivoPartita =
        Number(dati.obiettivoPartita) ||
        500;


    puntiPerGame =
        Number(dati.puntiPerGame) ||
        21;


    gamePerSet =
        Number(dati.gamePerSet) ||
        3;


    setPerMatch =
        Number(dati.setPerMatch) ||
        2;


    puntiGame =
        Array.isArray(dati.puntiGame)
            ? dati.puntiGame
            : giocatori.map(() => 0);


    gameVinti =
        Array.isArray(dati.gameVinti)
            ? dati.gameVinti
            : giocatori.map(() => 0);


    setVinti =
        Array.isArray(dati.setVinti)
            ? dati.setVinti
            : giocatori.map(() => 0);


    matchVinti =
        Array.isArray(dati.matchVinti)
            ? dati.matchVinti
            : giocatori.map(() => 0);


    storicoGame =
        Array.isArray(dati.storicoGame)
            ? dati.storicoGame
            : [];


    storicoSet =
        Array.isArray(dati.storicoSet)
            ? dati.storicoSet
            : [];


    partitaIniziata =
        dati.partitaIniziata ||
        Date.now();


    /*
       Sincronizziamo anche il menu HTML.
    */

    const select =
        elemento("sistema-punteggio");

    if (select) {
        select.value = sistemaPunteggio;
    }


    mostraPagina("partita");

    aggiornaSchermataPartita();
}


/* =========================================================
   ESCI PARTITA
========================================================= */

function esciPartita() {

    salvaPartita();

    mostraPagina("home");

    aggiornaPartitaSalvata();
}


/* =========================================================
   CONFETTI
========================================================= */

function lanciaConfetti() {

    let canvas =
        elemento("confetti-canvas");


    if (!canvas) {

        canvas =
            document.createElement("canvas");

        canvas.id =
            "confetti-canvas";

        document.body.appendChild(canvas);
    }


    const ctx =
        canvas.getContext("2d");


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        window.innerWidth * dpr;

    canvas.height =
        window.innerHeight * dpr;

    canvas.style.width =
        `${window.innerWidth}px`;

    canvas.style.height =
        `${window.innerHeight}px`;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    const pezzi = [];


    for (let i = 0; i < 140; i++) {

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


        pezzi.forEach(pezzo => {

            pezzo.y += pezzo.speed;

            pezzo.speed += pezzo.gravity;

            pezzo.x +=
                Math.sin(pezzo.angle) *
                1.2;

            pezzo.angle +=
                pezzo.rotation;

            pezzo.opacity -=
                0.003;


            if (
                pezzo.y <
                    window.innerHeight + 30 &&
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
        });


        if (ancora) {

            frame =
                requestAnimationFrame(
                    animazione
                );

        } else {

            cancelAnimationFrame(frame);

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
   INIZIALIZZAZIONE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const addButton =
            elemento("aggiungi-giocatore");


        if (addButton) {

            addButton.addEventListener(
                "click",
                aggiungiGiocatore
            );
        }


        /*
           Due giocatori iniziali.
        */

        if (giocatori.length === 0) {

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