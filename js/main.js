var miMarcador = new MiFramework.Marcador("Equipo Local", "Equipo Visitante", "Partido Amistoso");
var contenedor = document.getElementById('contenedorPrincipal');
contenedor.appendChild(miMarcador.dameNodo());

function simulaPartido(miMarcador) {
    setTimeout(function() {
        var event = new CustomEvent('inicioPartido', {
            'detail': {
                'tipoEvento': miMarcador.INICIO
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 0);

    setTimeout(function() {
        var event = new CustomEvent('puntoPartido', {
            'detail': {
                'tipoEvento': miMarcador.GOL,
                'equipo': miMarcador.LOCAL
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 20000);

    setTimeout(function() {
        var event = new CustomEvent('puntoPartido', {
            'detail': {
                'tipoEvento': miMarcador.GOL,
                'equipo': miMarcador.LOCAL
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 30000);
    setTimeout(function() {
        var event = new CustomEvent('descansoPartido', {
            'detail': {
                'tipoEvento': miMarcador.DESCANSO
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 45000);
    setTimeout(function() {
        var event = new CustomEvent('reanudaPartido', {
            'detail': {
                'tipoEvento': miMarcador.REANUDACION
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 60000);
    setTimeout(function() {
        var event = new CustomEvent('puntoPartido', {
            'detail': {
                'tipoEvento': miMarcador.GOL,
                'equipo': miMarcador.VISITANTE
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 65000);
    setTimeout(function() {
        var event = new CustomEvent('puntoPartido', {
            'detail': {
                'tipoEvento': miMarcador.GOL,
                'equipo': miMarcador.LOCAL
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 100000);
    setTimeout(function() {
        var event = new CustomEvent('finPartido', {
            'detail': {
                'tipoEvento': miMarcador.FIN
            }
        });
        miMarcador.dameNodo().dispatchEvent(event);
    }, 105000);
};

simulaPartido(miMarcador);
