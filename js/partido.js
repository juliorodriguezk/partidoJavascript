var MiFramework = MiFramework || {};
(
    function(scope) {
        scope.Partido = function Partido(nombreEquipoLocal, nombreEquipoVisitante, nombreEvento, duracionEvento) {
            //this.reloj = new Reloj(duracion);
            this.marcador = new Marcador(local, visitante, evento);
            //this.eventos = new Tablon();
        };
    }
)(MiFramework)
