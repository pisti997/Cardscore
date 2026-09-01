/* ========================================================
   CARDSCORE - script.js
   Versione corretta e riorganizzata
======================================================== */

/* ----------------------------
   STATO GLOBALE
---------------------------- */

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
let storicoGame = [];
let storicoSet = [];

// true quando la partita è stata vinta: blocca l'inserimento di nuovi turni
let partitaFinita = false;

// Stato animazioni (vengono "consumate" da applicaAnimazioni)
let animazionePunteggio = null;
let animazioneGame = null;
let animazioneSet = null;
let animazioneMatch = null;

let precedenteLeader = null;
let messaggioTimeout = null;


/* ========================================================
   AVVIO
======================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sistema = document.getElementById("sistema-punteggio");
    if (sistema) sistema.addEventListener("change", cambiaSistemaPunteggio);

    const obiettivo = document.getElementById("obiettivo");
    if (obiettivo) obiettivo.addEventListener("change", controllaObiettivo);

    // Invio per aggiungere più velocemente giocatori e punti
    const nomeGiocatore = document.getElementById("nome-giocatore");
    if (nomeGiocatore) {
        nomeGiocatore.addEventListener("keypress", function (evento) {
            if (evento.key === "Enter") {
                evento.preventDefault();
                aggiungiGiocatore();
            }
        });
    }

    const inputPunti = document.getElementById("punti");
    if (inputPunti) {
        inputPunti.addEventListener("keypress", function (evento) {
            if (evento.key === "Enter") {
                evento.preventDefault();
                aggiungiMano();
            }
        });
    }

    aggiornaPartitaSalvata();
});


/* ========================================================
   MESSAGGIO A COMPARSA (game / set / match)
======================================================== */

function mostraMessaggioPartita(tipo, giocatore) {

    let messaggio = document.getElementById("messaggio-partita");

    if (!messaggio) {
        messaggio = document.createElement("div");
        messaggio.id = "messaggio-partita";
        messaggio.setAttribute("role", "status");
        messaggio.setAttribute("aria-live", "polite");

        const contenitore = document.getElementById("partita") || document.body;
        contenitore.appendChild(messaggio);
    }

    const testi = {
        game: "🎖️GAME!🎖️",
        set: "🥇SET!🥇",
        match: "🏆PARTITA VINTA!🏆"
    };

    const descrizione = tipo === "match" ? " ha vinto la partita" : " ha vinto il " + tipo;

    messaggio.innerHTML =
        "<strong>" + testi[tipo] + "</strong>" +
        "<span>" + giocatore + descrizione + "</span>";

    // Riavvia l'animazione anche se il messaggio è già visibile
    messaggio.classList.remove("visibile");
    void messaggio.offsetWidth;
    messaggio.classList.add("visibile");

    if (messaggioTimeout) clearTimeout(messaggioTimeout);

    messaggioTimeout = setTimeout(function () {
        messaggio.classList.remove("visibile");

        if (tipo === "match") {
            mostraRecapPartita(giocatore);
        }
    }, 5000);
}


/* ========================================================
   BLOCCO / SBLOCCO INPUT A FINE PARTITA
======================================================== */

function bloccaInputPartita() {
    partitaFinita = true;

    const bottone = document.querySelector(".turno-card .primary-button");
    const input = document.getElementById("punti");
    const selettore = document.getElementById("giocatore-vincitore");

    if (bottone) bottone.disabled = true;
    if (input) input.disabled = true;
    if (selettore) selettore.disabled = true;
}

function riabilitaInput() {
    partitaFinita = false;

    const bottone = document.querySelector(".turno-card .primary-button");
    const input = document.getElementById("punti");
    const selettore = document.getElementById("giocatore-vincitore");

    if (bottone) bottone.disabled = false;
    if (input) input.disabled = false;
    if (selettore) selettore.disabled = false;
}


/* ========================================================
   SALVATAGGIO / RIPRISTINO PARTITA (localStorage)
======================================================== */

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
        setVinti: setVinti,
        storicoGame: storicoGame,
        storicoSet: storicoSet
    };

    localStorage.setItem("cardscore_partita", JSON.stringify(partita));
}

function aggiornaPartitaSalvata() {

    const dati = localStorage.getItem("cardscore_partita");
    const sezione = document.getElementById("partita-in-corso");
    const contenitore = document.getElementById("partita-salvata");

    if (!sezione || !contenitore) return;

    if (!dati) {
        sezione.style.display = "none";
        return;
    }

    try {
        const partita = JSON.parse(dati);

        if (!partita.giocatori || partita.giocatori.length < 2) {
            sezione.style.display = "none";
            return;
        }

        let html = "<strong>" + partita.gioco + "</strong><br><br>";
        html += "Turno " + partita.turno + "<br><br>";

        partita.giocatori.forEach(function (nome, indice) {
            html += nome + ": " + partita.punteggi[indice] + " punti<br>";
        });

        contenitore.innerHTML = html;
        sezione.style.display = "block";

    } catch (errore) {
        sezione.style.display = "none";
    }
}

function continuaPartita() {

    const dati = localStorage.getItem("cardscore_partita");

    if (!dati) {
        alert("Non c'è nessuna partita salvata.");
        return;
    }

    try {
        const partita = JSON.parse(dati);

        giocoScelto = partita.gioco;
        giocatori = partita.giocatori || [];
        punteggi = partita.punteggi || [];
        storico = partita.storico || [];
        numeroTurno = partita.turno || 1;
        sistemaPunteggio = partita.sistema || "semplice";
        obiettivoPartita = partita.obiettivo || 500;
        puntiPerGame = partita.puntiGame || 21;
        gamePerSet = partita.gameSet || 3;
        setPerMatch = partita.setMatch || 2;

        puntiGame = partita.puntiAttualiGame || new Array(giocatori.length).fill(0);
        gameVinti = partita.gameVinti || new Array(giocatori.length).fill(0);
        setVinti = partita.setVinti || new Array(giocatori.length).fill(0);
        storicoGame = partita.storicoGame || [];
        storicoSet = partita.storicoSet || [];

        document.getElementById("home").style.display = "none";
        document.getElementById("nuova-partita").style.display = "none";
        document.getElementById("partita").style.display = "block";

        riabilitaInput();
        aggiornaSchermataPartita();

    } catch (errore) {
        alert("Errore nel recupero della partita.");
    }
}


/* ========================================================
   NUOVA PARTITA / SCELTA GIOCO
======================================================== */

function resettaStatoPartita() {

    giocoScelto = "";
    giocatori = [];
    punteggi = [];
    storico = [];
    puntiGame = [];
    gameVinti = [];
    setVinti = [];
    storicoGame = [];
    storicoSet = [];

    numeroTurno = 1;
    precedenteLeader = null;

    animazionePunteggio = null;
    animazioneGame = null;
    animazioneSet = null;
    animazioneMatch = null;

    riabilitaInput();
}

function nuovaPartita() {

    const recap = document.getElementById("recap-partita");
    if (recap) recap.style.display = "none";

    localStorage.removeItem("cardscore_partita");

    resettaStatoPartita();

    sistemaPunteggio = "semplice";
    obiettivoPartita = 500;
    puntiPerGame = 21;
    gamePerSet = 3;
    setPerMatch = 2;

    document.getElementById("partita-in-corso").style.display = "none";
    document.getElementById("home").style.display = "none";
    document.getElementById("nuova-partita").style.display = "block";
    document.getElementById("partita").style.display = "none";

    document.getElementById("lista-giocatori").innerHTML = "";
    document.getElementById("nome-giocatore").value = "";
    document.getElementById("sistema-punteggio").value = "semplice";
    document.getElementById("impostazioni-game-set").style.display = "none";
    document.getElementById("impostazioni-semplici").style.display = "block";

    controllaObiettivo();
}

function scegliGioco(gioco) {

    resettaStatoPartita();

    giocoScelto = gioco;

    document.getElementById("home").style.display = "none";
    document.getElementById("nuova-partita").style.display = "block";
    document.getElementById("titolo-gioco").textContent = gioco;
    document.getElementById("lista-giocatori").innerHTML = "";
    document.getElementById("nome-giocatore").value = "";
}

function cambiaSistemaPunteggio() {

    const sistema = document.getElementById("sistema-punteggio").value;
    const impostazioni = document.getElementById("impostazioni-game-set");
    const semplici = document.getElementById("impostazioni-semplici");

    const usaGameSet = sistema === "game-set";

    impostazioni.style.display = usaGameSet ? "block" : "none";
    semplici.style.display = usaGameSet ? "none" : "block";
}

function controllaObiettivo() {

    const selettore = document.getElementById("obiettivo");
    const campo = document.getElementById("campo-personalizzato");

    if (!selettore || !campo) return;

    if (selettore.value === "personalizzato") {
        campo.style.display = "block";
        return;
    }

    campo.style.display = "none";

    const input = document.getElementById("obiettivo-personalizzato");
    if (input) input.value = "";
}


/* ========================================================
   GIOCATORI
======================================================== */

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

function mostraGiocatori() {

    const lista = document.getElementById("lista-giocatori");
    lista.innerHTML = "";

    giocatori.forEach(function (nome, indice) {
        const elemento = document.createElement("p");
        elemento.textContent = (indice + 1) + ". " + nome;
        lista.appendChild(elemento);
    });
}


/* ========================================================
   NAVIGAZIONE
======================================================== */

function tornaHome() {

    const recap = document.getElementById("recap-partita");
    if (recap) recap.style.display = "none";

    document.getElementById("home").style.display = "block";
    document.getElementById("nuova-partita").style.display = "none";
    document.getElementById("partita").style.display = "none";

    aggiornaPartitaSalvata();
}


/* ========================================================
   AVVIO PARTITA
======================================================== */

function valoriGameSetNonValidi() {
    return (
        !Number.isFinite(puntiPerGame) || puntiPerGame <= 0 ||
        !Number.isFinite(gamePerSet) || gamePerSet <= 0 ||
        !Number.isFinite(setPerMatch) || setPerMatch <= 0
    );
}

function iniziaPartita() {

    if (giocatori.length < 2) {
        alert("Servono almeno 2 giocatori!");
        return;
    }

    sistemaPunteggio = document.getElementById("sistema-punteggio").value;

    /* --- SEMPLICE --- */
    if (sistemaPunteggio === "semplice") {

        const selettore = document.getElementById("obiettivo");

        if (selettore.value === "personalizzato") {
            const valore = Number(document.getElementById("obiettivo-personalizzato").value);

            if (!valore || valore <= 0) {
                alert("Inserisci un obiettivo valido.");
                return;
            }

            obiettivoPartita = valore;
        } else {
            obiettivoPartita = Number(selettore.value);
        }
    }

    /* --- GAME / SET / MATCH --- */
    if (sistemaPunteggio === "game-set") {

        puntiPerGame = Number(document.getElementById("punti-game").value);
        gamePerSet = Number(document.getElementById("game-set").value);
        setPerMatch = Number(document.getElementById("set-match").value);

        if (valoriGameSetNonValidi()) {
            alert("Inserisci valori validi.");
            return;
        }
    }

    punteggi = new Array(giocatori.length).fill(0);
    puntiGame = new Array(giocatori.length).fill(0);
    gameVinti = new Array(giocatori.length).fill(0);
    setVinti = new Array(giocatori.length).fill(0);

    storico = [];
    storicoGame = [];
    storicoSet = [];

    numeroTurno = 1;
    precedenteLeader = null;

    riabilitaInput();

    document.getElementById("nuova-partita").style.display = "none";
    document.getElementById("partita").style.display = "block";

    aggiornaSchermataPartita();
    salvaPartita();
}


/* ========================================================
   AGGIORNAMENTO SCHERMATA PARTITA
======================================================== */

function aggiornaSchermataPartita() {

    const titolo = document.getElementById("titolo-partita");
    const turno = document.getElementById("numero-mano");

    if (titolo) titolo.textContent = giocoScelto;
    if (turno) turno.textContent = "Turno " + numeroTurno;

    creaSelettoreVincitore();

    const obiettivoDisplay = document.getElementById("obiettivo-display");

    if (sistemaPunteggio === "game-set") {

        document.getElementById("punteggio-game-set").style.display = "block";
        document.getElementById("punteggio-semplice").style.display = "none";

        if (obiettivoDisplay) {
            obiettivoDisplay.textContent =
                puntiPerGame + " punti = Game • " +
                gamePerSet + " Game = Set • " +
                setPerMatch + " Set = Match";
        }

        creaTabelloneGameSet();

    } else {

        document.getElementById("punteggio-game-set").style.display = "none";
        document.getElementById("punteggio-semplice").style.display = "block";

        if (obiettivoDisplay) {
            obiettivoDisplay.textContent = "🎯 Obiettivo: " + obiettivoPartita + " punti";
        }

        creaTabellone();
    }

    mostraStorico();
    applicaAnimazioni();
}

function creaSelettoreVincitore() {

    const selettore = document.getElementById("giocatore-vincitore");
    if (!selettore) return;

    selettore.innerHTML = "";

    giocatori.forEach(function (nome, indice) {
        const opzione = document.createElement("option");
        opzione.value = indice;
        opzione.textContent = nome;
        selettore.appendChild(opzione);
    });
}


/* ========================================================
   TABELLONE - PUNTEGGIO SEMPLICE
======================================================== */

function creaTabellone() {

    const tabellone = document.getElementById("tabellone");
    if (!tabellone) return;

    tabellone.innerHTML = "";

    giocatori.forEach(function (nome, indice) {
        const riga = document.createElement("div");
        riga.className = "score-row";
        riga.dataset.indice = indice;

        riga.innerHTML =
            "<strong>" + nome + "</strong>" +
            "<span>Totale: " + punteggi[indice] + "</span>";

        tabellone.appendChild(riga);
    });
}


/* ========================================================
   TABELLONE - GAME / SET / MATCH
======================================================== */

function confrontaGiocatori(a, b) {
    if (a.set !== b.set) return a.set > b.set ? 1 : -1;
    if (a.game !== b.game) return a.game > b.game ? 1 : -1;
    if (a.punti !== b.punti) return a.punti > b.punti ? 1 : -1;
    return 0;
}

function creaTabelloneGameSet() {

    const tabellone = document.getElementById("tabellone-game-set");
    if (!tabellone) return;

    tabellone.innerHTML = "";

    let migliore = null;

    /* --- trova il leader attuale --- */
    giocatori.forEach(function (nome, indice) {

        const valore = {
            set: setVinti[indice],
            game: gameVinti[indice],
            punti: puntiGame[indice]
        };

        if (migliore === null) {
            migliore = { indice: indice, valore: valore, pari: false };
            return;
        }

        const confronto = confrontaGiocatori(valore, migliore.valore);

        if (confronto > 0) {
            migliore = { indice: indice, valore: valore, pari: false };
        } else if (confronto === 0) {
            migliore.pari = true;
        }
    });

    /* --- animazione se il leader è cambiato --- */
    const nuovoLeader = migliore && !migliore.pari ? migliore.indice : null;

    if (
        precedenteLeader !== null &&
        nuovoLeader !== null &&
        precedenteLeader !== nuovoLeader
    ) {
        animazionePunteggio = { indice: nuovoLeader };
    }

    precedenteLeader = nuovoLeader;

    /* --- crea le righe --- */
    giocatori.forEach(function (nome, indice) {

        const riga = document.createElement("div");
        riga.className = "score-row match-row";
        riga.dataset.indice = indice;

        if (migliore !== null && !migliore.pari && migliore.indice === indice) {
            riga.classList.add("leader");
        }

        const nomeElemento = document.createElement("strong");
        nomeElemento.textContent = nome;

        const puntiElemento = document.createElement("span");
        puntiElemento.textContent = puntiGame[indice];

        const gameElemento = document.createElement("span");
        gameElemento.textContent = gameVinti[indice];

        const setElemento = document.createElement("span");
        setElemento.textContent = setVinti[indice];

        riga.appendChild(nomeElemento);
        riga.appendChild(puntiElemento);
        riga.appendChild(gameElemento);
        riga.appendChild(setElemento);

        tabellone.appendChild(riga);
    });

    const stato = document.getElementById("stato-match");
    if (stato) stato.textContent = "Turno " + numeroTurno;
}


/* ========================================================
   NUOVO TURNO
======================================================== */

function aggiungiMano() {

    if (partitaFinita) {
        alert("La partita è già conclusa. Premi \"Nuova partita\" per ricominciare.");
        return;
    }

    const selettore = document.getElementById("giocatore-vincitore");
    const input = document.getElementById("punti");
    const indice = Number(selettore.value);

    if (input.value === "") {
        alert("Inserisci il punteggio.");
        return;
    }

    const punti = Number(input.value);

    if (!Number.isFinite(punti) || punti < 0) {
        alert("Inserisci un punteggio valido.");
        return;
    }

    if (sistemaPunteggio === "semplice") {

        punteggi[indice] += punti;

        storico.push({ numero: numeroTurno, vincitore: indice, punti: punti });

        animazionePunteggio = { indice: indice };

        controllaVittoria();

    } else {

        puntiGame[indice] += punti;
        punteggi[indice] += punti;

        storico.push({ numero: numeroTurno, vincitore: indice, punti: punti });

        animazionePunteggio = { indice: indice };

        controllaGame(indice);
    }

    numeroTurno++;

    input.value = "";
    selettore.selectedIndex = 0;

    aggiornaSchermataPartita();
    salvaPartita();
}


/* ========================================================
   AVANZAMENTO GAME / SET / MATCH
   (usata sia dal turno "live" sia dal ricalcolo dopo un annulla)
======================================================== */

function elaboraGameSet(indice, mostraEffetti) {

    if (puntiGame[indice] < puntiPerGame) return;

    gameVinti[indice]++;

    storicoGame.push({ vincitore: indice, punti: puntiGame[indice] });

    if (mostraEffetti) {
        animazioneGame = { indice: indice };
        mostraMessaggioPartita("game", giocatori[indice]);
    }

    /* si azzerano i punti-game di tutti: si riparte con un game nuovo */
    puntiGame = new Array(giocatori.length).fill(0);

    if (gameVinti[indice] < gamePerSet) return;

    setVinti[indice]++;

    storicoSet.push({ vincitore: indice, game: [...gameVinti] });

    if (mostraEffetti) {
        animazioneSet = { indice: indice };
        mostraMessaggioPartita("set", giocatori[indice]);
    }

    gameVinti = new Array(giocatori.length).fill(0);

    if (setVinti[indice] < setPerMatch) return;

    partitaFinita = true;

    if (mostraEffetti) {
        animazioneMatch = { indice: indice };
        lanciaConfetti();
        mostraMessaggioPartita("match", giocatori[indice]);
        localStorage.removeItem("cardscore_partita");
        bloccaInputPartita();
    }
}

function controllaGame(indice) {
    elaboraGameSet(indice, true);
}


/* ========================================================
   VITTORIA - PUNTEGGIO SEMPLICE
======================================================== */

function controllaVittoria() {

    for (let i = 0; i < punteggi.length; i++) {

        if (punteggi[i] >= obiettivoPartita) {

            partitaFinita = true;

            animazioneMatch = { indice: i };
            lanciaConfetti();
            mostraMessaggioPartita("match", giocatori[i]);

            localStorage.removeItem("cardscore_partita");
            bloccaInputPartita();

            return;
        }
    }
}


/* ========================================================
   CONFETTI VITTORIA
======================================================== */

function lanciaConfetti() {

    const canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    document.body.appendChild(canvas);

    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1000000";

    const ctx = canvas.getContext("2d");

    function ridimensiona() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    ridimensiona();

    const colori = ["#1f6f5b", "#d4af37", "#e63946", "#457b9d", "#f4a261", "#2a9d8f"];
    const pezzi = [];

    for (let i = 0; i < 220; i++) {
        pezzi.push({
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * 150,
            w: 6 + Math.random() * 7,
            h: 8 + Math.random() * 10,
            velocitaY: 2 + Math.random() * 4,
            velocitaX: -2 + Math.random() * 4,
            rotazione: Math.random() * Math.PI * 2,
            velocitaRotazione: -0.18 + Math.random() * 0.36,
            colore: colori[Math.floor(Math.random() * colori.length)]
        });
    }

    const inizio = performance.now();

    function anima(tempo) {

        const trascorso = tempo - inizio;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pezzi.forEach(function (pezzo) {
            pezzo.x += pezzo.velocitaX;
            pezzo.y += pezzo.velocitaY;
            pezzo.velocitaY += 0.045;
            pezzo.rotazione += pezzo.velocitaRotazione;

            ctx.save();
            ctx.translate(pezzo.x, pezzo.y);
            ctx.rotate(pezzo.rotazione);
            ctx.fillStyle = pezzo.colore;
            ctx.fillRect(-pezzo.w / 2, -pezzo.h / 2, pezzo.w, pezzo.h);
            ctx.restore();
        });

        if (trascorso < 5000) {
            requestAnimationFrame(anima);
        } else {
            canvas.remove();
            window.removeEventListener("resize", ridimensiona);
        }
    }

    window.addEventListener("resize", ridimensiona);
    requestAnimationFrame(anima);
}


/* ========================================================
   RECAP FINALE PARTITA
======================================================== */

function mostraRecapPartita(vincitore) {

    let recap = document.getElementById("recap-partita");

    if (!recap) {
        recap = document.createElement("div");
        recap.id = "recap-partita";
        document.body.appendChild(recap);
    }

    let html = "<div class='recap-box'>";

    html += "<div class='recap-titolo'>RISULTATO FINALE</div>";
    html += "<div class='recap-vincitore'>" + vincitore + " ha vinto</div>";

    /* --- Classifica finale per punti totali (sempre, se non c'è già il riepilogo Set) --- */
    if (storicoSet.length === 0) {

        const classifica = giocatori
            .map(function (nome, indice) {
                return { nome: nome, punti: punteggi[indice] };
            })
            .sort(function (a, b) {
                return b.punti - a.punti;
            });

        html += "<div class='recap-punteggi'>";

        classifica.forEach(function (voce) {
            const classeVincitore = voce.nome === vincitore ? " vincitore" : "";

            html +=
                "<div class='recap-giocatore" + classeVincitore + "'>" +
                "<strong>" + voce.nome + "</strong>" +
                "<span>" + voce.punti + " punti</span>" +
                "</div>";
        });

        html += "</div>";
    }

    /* --- Risultato Set del match (solo modalità Game/Set/Match) --- */
    if (storicoSet.length > 0) {

        const setFinali = new Array(giocatori.length).fill(0);

        storicoSet.forEach(function (set) {
            if (set.vincitore !== undefined) {
                setFinali[set.vincitore]++;
            }
        });

        html += "<div class='recap-match'>";

        giocatori.forEach(function (nome, indice) {
            html +=
                "<div class='recap-match-giocatore'>" +
                "<strong>" + nome + "</strong>" +
                "<b>" + setFinali[indice] + "</b>" +
                "</div>";
        });

        html += "</div>";
    }

    /* --- Dettaglio dei singoli Set --- */
    if (storicoSet.length > 0) {

        html += "<div class='recap-set-lista'>";

        storicoSet.forEach(function (set, indiceSet) {

            html += "<div class='recap-set'>";
            html += "<div class='recap-set-titolo'>SET " + (indiceSet + 1) + "</div>";
            html += "<div class='recap-set-risultato'>";

            giocatori.forEach(function (nome, indice) {
                const game = set.game[indice] || 0;

                html +=
                    "<div class='recap-set-giocatore'>" +
                    "<span>" + nome + "</span>" +
                    "<b>" + game + "</b>" +
                    "</div>";
            });

            html += "</div>";
            html += "</div>";
        });

        html += "</div>";
    }

    /* --- Pulsanti --- */
    html +=
        "<div class='recap-pulsanti'>" +
        "<button onclick='document.getElementById(\"recap-partita\").style.display=\"none\"; nuovaPartita()'>NUOVA PARTITA</button>" +
        "<button onclick='document.getElementById(\"recap-partita\").style.display=\"none\"; tornaHome()'>TORNA ALLA HOME</button>" +
        "</div>";

    html += "</div>";

    recap.innerHTML = html;
    recap.style.display = "flex";
}


/* ========================================================
   ANIMAZIONI
======================================================== */

function applicaAnimazioneClasse(selettore, indice, classe) {

    const elementi = document.querySelectorAll(selettore);

    elementi.forEach(function (elemento) {
        if (Number(elemento.dataset.indice) === indice) {
            elemento.classList.remove(classe);
            void elemento.offsetWidth;
            elemento.classList.add(classe);
        }
    });
}

function applicaAnimazioni() {

    if (animazionePunteggio !== null) {
        applicaAnimazioneClasse(".score-row", animazionePunteggio.indice, "score-pop");
    }

    if (animazioneGame !== null) {
        applicaAnimazioneClasse(".match-row", animazioneGame.indice, "game-won");
    }

    if (animazioneSet !== null) {
        applicaAnimazioneClasse(".match-row", animazioneSet.indice, "set-won");
    }

    if (animazioneMatch !== null) {
        applicaAnimazioneClasse(".score-row", animazioneMatch.indice, "match-won");
    }

    animazionePunteggio = null;
    animazioneGame = null;
    animazioneSet = null;
    animazioneMatch = null;
}


/* ========================================================
   STORICO TURNI
======================================================== */

function mostraStorico() {

    const elemento = document.getElementById("storico");
    elemento.innerHTML = "<h2>📋 Storico turni</h2>";

    if (storico.length === 0) {
        elemento.innerHTML += "<p>Nessun turno ancora registrato.</p>";
        return;
    }

    [...storico].reverse().forEach(function (turno) {

        const riga = document.createElement("div");
        riga.className = "storico-riga";

        const nome = giocatori[turno.vincitore];

        riga.innerHTML =
            "<strong>Turno " + turno.numero + "</strong>" +
            "<span>" + nome + "</span>" +
            "<b>+" + turno.punti + " punti</b>";

        elemento.appendChild(riga);
    });
}


/* ========================================================
   ANNULLA ULTIMO TURNO
======================================================== */

function annullaUltimoTurno() {

    if (storico.length === 0) {
        alert("Non ci sono turni da annullare.");
        return;
    }

    storico.pop();

    ricalcolaPartita();
    salvaPartita();
}

function ricalcolaPartita() {

    punteggi = new Array(giocatori.length).fill(0);
    puntiGame = new Array(giocatori.length).fill(0);
    gameVinti = new Array(giocatori.length).fill(0);
    setVinti = new Array(giocatori.length).fill(0);
    storicoGame = [];
    storicoSet = [];
    partitaFinita = false;

    storico.forEach(function (turno) {

        const indice = turno.vincitore;
        const punti = Number(turno.punti) || 0;

        punteggi[indice] += punti;

        if (sistemaPunteggio === "game-set") {
            puntiGame[indice] += punti;
            elaboraGameSet(indice, false);
        }
    });

    numeroTurno = storico.length + 1;
    precedenteLeader = null;

    /* La partita potrebbe essere tornata "in corso" dopo l'annullamento,
       oppure risultare ancora vinta: aggiorniamo lo stato di conseguenza. */
    if (sistemaPunteggio === "semplice") {
        partitaFinita = punteggi.some(function (p) { return p >= obiettivoPartita; });
    }
    // in modalità game-set, partitaFinita viene già impostata da elaboraGameSet()

    if (partitaFinita) {
        bloccaInputPartita();
    } else {
        riabilitaInput();
    }

    aggiornaSchermataPartita();
}
