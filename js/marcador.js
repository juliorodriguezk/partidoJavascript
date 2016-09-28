var MiFramework = MiFramework || {};
(
    function(scope) {
        scope.Marcador = function Marcador(local, visitante, evento) {

            var LOCAL = 0,
                VISITANTE = 1,
                GOL = 0,
                ANULADO = 2,
                INICIO = 4,
                FIN = 5,
                DESCANSO = 6,
                REANUDACION = 7,
                NOMBRE = 0,
                PUNTOS = 2,
                EVENTO = 4,
                TIEMPO = 5,
                INFORMACION = 6,
                TEXTO_EVENTOS = ["Gol Local", "Gol Visitante", "Anulado Gol Local", "Anulado Gol Visitante", "Inicio Partido", "Fin Partido", "Descanso Partido", "Reanudación Partido"],
                /*Variables y métodos privados*/
                ESTILOS = ["digital", "square", "trs"],
                estiloTexto = 1,
                estiloPuntos = 0,
                ORDEN_CONTENEDOR = [0, 1, 0, 1, 0, 0, 1],
                nodoHTML = null,
                nombreLocal = typeof local === "string" ? local : "",
                nombreVisitante = typeof visitante === "string" ? visitante : "",
                nombreEvento = typeof evento === "string" ? evento.toUpperCase() : "",
                puntosLocal = 0,
                puntosVisitante = 0,
                lastEvent = -1,
                modificaMarcador = function(quien, cuanto) {
                    if (quien === LOCAL) {
                        puntosLocal += cuanto;
                    } else if (quien === VISITANTE) {
                        puntosVisitante += cuanto;
                    } else {
                        puntosLocal = 0;
                        puntosVisitante = 0;
                        lastEvent = -1;
                    }
                },
                actualizaVistaMarcador = function(contenedor) {
                    var informacion = null,
                        clase = null;
                    switch (contenedor) {
                        case (LOCAL + NOMBRE):
                            informacion = nombreLocal;
                            clase = "nombre";
                            break;
                        case (VISITANTE + NOMBRE):
                            informacion = nombreVisitante;
                            clase = "nombre";
                            break;
                        case (LOCAL + PUNTOS):
                            informacion = puntosLocal;
                            clase = "puntos";
                            break;
                        case (VISITANTE + PUNTOS):
                            informacion = puntosVisitante;
                            clase = "puntos";
                            break;
                        case (EVENTO):
                            informacion = nombreEvento;
                            clase = "evento";

                            break;
                        case (TIEMPO):
                            clase = "informacion";
                            break;
                        case (INFORMACION):
                            informacion = lastEvent !== -1 ? TEXTO_EVENTOS[lastEvent] : null;
                            clase = "informacion";
                            break;
                    }
                    if (informacion !== null && clase !== null) {
                        nodoHTML.getElementsByClassName(clase)[ORDEN_CONTENEDOR[contenedor]].innerHTML = informacion;
                    }
                },
                tratarEvento = function(evento) {
                    console.log(evento);
                    if (evento && evento.detail) {
                        lastEvent = evento.detail.tipoEvento;
                        if (evento.detail.equipo) {
                            lastEvent += evento.detail.equipo;
                        }
                        switch (evento.detail.tipoEvento) {
                            case GOL:
                                modificaMarcador(evento.detail.equipo, 1);
                                actualizaVistaMarcador(evento.detail.equipo + PUNTOS);
                                break;
                            case ANULADO:
                                modificaMarcador(evento.detail.equipo, -1);
                                actualizaVistaMarcador(evento.detail.equipo + PUNTOS);
                                break;
                            case INICIO:
                            case FIN:
                            case REANUDACION:
                            case DESCANSO:
                                break;
                        }
                        actualizaVistaMarcador(INFORMACION);
                    }
                },
                crearNodo = function() {
                    var evento = document.createElement('div'),
                        tiempo = document.createElement('div'),
                        local = document.createElement('div'),
                        visitante = document.createElement('div'),
                        puntosLocal = document.createElement('div'),
                        puntosVisitante = document.createElement('div'),
                        informacion = document.createElement('div'),
                        i = 0;

                    nodoHTML = document.createElement('div');
                    nodoHTML.className = "marcador";
                    nodoHTML.classList.add(ESTILOS[estiloTexto]);
                    evento.className = "evento";
                    tiempo.className = "informacion";
                    local.className = "nombre";
                    visitante.className = "nombre";
                    puntosLocal.className = "puntos";
                    puntosLocal.classList.add(ESTILOS[estiloPuntos]);
                    puntosVisitante.className = "puntos";
                    puntosVisitante.classList.add(ESTILOS[estiloPuntos]);
                    informacion.className = "informacion";
                    nodoHTML.appendChild(evento);
                    nodoHTML.appendChild(tiempo);
                    nodoHTML.appendChild(local);
                    nodoHTML.appendChild(visitante);
                    nodoHTML.appendChild(puntosLocal);
                    nodoHTML.appendChild(puntosVisitante);
                    nodoHTML.appendChild(informacion);
                    for (i = 0; i < ORDEN_CONTENEDOR.length; i++) {
                        actualizaVistaMarcador(i);
                    }
                    /* Activamos la escucha de eventos */
                    nodoHTML.addEventListener('puntoPartido', tratarEvento, false);
                    nodoHTML.addEventListener('inicioPartido', tratarEvento, false);
                    nodoHTML.addEventListener('finPartido', tratarEvento, false);
                    nodoHTML.addEventListener('descansoPartido', tratarEvento, false);
                    nodoHTML.addEventListener('reanudaPartido', tratarEvento, false);
                };

            crearNodo();
            this.dameNodo = function() {
                return nodoHTML;
            };

            this.LOCAL = LOCAL;
            this.VISITANTE = VISITANTE;
            this.GOL = GOL;
            this.ANULADO = ANULADO;
            this.INICIO = INICIO;
            this.FIN = FIN;
            this.DESCANSO = DESCANSO;
            this.REANUDACION = REANUDACION;

            /*Variables y Métodos públicos*/
            this.inicioPartido = function() {
                lastEvent = INICIO;
            };
            this.finPartido = function() {
                lastEvent = FIN;
            };
            this.golLocal = function() {
                modificaMarcador(LOCAL, 1);
                lastEvent = GOL + LOCAL;
                actualizaVistaMarcador(LOCAL + PUNTOS);
                actualizaVistaMarcador(INFORMACION);
            };
            this.golVisitante = function() {
                modificaMarcador(VISITANTE, 1);
                lastEvent = GOL + VISITANTE;
                actualizaVistaMarcador(VISITANTE + PUNTOS);
                actualizaVistaMarcador(INFORMACION);
            };
            this.anuladoLocal = function() {
                modificaMarcador(LOCAL, -1);
                lastEvent = ANULADO + LOCAL;
            };
            this.anuladoVisitante = function() {
                modificaMarcador(VISITANTE, -1);
                lastEvent = ANULADO + VISITANTE;
            };
            this.reset = function() {
                modificaMarcador();
            };
            this.consultarGoles = function(equipo) {
                var objResultado;
                if (equipo === LOCAL) {
                    return puntosLocal;
                } else if (equipo === VISITANTE) {
                    return puntosVisitante;
                } else {
                    objResultado = {};
                    objResultado[LOCAL] = puntosLocal;
                    objResultado[VISITANTE] = puntosVisitante;
                    return objResultado;
                }
            };
            this.consultarNombre = function(equipo) {
                var objResultado;
                if (equipo === LOCAL) {
                    return nombreLocal;
                } else if (equipo === VISITANTE) {
                    return nombreVisitante;
                } else {
                    objResultado = {};
                    objResultado[LOCAL] = nombreLocal;
                    objResultado[VISITANTE] = nombreVisitante;
                    return objResultado;
                }
            };
            this.consultarNombreEvento = function() {
                return nombreEvento;
            };
            this.consultarUltimoEvento = function() {
                var uEvento = lastEvent !== -1 ? TEXTO_EVENTOS[lastEvent] : "";
                lastEvent = -1;
                return uEvento;
            };
        };
    }
)(MiFramework)
