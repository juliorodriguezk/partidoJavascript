var MiFramework = MiFramework || {};
(
    function(scope) {
        scope.Marcador = function Marcador(local, visitante, evento, duracionParte, partes) {

            var MINUTO_MS_SIMUL = 1000,
                LOCAL = 0,
                VISITANTE = 1,
                GOL = 0,
                ANULADO = 2,
                INICIO = 4,
                FIN = 5,
                DESCANSO = 6,
                REANUDACION = 7,
                PARA = 8,
                CONTINUA = 9,
                NOMBRE = 0,
                PUNTOS = 2,
                EVENTO = 4,
                TIEMPO = 5,
                INFORMACION = 6,
                MINUTO = 0,
                MINUTO_ABREVIADO = 1,
                TEXTO_EVENTOS = ["Gol Local", "Gol Visitante", "Anulado Gol Local", "Anulado Gol Visitante", "Inicio Partido", "Fin Partido", "Descanso Partido", "Reanudación Partido", "Pausa Partido", "Fin Pausa"],
                TEXTO_MARCADOR = ["Minuto", "Min"],
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
                minutoActual = 0,
                parteActual = 0,
                actualizadorReloj = null,
                actualizaParte = function() {
                    parteActual++;
                },
                actualizaReloj = function() {
                    minutoActual++;
                    actualizaVistaMarcador(TIEMPO);
                },
                paraReloj = function() {
                    actualizaReloj();
                    if (actualizadorReloj) {
                        clearInterval(actualizadorReloj);
                    }
                    actualizadorReloj = null;
                },
                iniciaReloj = function() {
                    if (actualizadorReloj) {
                        paraReloj();
                    }
                    actualizadorReloj = setInterval(actualizaReloj, MINUTO_MS_SIMUL);
                },
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
                            informacion = TEXTO_MARCADOR[MINUTO] + " " + minutoActual + "'";
                            clase = "informacion";
                            break;
                        case (INFORMACION):
                            informacion = lastEvent !== -1 ? TEXTO_EVENTOS[lastEvent] + " (" + TEXTO_MARCADOR[MINUTO_ABREVIADO] + " " + minutoActual + "'" + ")" : null;


                            clase = "informacion";
                            break;
                    }
                    if (informacion !== null && clase !== null) {
                        nodoHTML.getElementsByClassName(clase)[ORDEN_CONTENEDOR[contenedor]].innerHTML = informacion;
                    }
                },
                tratarEvento = function(evento) {
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
                                actualizaParte();
                                iniciaReloj();
                                break;
                            case FIN:
                                paraReloj();
                                break;
                            case REANUDACION:
                                actualizaParte();
                                iniciaReloj();
                                break;
                            case DESCANSO:
                                paraReloj();
                                break;
                            case PAUSA:
                                paraReloj();
                                break;
                            case CONTINUA:
                                iniciaReloj();
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
                        separadorPuntos = document.createElement('div'),
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
                    separadorPuntos.className = "separador";
                    puntosVisitante.className = "puntos";
                    puntosVisitante.classList.add(ESTILOS[estiloPuntos]);
                    informacion.className = "informacion";
                    nodoHTML.appendChild(evento);
                    nodoHTML.appendChild(tiempo);
                    nodoHTML.appendChild(local);
                    nodoHTML.appendChild(visitante);
                    nodoHTML.appendChild(puntosLocal);
                    nodoHTML.appendChild(separadorPuntos);
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
                    nodoHTML.addEventListener('paraPartido', tratarEvento, false);
                    nodoHTML.addEventListener('continuaPartido', tratarEvento, false);

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
            this.inicio = function() {
                var event = new CustomEvent('inicioPartido', {
                    'detail': {
                        'tipoEvento': INICIO
                    }
                });
                nodoHTML.dispatchEvent(event);
            };

            this.fin = function() {
                var event = new CustomEvent('finPartido', {
                    'detail': {
                        'tipoEvento': FIN
                    }
                });
                nodoHTML.dispatchEvent(event);
            };
            this.descanso = function() {
                var event = new CustomEvent('descansoPartido', {
                    'detail': {
                        'tipoEvento': DESCANSO
                    }
                });
                nodoHTML.dispatchEvent(event);
            };
            this.reanuda = function() {
                var event = new CustomEvent('reanudaPartido', {
                    'detail': {
                        'tipoEvento': REANUDACION
                    }
                });
                nodoHTML.dispatchEvent(event);
            };
            this.para = function() {
                var event = new CustomEvent('paraPartido', {
                    'detail': {
                        'tipoEvento': PARA
                    }
                });
                nodoHTML.dispatchEvent(event);
            };
            this.continua = function() {
                var event = new CustomEvent('continuaPartido', {
                    'detail': {
                        'tipoEvento': CONTINUA
                    }
                });
                nodoHTML.dispatchEvent(event);
            };
            this.punto = function(equipo) {
                var event = new CustomEvent('puntoPartido', {
                    'detail': {
                        'tipoEvento': GOL,
                        'equipo': equipo
                    }
                });
                nodoHTML.dispatchEvent(event);
            };
            this.anulado = function(equipo) {
                var event = new CustomEvent('puntoPartido', {
                    'detail': {
                        'tipoEvento': ANULADO,
                        'equipo': equipo
                    }
                });
                nodoHTML.dispatchEvent(event);
            };

            this.reset = function() {
                modificaMarcador();
            };
            this.consultarPuntos = function(equipo) {
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
