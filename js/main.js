var miMarcador = new MiFramework.Marcador("Equipo Local", "Equipo Visitante", "Partido Amistoso");
var contenedor = document.getElementById('contenedorPrincipal');
contenedor.appendChild(miMarcador.dameNodo());

function simulaPartido(miMarcador) {
    setTimeout(miMarcador.inicio, 0);

    setTimeout(function() {
        miMarcador.punto(miMarcador.LOCAL);
    }, 20000);
    setTimeout(miMarcador.descanso, 45000);
    setTimeout(miMarcador.reanuda, 60000);
    setTimeout(function() {
        miMarcador.punto(miMarcador.LOCAL);
    }, 65000);
    setTimeout(function() {
        miMarcador.punto(miMarcador.VISITANTE);
    }, 70000);
    setTimeout(function() {
        miMarcador.punto(miMarcador.LOCAL);
    }, 100000);

    setTimeout(miMarcador.fin, 105000);
};

simulaPartido(miMarcador);
