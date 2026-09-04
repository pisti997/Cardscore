/* =========================================================
   CARDSCORE - SCRIPT COMPLETO
========================================================= */

let giocoScelto = "";
let giocatori = [];
let punteggi = [];
let storico = [];
let numeroTurno = 0;

let sistemaPunteggio = "game-set";
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
let partitaTerminata = false;
let popupPunteggioAttuale = {
    overlay: null,
    popup: null,
    input: null
};

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

    chiudiPopupPuntiPersonalizzati();

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

    sistemaPunteggio = "game-set";
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
    partitaTerminata = false;

    const gioco = elemento("gioco-selezionato");
    const sistema = elemento("sistema-punteggio");
    const obiettivo = elemento("obiettivo-partita");
    const punti = elemento("punti-per-game");
    const games = elemento("game-per-set");
    const sets = elemento("set-per-match");

    if (gioco) gioco.textContent = "—";

    const iconaGioco = elemento("selected-game-icon");
    if (iconaGioco) iconaGioco.textContent = "🃏";

    if (sistema) sistema.value = "game-set";
    if (obiettivo) obiettivo.value = 500;
    if (punti) punti.value = 21;
    if (games) games.value = 3;
    if (sets) sets.value = 2;

    aggiornaListaGiocatori();
    cambiaSistemaPunteggio();

    mostraPagina("nuova-partita");
}


/* =========================================================
   SCELTA GIOCO / LOGHI DEI GIOCHI
========================================================= */

const LOGHI_GIOCHI = {
    "UNO": "immagini/uno.png",
    "Pili Pili": "immagini/pili-pili.png",
    "Scala 40": "immagini/scala40.png",
    "Scopa": "immagini/scopa.png"
};


function scegliGioco(gioco) {

    nuovaPartita();

    giocoScelto = gioco;

    const elementoGioco = elemento("gioco-selezionato");

    if (elementoGioco) {
        elementoGioco.textContent = gioco;
    }


    const iconaGioco = elemento("selected-game-icon");

    if (iconaGioco) {

        const logo = LOGHI_GIOCHI[gioco];

        if (logo) {

            iconaGioco.innerHTML =
                `<img src="${escapeHTML(logo)}" alt="${escapeHTML(gioco)}">`;

        } else {

            /* Nessun logo disponibile: torniamo all'emoji di riserva */

            iconaGioco.textContent = "🃏";
        }
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

    /*
       Il focus va chiamato SUBITO, in modo sincrono, dentro
       al gestore del click che ha originato l'azione: solo
       cosi' Safari considera l'apertura della tastiera un
       gesto genuino dell'utente e la mostra davvero. Un
       setTimeout, anche breve, spezza questa catena.
    */

    const inputs =
        document.querySelectorAll(".player-input");

    if (inputs.length) {
        inputs[inputs.length - 1].focus({ preventScroll: true });
    }
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
    partitaTerminata = false;


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
            puntiGame[indice];


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


        /* =============================================
           TAP BREVE = +1 PUNTO
           PRESSIONE PROLUNGATA = PUNTEGGIO PERSONALIZZATO
        ============================================= */

        let timerPressione = null;
        let pressioneLunga = false;
        let pointerIdAttivo = null;

        const DURATA_PRESSIONE = 480;


        const avviaPressione = function (evento) {

            if (partitaTerminata) return;

            /* Evita di aprire un secondo popup se uno e' gia' attivo */
            if (document.querySelector(".custom-score-popup")) {
                return;
            }

            pressioneLunga = false;
            pointerIdAttivo = evento.pointerId;

            /*
               setPointerCapture "aggancia" tutti i prossimi eventi
               di questo tocco al bottone, anche se il popup compare
               sopra e coprirebbe altrimenti il dito. Senza questo,
               su Safari il "rilascio del dito" finiva sull'overlay
               invece che sul bottone, e la tastiera non si apriva
               in modo affidabile.
            */

            try {
                button.setPointerCapture(evento.pointerId);
            } catch (errore) {
                /* Non tutti i browser supportano la pointer capture */
            }

            clearTimeout(timerPressione);

            timerPressione = setTimeout(
                () => {

                    pressioneLunga = true;

                    if (navigator.vibrate) {
                        navigator.vibrate(15);
                    }

                    apriPopupPuntiPersonalizzati(indice);

                },
                DURATA_PRESSIONE
            );
        };


        const annullaPressione = function (evento) {

            clearTimeout(timerPressione);

            if (
                pointerIdAttivo !== null &&
                button.releasePointerCapture &&
                button.hasPointerCapture &&
                button.hasPointerCapture(pointerIdAttivo)
            ) {
                try {
                    button.releasePointerCapture(pointerIdAttivo);
                } catch (errore) {
                    /* Ignora se gia' rilasciato */
                }
            }

            /*
               Il rilascio del dito (pointerup) e' un gesto utente
               "genuino" agli occhi di Safari: se il popup e' gia'
               aperto, richiamiamo di nuovo il focus proprio qui,
               in modo sincrono, cosi' la tastiera numerica si apre.
            */

            if (
                pressioneLunga &&
                evento &&
                evento.type === "pointerup"
            ) {
                riattivaFocusPopupPersonalizzato();
            }

            pointerIdAttivo = null;
        };


        button.addEventListener(
            "pointerdown",
            avviaPressione
        );

        button.addEventListener(
            "pointerup",
            annullaPressione
        );

        button.addEventListener(
            "pointerleave",
            annullaPressione
        );

        button.addEventListener(
            "pointercancel",
            annullaPressione
        );

        button.addEventListener(
            "contextmenu",
            function (evento) {
                evento.preventDefault();
            }
        );


        button.addEventListener(
            "click",
            function (evento) {

                /*
                   Se e' scattata la pressione prolungata,
                   il tap normale (+1) va ignorato: il popup
                   personalizzato se ne occupa gia'.
                */

                if (pressioneLunga) {

                    evento.preventDefault();

                    pressioneLunga = false;

                    return;
                }


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
   POPUP PUNTEGGIO PERSONALIZZATO (pressione prolungata)
========================================================= */

function apriPopupPuntiPersonalizzati(indice) {

    if (partitaTerminata) return;

    if (
        !Number.isInteger(indice) ||
        indice < 0 ||
        indice >= giocatori.length
    ) {
        return;
    }


    chiudiPopupPuntiPersonalizzati();


    const overlay =
        document.createElement("div");

    overlay.className =
        "cardscore-overlay custom-score-overlay";

    overlay.addEventListener(
        "click",
        chiudiPopupPuntiPersonalizzati
    );


    const popup =
        document.createElement("div");

    popup.className =
        "custom-score-popup";

    /*
       Evitiamo che il click dentro al popup
       chiuda il popup stesso.
    */

    popup.addEventListener(
        "click",
        evento => evento.stopPropagation()
    );


    popup.innerHTML = `

        <div class="custom-score-label">
            PUNTEGGIO PERSONALIZZATO
        </div>

        <h2 class="custom-score-name">
            ${escapeHTML(giocatori[indice])}
        </h2>

        <div class="custom-score-field">

            <button
                type="button"
                class="custom-score-step"
                data-step="-1"
            >
                −
            </button>

            <input
                id="custom-score-input"
                type="number"
                inputmode="numeric"
                min="1"
                step="1"
                value="1"
                autofocus
            >

            <button
                type="button"
                class="custom-score-step"
                data-step="1"
            >
                +
            </button>

        </div>

        <div class="custom-score-actions">

            <button
                type="button"
                class="custom-score-cancel"
            >
                Annulla
            </button>

            <button
                type="button"
                class="custom-score-confirm"
            >
                Aggiungi punti
            </button>

        </div>
    `;


    document.body.appendChild(overlay);
    document.body.appendChild(popup);


    const input =
        popup.querySelector("#custom-score-input");

    popupPunteggioAttuale = {
        overlay: overlay,
        popup: popup,
        input: input
    };

    if (input) {

        /*
           Su mobile il focus subito dopo l'inserimento nel DOM
           a volte non basta a far apparire la tastiera: lo
           richiamiamo anche dopo il rendering del frame
           successivo, cosi' la tastiera numerica si apre
           in automatico in modo affidabile.
        */

       const apriTastiera = function () {
    input.focus({ preventScroll: true });
    input.select();

    // Sposta il popup verso l'alto quando viene aperta la tastiera
    if (popup) {
        popup.style.top = "35%";
    }
};

        apriTastiera();

        requestAnimationFrame(apriTastiera);

        setTimeout(apriTastiera, 120);


        input.addEventListener(
            "keydown",
            function (evento) {

                if (evento.key === "Enter") {
                    confermaPuntiPersonalizzati(indice);
                }

                if (evento.key === "Escape") {
                    chiudiPopupPuntiPersonalizzati();
                }
            }
        );
    }


    popup
        .querySelectorAll(".custom-score-step")
        .forEach(bottone => {

            bottone.addEventListener(
                "click",
                function () {

                    const passo =
                        parseInt(
                            bottone.dataset.step,
                            10
                        );

                    const valoreAttuale =
                        parseInt(input.value, 10) || 0;

                    const nuovoValore =
                        Math.max(
                            1,
                            valoreAttuale + passo
                        );

                    input.value = nuovoValore;
                }
            );
        });


    popup
        .querySelector(".custom-score-cancel")
        .addEventListener(
            "click",
            chiudiPopupPuntiPersonalizzati
        );

    popup
        .querySelector(".custom-score-confirm")
        .addEventListener(
            "click",
            () => confermaPuntiPersonalizzati(indice)
        );
}


function riattivaFocusPopupPersonalizzato() {

    const input = popupPunteggioAttuale.input;

    if (!input) return;

    input.focus({ preventScroll: true });
    input.select();
}


function confermaPuntiPersonalizzati(indice) {

    const input = popupPunteggioAttuale.input;

    const valore =
        parseInt(
            input ? input.value : "",
            10
        );

    if (
        !Number.isFinite(valore) ||
        valore <= 0
    ) {

        alert("Inserisci un numero di punti valido.");

        return;
    }


    const select =
        elemento("giocatore-vincitore");

    const puntiMano =
        elemento("punti-mano");

    if (select) {
        select.value = indice;
    }

    if (puntiMano) {
        puntiMano.value = valore;
    }


    chiudiPopupPuntiPersonalizzati();

    aggiungiMano();
}


function chiudiPopupPuntiPersonalizzati() {

    /*
       Rimuoviamo TUTTI gli elementi corrispondenti, non solo il
       primo: se per qualche motivo (es. gesture particolari su
       Safari) fosse rimasto un popup "fantasma" dei tentativi
       precedenti, non deve mai restare nel DOM ne' interferire
       con il popup corrente.
    */

    document
        .querySelectorAll(".custom-score-overlay")
        .forEach(nodo => nodo.remove());

    document
        .querySelectorAll(".custom-score-popup")
        .forEach(nodo => nodo.remove());

    popupPunteggioAttuale = {
        overlay: null,
        popup: null,
        input: null
    };
}


/* =========================================================
   AGGIUNGI TURNO
========================================================= */

function aggiungiMano() {

    if (partitaTerminata) {
        return;
    }

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

    if (!partitaTerminata) {
        salvaPartita();
    }
}


/* =========================================================
   VITTORIA DI UN GAME (logica condivisa)
   Usata sia durante il gioco live (controllaGame) sia nel
   ricalcolo dello storico (ricalcolaPartita), cosi' che un
   'game vinto' si comporti sempre allo stesso identico modo.
========================================================= */

function elaboraVittoriaGame(indice, conMessaggi) {

    gameVinti[indice] =
        Number(gameVinti[indice] || 0) + 1;


    /*
       Quando si vince il Game, i punti del Game ripartono
       SEMPRE da zero per tutti, vincitore compreso: eventuali
       punti in eccesso rispetto al limite (es. limite 21,
       arrivati a 24) non si portano dietro nel Game successivo.
    */

    puntiGame =
        giocatori.map(() => 0);


    storicoGame.push({

        vincitore: indice,

        nome: giocatori[indice],

        punti: puntiPerGame,

        game: [...gameVinti],

        set: [...setVinti]
    });


    if (conMessaggi) {

        mostraMessaggioPartita(
            "game",
            `${giocatori[indice]} vince il Game!`
        );
    }


    let setVinto = false;
    let matchVinto = false;


    if (gameVinti[indice] >= gamePerSet) {

        setVinti[indice] =
            Number(setVinti[indice] || 0) + 1;

        setVinto = true;


        storicoSet.push({

            vincitore: indice,

            nome: giocatori[indice],

            game: [...gameVinti],

            set: [...setVinti]
        });


        if (conMessaggi) {

            mostraMessaggioPartita(
                "set",
                `${giocatori[indice]} vince il Set!`
            );
        }


        if (setVinti[indice] >= setPerMatch) {

            matchVinto = true;

        } else {

            /* NUOVO SET: azzeriamo Game per tutti */

            gameVinti =
                giocatori.map(() => 0);

            puntiGame =
                giocatori.map(() => 0);
        }
    }


    return { setVinto, matchVinto };
}


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
       Un solo Game per volta: quando si raggiunge il limite,
       il Game viene assegnato e i punti ripartono da zero per
       tutti (vincitore compreso). Eventuali punti in eccesso
       rispetto al limite vengono semplicemente scartati, non
       si portano dietro nel Game successivo.
    */

    if (
        puntiGame[indice] >= limiteGame
    ) {

        const risultato =
            elaboraVittoriaGame(indice, true);


        if (risultato.matchVinto) {

            terminaMatch(indice);

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

    partitaTerminata = true;

    matchVinti =
        giocatori.map(() => 0);

    matchVinti[indiceVincitore] = 1;


    localStorage.removeItem(
        STORAGE_KEY
    );


    mostraMessaggioPartita(
        "match",
        `${giocatori[indiceVincitore]} vince il Match!`
    );

    lanciaConfetti();


    setTimeout(
        () => {

            /*
               Puliamo l'eventuale popup MATCH ancora a schermo
               prima di mostrare il recap finale, cosi' non
               restano elementi residui dietro alla schermata
               di vittoria.
            */

            if (messaggioTimeout) {
                clearTimeout(messaggioTimeout);
            }

            document
                .querySelectorAll(".match-message, .cardscore-overlay")
                .forEach(nodo => nodo.remove());


            mostraSchermataVittoria(
                indiceVincitore
            );

        },
        4000
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


    let etichetta = "PARTITA";
    let icona = "🎉";

    let sottotesto =
        "Continua a giocare!";


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
        sottotesto = "Ecco il riepilogo finale...";
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
            ${escapeHTML(sottotesto)}
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
            tipo === "match"
                ? 4000
                : 3000
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


    /*
       Ricordiamo il gioco appena concluso PRIMA che
       nuovaPartita() lo azzeri, per poterlo riselezionare
       automaticamente subito dopo.
    */

    const giocoPrecedente = giocoScelto;


    nuovaPartita();


    if (giocoPrecedente) {

        giocoScelto = giocoPrecedente;

        const elementoGioco =
            elemento("gioco-selezionato");

        if (elementoGioco) {
            elementoGioco.textContent = giocoPrecedente;
        }


        const iconaGioco =
            elemento("selected-game-icon");

        if (iconaGioco) {

            const logo =
                LOGHI_GIOCHI[giocoPrecedente];

            if (logo) {

                iconaGioco.innerHTML =
                    `<img src="${escapeHTML(logo)}" alt="${escapeHTML(giocoPrecedente)}">`;

            } else {

                iconaGioco.textContent = "🃏";
            }
        }
    }
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
        .slice(-1)
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


        if (
            puntiGame[indice] >= puntiPerGame
        ) {

            const risultato =
                elaboraVittoriaGame(indice, false);


            if (risultato.matchVinto) {

                matchVinti =
                    giocatori.map(() => 0);

                matchVinti[indice] = 1;

                return;
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


function aggiornaPartitaSalvata() {

    const card =
        elemento("partita-in-corso");

    const titolo =
        elemento("partita-salvata-titolo");

    const info =
        elemento("partita-salvata-info");

    const top =
        card?.querySelector(".saved-game-top");

    const icona =
        card?.querySelector(".saved-game-icon");

    const label =
        card?.querySelector(".saved-label");

    const bottone =
        elemento("continua-partita-btn");


    if (!card) return;


    let dati = null;

    try {

        const salvata =
            localStorage.getItem(STORAGE_KEY);

        if (salvata) {
            dati = JSON.parse(salvata);
        }

    } catch (errore) {

        console.error(
            "Errore lettura partita:",
            errore
        );
    }


    /* =====================================================
       NESSUNA PARTITA
       ===================================================== */

    if (
        !dati ||
        !Array.isArray(dati.giocatori) ||
        !dati.giocatori.length
    ) {

        card.classList.remove("hidden");
        card.classList.add("empty-state");


        if (top) {
            top.style.display = "none";
        }


        if (info) {

            info.textContent =
                "Nessuna partita in corso";

            info.style.display = "block";
        }


        if (bottone) {
            bottone.style.display = "none";
        }


        return;
    }


    /* =====================================================
       PARTITA PRESENTE
       ===================================================== */

    card.classList.remove("hidden");
    card.classList.remove("empty-state");


    if (top) {
        top.style.display = "";
    }


    if (icona) {
        icona.style.display = "";
    }


    if (bottone) {
        bottone.style.display = "";
    }


    if (label) {
        label.textContent =
            "PARTITA IN CORSO";
    }


    if (titolo) {

        titolo.textContent =
            dati.giocoScelto ||
            "Partita";
    }


    /* =====================================================
       LOGO
       ===================================================== */

    if (icona) {

        const immaginiGiochi = {

            "UNO":
                "immagini/uno.png",

            "Pili Pili":
                "immagini/pili-pili.png",

            "Scala 40":
                "immagini/scala40.png",

            "Scopa":
                "immagini/scopa.png"
        };


        const immagine =
            immaginiGiochi[dati.giocoScelto];


        if (immagine) {

            icona.innerHTML = `
                <img
                    src="${immagine}"
                    alt="${dati.giocoScelto || "Gioco"}"
                >
            `;
        }
    }


    /* =====================================================
       SITUAZIONE REALE DELLA PARTITA
       ===================================================== */

    if (info) {

        const giocatori =
            dati.giocatori || [];


        const puntiGame =
            Array.isArray(dati.puntiGame)
                ? dati.puntiGame
                : giocatori.map(() => 0);


        const gameVinti =
            Array.isArray(dati.gameVinti)
                ? dati.gameVinti
                : giocatori.map(() => 0);


        const setVinti =
            Array.isArray(dati.setVinti)
                ? dati.setVinti
                : giocatori.map(() => 0);


        info.innerHTML =
            giocatori
                .map((nome, indice) => {

                    const punti =
                        Number(
                            puntiGame[indice]
                        ) || 0;


                    const games =
                        Number(
                            gameVinti[indice]
                        ) || 0;


                    const sets =
                        Number(
                            setVinti[indice]
                        ) || 0;


                    return `
                        <div class="saved-player-score">

                            <span>
                                ${nome}
                            </span>

                            <strong>
                                Game ${games} ·
                                Set ${sets} ·
                                ${punti} punti
                            </strong>

                        </div>
                    `;

                })
                .join("");
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

    partitaTerminata = false;


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
/* =========================================================
   EFFETTO PRESSIONE 3D UNIVERSALE
   ========================================================= */

document.addEventListener("pointerdown", function (evento) {

    const bottone = evento.target.closest("button");

    if (!bottone || bottone.disabled) {
        return;
    }

    bottone.classList.add("is-pressed");
});


function rimuoviPressione3D(evento) {

    const bottone = evento.target.closest("button");

    if (bottone) {
        bottone.classList.remove("is-pressed");
    }
}


document.addEventListener(
    "pointerup",
    rimuoviPressione3D
);

document.addEventListener(
    "pointercancel",
    rimuoviPressione3D
);

window.addEventListener(
    "blur",
    function () {

        document
            .querySelectorAll("button.is-pressed")
            .forEach(function (bottone) {

                bottone.classList.remove("is-pressed");

            });
    }
);


/* =========================================================
   PWA - REGISTRAZIONE SERVICE WORKER
   Permette all'app di funzionare offline e di essere
   installata sulla schermata Home come app standalone.
========================================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker
            .register("sw.js")
            .catch(function () {
                // Se la registrazione fallisce l'app continua
                // a funzionare normalmente, solo senza offline.
            });
    });
}