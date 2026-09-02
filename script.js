/* =========================================================
   CARDSCORE — SCRIPT
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

let storicoGame = [];
let storicoSet = [];

let messaggioTimeout = null;

const STORAGE_KEY = "cardscore_partita";


/* =========================================================
   ELEMENTI UTILI
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
        behavior: "instant"
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

    storicoGame = [];
    storicoSet = [];

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

    if (!lista) return;

    lista.innerHTML = "";

    giocatori.forEach((nome, indice) => {

        const riga = document.createElement("div");

        riga.className = "player-input-row";

        riga.innerHTML = `
            <input
                class="player-input"
                type="text"
                placeholder="Nome giocatore ${indice + 1}"
                value="${escapeHTML(nome)}"
                maxlength="20"
                autocomplete="off"
            >

            ${
                giocatori.length > 2
                ? `
                    <button
                        class="remove-player"
                        type="button"
                        aria-label="Rimuovi giocatore"
                    >
                        ×
                    </button>
                `
                : ""
            }
        `;

        const input = riga.querySelector(".player-input");

        input.addEventListener("input", function () {
            giocatori[indice] = this.value;
        });

        const removeButton = riga.querySelector(".remove-player");

        if (removeButton) {

            removeButton.addEventListener("click", function () {

                giocatori.splice(indice, 1);

                aggiornaListaGiocatori();
            });
        }

        lista.appendChild(riga);
    });

    elemento("numero-giocatori").textContent = giocatori.length;
}


/* =========================================================
   AGGIUNGI GIOCATORE
   ========================================================= */

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

        if (inputs.length > 0) {
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

    const semplice = elemento("impostazioni-semplice");
    const gameSet = elemento("impostazioni-game-set");

    const tabelloneSemplice =
        elemento("tabellone-semplice");

    const tabelloneGameSet =
        elemento("tabellone-game-set");

    const banner =
        elemento("banner-game-set");

    if (sistemaPunteggio === "semplice") {

        semplice.classList.remove("hidden");
        gameSet.classList.add("hidden");

        if (tabelloneSemplice) {
            tabelloneSemplice.classList.remove("hidden");
        }

        if (tabelloneGameSet) {
            tabelloneGameSet.classList.add("hidden");
        }

        if (banner) {
            banner.classList.add("hidden");
        }

    } else {

        semplice.classList.add("hidden");
        gameSet.classList.remove("hidden");

        if (tabelloneSemplice) {
            tabelloneSemplice.classList.add("hidden");
        }

        if (tabelloneGameSet) {
            tabelloneGameSet.classList.remove("hidden");
        }

        if (banner) {
            banner.classList.remove("hidden");
        }
    }
}


/* =========================================================
   INIZIA PARTITA
   ========================================================= */

function iniziaPartita() {

    // Legge i nomi direttamente dagli input
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


    sistemaPunteggio =
        elemento("sistema-punteggio").value;


    if (sistemaPunteggio === "semplice") {

        obiettivoPartita =
            parseInt(
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

        puntiPerGame =
            parseInt(
                elemento("punti-per-game").value,
                10
            );

        gamePerSet =
            parseInt(
                elemento("game-per-set").value,
                10
            );

        setPerMatch =
            parseInt(
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

            alert("Controlla le impostazioni del match.");

            return;
        }
    }


    // Reset partita
    punteggi = giocatori.map(() => 0);

    puntiGame = giocatori.map(() => 0);

    gameVinti = giocatori.map(() => 0);

    setVinti = giocatori.map(() => 0);

    storico = [];

    numeroTurno = 0;

    storicoGame = [];

    storicoSet = [];


    mostraPagina("partita");

    aggiornaSchermataPartita();

    salvaPartita();
}


/* =========================================================
   AGGIORNA SCHERMATA PARTITA
   ========================================================= */

function aggiornaSchermataPartita() {

    elemento("titolo-partita").textContent =
        giocoScelto || "Partita";

    elemento("numero-mano").textContent =
        `Turno ${numeroTurno + 1}`;


    if (sistemaPunteggio === "semplice") {

        elemento("obiettivo-container")
            .classList.remove("hidden");

        elemento("obiettivo-testo")
            .textContent = obiettivoPartita;

        elemento("tabellone-semplice")
            .classList.remove("hidden");

        elemento("tabellone-game-set")
            .classList.add("hidden");

        elemento("banner-game-set")
            .classList.add("hidden");

        creaTabelloneSemplice();

    } else {

        elemento("obiettivo-container")
            .classList.add("hidden");

        elemento("tabellone-semplice")
            .classList.add("hidden");

        elemento("tabellone-game-set")
            .classList.remove("hidden");

        elemento("banner-game-set")
            .classList.remove("hidden");

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

    tabellone.innerHTML = "";

    if (!giocatori.length) return;


    const punteggioMassimo =
        Math.max(...punteggi);


    giocatori.forEach((nome, indice) => {

        const riga =
            document.createElement("div");

        riga.className =
            "simple-score-row";

        if (
            punteggi[indice] === punteggioMassimo &&
            punteggioMassimo > 0
        ) {
            riga.classList.add("leader");
        }


        const nomeElement =
            document.createElement("strong");

        nomeElement.textContent = nome;


        const score =
            document.createElement("span");

        score.className =
            "simple-score-value";

        score.textContent =
            punteggi[indice];


        riga.appendChild(nomeElement);
        riga.appendChild(score);

        tabellone.appendChild(riga);
    });
}


/* =========================================================
   TABELLONE GAME / SET / MATCH
   ========================================================= */

function creaTabelloneGameSet() {

    const tabellone =
        elemento("tabellone-game-set");

    tabellone.innerHTML = "";

    if (!giocatori.length) return;


    const punteggioMassimo =
        Math.max(...puntiGame);


    giocatori.forEach((nome, indice) => {

        const riga =
            document.createElement("div");

        riga.className =
            "match-row";


        if (
            puntiGame[indice] === punteggioMassimo &&
            punteggioMassimo > 0
        ) {
            riga.classList.add("leader");
        }


        const nomeElement =
            document.createElement("strong");

        nomeElement.textContent = nome;


        const game =
            document.createElement("span");

        game.textContent =
            puntiGame[indice];


        const games =
            document.createElement("span");

        games.textContent =
            gameVinti[indice];


        const sets =
            document.createElement("span");

        sets.textContent =
            setVinti[indice];


        const punti =
            document.createElement("span");

        punti.className =
            "score-big";

        punti.textContent =
            puntiGame[indice];


        riga.appendChild(nomeElement);
        riga.appendChild(game);
        riga.appendChild(games);
        riga.appendChild(sets);
        riga.appendChild(punti);


        tabellone.appendChild(riga);
    });
}


/* =========================================================
   SELETTORE GIOCATORE
   ========================================================== */

function creaSelettoreGiocatore() {

    const select =
        elemento("giocatore-vincitore");

    select.innerHTML = "";

    giocatori.forEach((nome, indice) => {

        const option =
            document.createElement("option");

        option.value = indice;

        option.textContent = nome;

        select.appendChild(option);
    });
}


/* =========================================================
   BOTTONI RAPIDI
   ========================================================== */

function creaQuickButtons() {

    const container =
        elemento("quick-buttons");

    container.innerHTML = "";

    if (!giocatori.length) return;


    giocatori.forEach((nome, indice) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "quick-button";

        button.textContent =
            `+1 ${nome}`;

        button.addEventListener("click", () => {

            elemento("giocatore-vincitore").value =
                indice;

            elemento("punti-mano").value = 1;

            aggiungiMano();
        });

        container.appendChild(button);
    });
}


/* =========================================================
   AGGIUNGI MANO
   ========================================================== */

function aggiungiMano() {

    const indice =
        parseInt(
            elemento("giocatore-vincitore").value,
            10
        );

    const punti =
        parseInt(
            elemento("punti-mano").value,
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


    punteggi[indice] += punti;


    if (sistemaPunteggio === "game-set") {

        puntiGame[indice] += punti;

        controllaGame(indice);

    } else {

        controllaVittoria();
    }


    elemento("punti-mano").value = 1;

    aggiornaSchermataPartita();

    salvaPartita();
}


/* =========================================================
   CONTROLLO GAME
   ========================================================== */

function controllaGame(indice) {

    if (
        puntiGame[indice] < puntiPerGame
    ) {
        return;
    }


    gameVinti[indice]++;

    storicoGame.push({
        vincitore: indice,
        nome: giocatori[indice],
        punti: puntiGame[indice]
    });


    mostraMessaggioPartita(
        "game",
        `${giocatori[indice]} vince il Game!`
    );


    puntiGame =
        giocatori.map((_, i) =>
            i === indice ? 0 : puntiGame[i]
        );


    if (
        gameVinti[indice] >= gamePerSet
    ) {

        setVinti[indice]++;

        storicoSet.push({
            vincitore: indice,
            nome: giocatori[indice],
            game: [...gameVinti]
        });


        mostraMessaggioPartita(
            "set",
            `${giocatori[indice]} vince il Set!`
        );


        gameVinti =
            giocatori.map(() => 0);


        puntiGame =
            giocatori.map(() => 0);


        if (
            setVinti[indice] >= setPerMatch
        ) {

            setTimeout(() => {

                lanciaConfetti();

                mostraMessaggioPartita(
                    "match",
                    `${giocatori[indice]} VINCE LA PARTITA!`
                );

                setTimeout(() => {

                    mostraRecapPartita(indice);

                }, 900);

            }, 500);


            localStorage.removeItem(STORAGE_KEY);
        }
    }
}


/* =========================================================
   CONTROLLO VITTORIA SEMPLICE
   ========================================================== */

function controllaVittoria() {

    const indiceVincitore =
        punteggi.findIndex(
            punteggio =>
                punteggio >= obiettivoPartita
        );


    if (indiceVincitore === -1) {
        return;
    }


    lanciaConfetti();


    localStorage.removeItem(STORAGE_KEY);


    setTimeout(() => {

        mostraMessaggioPartita(
            "match",
            `${giocatori[indiceVincitore]} VINCE LA PARTITA!`
        );

    }, 150);


    setTimeout(() => {

        mostraRecapPartita(indiceVincitore);

    }, 1000);
}


/* =========================================================
   MESSAGGIO GAME / SET / MATCH
   ========================================================== */

function mostraMessaggioPartita(tipo, testo) {

    const precedente =
        document.querySelector(".match-message");

    if (precedente) {
        precedente.remove();
    }


    if (messaggioTimeout) {
        clearTimeout(messaggioTimeout);
    }


    const messaggio =
        document.createElement("div");

    messaggio.className =
        "match-message";


    let etichetta = "PARTITA";

    let icona = "🏆";

    if (tipo === "game") {
        etichetta = "GAME";
        icona = "🎯";
    }

    if (tipo === "set") {
        etichetta = "SET";
        icona = "🏆";
    }

    if (tipo === "match") {
        etichetta = "MATCH";
        icona = "🏆";
    }


    messaggio.innerHTML = `
        <div class="match-message-icon">
            ${icona}
        </div>

        <div class="match-message-label">
            ${etichetta}
        </div>

        <h2>${escapeHTML(testo)}</h2>

        <p>
            Continua a giocare!
        </p>
    `;


    document.body.appendChild(messaggio);


    messaggioTimeout =
        setTimeout(() => {

            messaggio.remove();

        }, tipo === "match" ? 2600 : 1600);
}


/* =========================================================
   STORICO
   ========================================================== */

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


    const ultimi =
        storico.slice(-5).reverse();


    ultimi.forEach(turno => {

        const riga =
            document.createElement("div");

        riga.className =
            "history-row";


        const numero =
            document.createElement("span");

        numero.className =
            "history-turn";

        numero.textContent =
            `Turno ${turno.turno}`;


        const risultato =
            document.createElement("span");

        risultato.className =
            "history-result";

        risultato.textContent =
            `${turno.nome} +${turno.punti}`;


        riga.appendChild(numero);
        riga.appendChild(risultato);

        container.appendChild(riga);
    });
}


/* =========================================================
   STORICO COMPLETO
   ========================================================== */

function mostraStoricoCompleto() {

    const container =
        elemento("storico-completo-lista");

    container.innerHTML = "";


    if (!storico.length) {

        container.innerHTML = `
            <div class="history-empty">
                Nessun turno ancora registrato
            </div>
        `;

        mostraPagina("storico-completo");

        return;
    }


    [...storico].reverse().forEach(turno => {

        const riga =
            document.createElement("div");

        riga.className =
            "history-row";


        const numero =
            document.createElement("span");

        numero.className =
            "history-turn";

        numero.textContent =
            `Turno ${turno.turno}`;


        const risultato =
            document.createElement("span");

        risultato.className =
            "history-result";

        risultato.textContent =
            `${turno.nome} +${turno.punti}`;


        riga.appendChild(numero);
        riga.appendChild(risultato);

        container.appendChild(riga);
    });


    mostraPagina("storico-completo");
}


/* =========================================================
   CHIUDI STORICO
   ========================================================== */

function chiudiStorico() {

    mostraPagina("partita");
}


/* =========================================================
   ANNULLA ULTIMO TURNO
   ========================================================== */

function annullaUltimoTurno() {

    if (!storico.length) {

        alert("Non ci sono turni da annullare.");

        return;
    }


    storico.pop();


    ricalcolaPartita();

    aggiornaSchermataPartita();

    salvaPartita();
}


/* =========================================================
   RICALCOLA PARTITA
   ========================================================== */

function ricalcolaPartita() {

    punteggi =
        giocatori.map(() => 0);

    puntiGame =
        giocatori.map(() => 0);

    gameVinti =
        giocatori.map(() => 0);

    setVinti =
        giocatori.map(() => 0);

    storicoGame = [];
    storicoSet = [];


    storico.forEach(turno => {

        if (
            turno.giocatore < 0 ||
            turno.giocatore >= giocatori.length
        ) {
            return;
        }


        punteggi[turno.giocatore] +=
            turno.punti;


        if (sistemaPunteggio === "game-set") {

            puntiGame[turno.giocatore] +=
                turno.punti;


            if (
                puntiGame[turno.giocatore] >=
                puntiPerGame
            ) {

                gameVinti[turno.giocatore]++;


                storicoGame.push({
                    vincitore: turno.giocatore,
                    nome: giocatori[turno.giocatore],
                    punti:
                        puntiGame[turno.giocatore]
                });


                puntiGame[turno.giocatore] = 0;


                if (
                    gameVinti[turno.giocatore] >=
                    gamePerSet
                ) {

                    setVinti[turno.giocatore]++;


                    storicoSet.push({
                        vincitore: turno.giocatore,
                        nome: giocatori[turno.giocatore],
                        game: [...gameVinti]
                    });


                    gameVinti =
                        giocatori.map(() => 0);

                    puntiGame =
                        giocatori.map(() => 0);
                }
            }
        }
    });


    numeroTurno =
        storico.length;
}


/* =========================================================
   SALVATAGGIO
   ========================================================== */

function salvaPartita() {

    if (!giocatori.length) {
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

        storicoGame,

        storicoSet
    };


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dati)
    );


    aggiornaPartitaSalvata();
}


/* =========================================================
   CONTROLLA PARTITA SALVATA
   ========================================================== */

function aggiornaPartitaSalvata() {

    const container =
        elemento("partita-in-corso");

    if (!container) return;


    const salvata =
        localStorage.getItem(STORAGE_KEY);


    if (!salvata) {

        container.classList.add("hidden");

        return;
    }


    try {

        const dati =
            JSON.parse(salvata);


        if (
            !dati ||
            !Array.isArray(dati.giocatori) ||
            dati.giocatori.length < 2
        ) {

            container.classList.add("hidden");

            return;
        }


        container.classList.remove("hidden");


        elemento("partita-salvata-titolo")
            .textContent =
            dati.giocoScelto || "Partita";


        elemento("partita-salvata-info")
            .textContent =
            `${dati.giocatori.length} giocatori • Turno ${dati.numeroTurno || 0}`;

    } catch (errore) {

        console.error(
            "Errore lettura partita salvata:",
            errore
        );

        container.classList.add("hidden");
    }
}


/* =========================================================
   CONTINUA PARTITA
   ========================================================== */

function continuaPartita() {

    const salvata =
        localStorage.getItem(STORAGE_KEY);


    if (!salvata) {

        alert("Non è presente una partita salvata.");

        return;
    }


    try {

        const dati =
            JSON.parse(salvata);


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
            Number.isFinite(dati.numeroTurno)
            ? dati.numeroTurno
            : storico.length;


        sistemaPunteggio =
            dati.sistemaPunteggio || "semplice";


        obiettivoPartita =
            dati.obiettivoPartita || 500;


        puntiPerGame =
            dati.puntiPerGame || 21;


        gamePerSet =
            dati.gamePerSet || 3;


        setPerMatch =
            dati.setPerMatch || 2;


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


        storicoGame =
            Array.isArray(dati.storicoGame)
            ? dati.storicoGame
            : [];


        storicoSet =
            Array.isArray(dati.storicoSet)
            ? dati.storicoSet
            : [];


        elemento("sistema-punteggio").value =
            sistemaPunteggio;


        elemento("obiettivo-partita").value =
            obiettivoPartita;


        elemento("punti-per-game").value =
            puntiPerGame;


        elemento("game-per-set").value =
            gamePerSet;


        elemento("set-per-match").value =
            setPerMatch;


        mostraPagina("partita");

        cambiaSistemaPunteggio();

        aggiornaSchermataPartita();


    } catch (errore) {

        console.error(
            "Errore caricamento partita:",
            errore
        );

        alert(
            "Non è stato possibile recuperare la partita."
        );
    }
}


/* =========================================================
   ESCI DALLA PARTITA
   ========================================================== */

function esciPartita() {

    salvaPartita();

    mostraPagina("home");
}


/* =========================================================
   RECAP PARTITA
   ========================================================== */

function mostraRecapPartita(indiceVincitore) {

    const precedente =
        document.querySelector(".recap-overlay");

    if (precedente) {
        precedente.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "recap-overlay";


    const card =
        document.createElement("div");

    card.className =
        "recap-card";


    const vincitore =
        giocatori[indiceVincitore] || "Vincitore";


    let html = `
        <div class="recap-top">

            <div class="recap-trophy">
                🏆
            </div>

            <span>
                PARTITA VINTA!
            </span>

            <h2>
                ${escapeHTML(vincitore)}
            </h2>

            <p class="recap-winner">
                Complimenti!
            </p>

        </div>
    `;


    // ---------------------------------------------
    // PUNTEGGIO FINALE
    // ---------------------------------------------

    html += `
        <div class="recap-score">
    `;


    giocatori.forEach((nome, indice) => {

        html += `
            <div class="recap-score-player">

                <strong>
                    ${escapeHTML(nome)}
                </strong>

                <span>
                    ${punteggi[indice]}
                </span>

            </div>
        `;

        if (indice < giocatori.length - 1) {

            html += `
                <div class="recap-score-separator">
                    •
                </div>
            `;
        }
    });


    html += `
        </div>
    `;


    // ---------------------------------------------
    // INFORMAZIONI
    // ---------------------------------------------

    html += `
        <div class="recap-info">

            <div class="recap-info-item">

                <span>
                    TURNI
                </span>

                <strong>
                    ${numeroTurno}
                </strong>

            </div>

            <div class="recap-info-item">

                <span>
                    GIOCHI
                </span>

                <strong>
                    ${sistemaPunteggio === "game-set"
                        ? gameVinti[indiceVincitore] || 0
                        : "—"
                    }
                </strong>

            </div>

            <div class="recap-info-item">

                <span>
                    SET
                </span>

                <strong>
                    ${sistemaPunteggio === "game-set"
                        ? setVinti[indiceVincitore] || 0
                        : "—"
                    }
                </strong>

            </div>

        </div>
    `;


    // ---------------------------------------------
    // SET
    // ---------------------------------------------

    if (
        sistemaPunteggio === "game-set" &&
        storicoSet.length
    ) {

        html += `
            <div class="recap-sets">

                <div class="recap-sets-title">
                    RISULTATO DEI SET
                </div>
        `;


        storicoSet.forEach((set, indiceSet) => {

            const risultati =
                Array.isArray(set.game)
                    ? set.game
                    : [];


            html += `
                <div class="recap-set">

                    <span class="recap-set-name">
                        Set ${indiceSet + 1}
                    </span>

                    <span class="recap-set-score">
                        ${risultati.join(" - ")}
                    </span>

                </div>
            `;
        });


        html += `
            </div>
        `;
    }


    // ---------------------------------------------
    // BOTTONI
    // ---------------------------------------------

    html += `
        <div class="recap-buttons">

            <button
                class="primary-button"
                type="button"
                id="recap-home"
            >
                Torna alla home
            </button>

            <button
                class="secondary-button"
                type="button"
                id="recap-new"
            >
                Nuova partita
            </button>

        </div>
    `;


    card.innerHTML = html;

    overlay.appendChild(card);

    document.body.appendChild(overlay);


    elemento("recap-home")
        .addEventListener("click", () => {

            overlay.remove();

            localStorage.removeItem(STORAGE_KEY);

            nuovaPartita();

            mostraPagina("home");

        });


    elemento("recap-new")
        .addEventListener("click", () => {

            overlay.remove();

            localStorage.removeItem(STORAGE_KEY);

            nuovaPartita();

        });
}


/* =========================================================
   CONFETTI
   ========================================================== */

function lanciaConfetti() {

    const canvas =
        document.createElement("canvas");

    canvas.className =
        "confetti-canvas";

    document.body.appendChild(canvas);


    const ctx =
        canvas.getContext("2d");


    canvas.width =
        window.innerWidth *
        window.devicePixelRatio;

    canvas.height =
        window.innerHeight *
        window.devicePixelRatio;

    ctx.scale(
        window.devicePixelRatio,
        window.devicePixelRatio
    );


    const larghezza =
        window.innerWidth;

    const altezza =
        window.innerHeight;


    const pezzi = [];


    const simboli = [
        "#1f6043",
        "#f9dfa0",
        "#d1ebf3",
        "#e7d9ee",
        "#ffffff"
    ];


    for (let i = 0; i < 100; i++) {

        pezzi.push({

            x: Math.random() * larghezza,

            y:
                -20 -
                Math.random() * altezza,

            width:
                5 +
                Math.random() * 6,

            height:
                7 +
                Math.random() * 10,

            speed:
                2 +
                Math.random() * 4,

            rotation:
                Math.random() * Math.PI * 2,

            rotationSpeed:
                -0.08 +
                Math.random() * 0.16,

            color:
                simboli[
                    Math.floor(
                        Math.random() *
                        simboli.length
                    )
                ]
        });
    }


    let frame = 0;


    function anima() {

        ctx.clearRect(
            0,
            0,
            larghezza,
            altezza
        );


        pezzi.forEach(pezzo => {

            pezzo.y += pezzo.speed;

            pezzo.rotation +=
                pezzo.rotationSpeed;


            ctx.save();


            ctx.translate(
                pezzo.x,
                pezzo.y
            );


            ctx.rotate(
                pezzo.rotation
            );


            ctx.fillStyle =
                pezzo.color;


            ctx.fillRect(
                -pezzo.width / 2,
                -pezzo.height / 2,
                pezzo.width,
                pezzo.height
            );


            ctx.restore();

        });


        frame++;


        if (
            frame < 180
        ) {

            requestAnimationFrame(
                anima
            );

        } else {

            canvas.remove();
        }
    }


    anima();
}


/* =========================================================
   ESCAPE HTML
   ========================================================== */

function escapeHTML(testo) {

    return String(testo)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   INIZIALIZZAZIONE
   ========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Due giocatori iniziali
        if (giocatori.length === 0) {

            giocatori = [
                "",
                ""
            ];
        }


        aggiornaListaGiocatori();

        cambiaSistemaPunteggio();

        aggiornaPartitaSalvata();


        // Pulsante aggiungi giocatore
        const aggiungi =
            elemento("aggiungi-giocatore");

        if (aggiungi) {

            aggiungi.addEventListener(
                "click",
                aggiungiGiocatore
            );
        }


        // Tasto invio nell'inserimento punti
        const puntiInput =
            elemento("punti-mano");

        if (puntiInput) {

            puntiInput.addEventListener(
                "keydown",
                function (evento) {

                    if (
                        evento.key === "Enter"
                    ) {

                        aggiungiMano();
                    }
                }
            );
        }


        // Mantiene aggiornata la partita salvata
        window.addEventListener(
            "pageshow",
            aggiornaPartitaSalvata
        );
    }
);