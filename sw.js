/* =========================================================
   CARDSCORE - SERVICE WORKER
   Cache statica per far funzionare l'app anche offline.
   Cambia CACHE_NAME ad ogni aggiornamento dei file per
   forzare il refresh della cache sui dispositivi.
========================================================= */

const CACHE_NAME = "cardscore-cache-v31";

const FILE_DA_CACHARE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./immagini/cardscore.PNG",
    "./immagini/scala40.png",
    "./immagini/scopa.png",
    "./immagini/uno.png",
    "./immagini/pili-pili.png",
    "./icone/icon-192.png",
    "./icone/icon-512.png",
    "./icone/icon-maskable-192.png",
    "./icone/icon-maskable-512.png"
];


/* =========================================================
   INSTALLAZIONE - salva tutti i file in cache
========================================================= */

self.addEventListener("install", function (evento) {

    evento.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {

                // Aggiungiamo i file uno per uno: se uno manca (es. un'icona
                // non ancora caricata) non blocchiamo l'installazione degli
                // altri, a differenza di cache.addAll() che fallisce in blocco
                // se anche un solo file da' errore.
                return Promise.all(
                    FILE_DA_CACHARE.map(function (file) {
                        return cache.add(file).catch(function () {
                            // file non trovato o non raggiungibile: lo si ignora
                        });
                    })
                );
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});


/* =========================================================
   ATTIVAZIONE - elimina le cache vecchie
========================================================= */

self.addEventListener("activate", function (evento) {

    evento.waitUntil(
        caches
            .keys()
            .then(function (nomiCache) {

                return Promise.all(
                    nomiCache
                        .filter(function (nome) {
                            return nome !== CACHE_NAME;
                        })
                        .map(function (nome) {
                            return caches.delete(nome);
                        })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});


/* =========================================================
   FETCH - cache first, con fallback alla rete
========================================================= */

self.addEventListener("fetch", function (evento) {

    if (evento.request.method !== "GET") {
        return;
    }

    evento.respondWith(
        caches
            .match(evento.request)
            .then(function (rispostaCache) {

                if (rispostaCache) {
                    return rispostaCache;
                }

                return fetch(evento.request)
                    .then(function (rispostaRete) {

                        if (
                            !rispostaRete ||
                            rispostaRete.status !== 200 ||
                            rispostaRete.type !== "basic"
                        ) {
                            return rispostaRete;
                        }

                        const copiaRisposta = rispostaRete.clone();

                        caches
                            .open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(evento.request, copiaRisposta);
                            });

                        return rispostaRete;
                    })
                    .catch(function () {
                        return caches.match("./index.html");
                    });
            })
    );
});
