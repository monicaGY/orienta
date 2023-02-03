<?php
// require_once 'funciones.php';
header('Access-Control-Allow-Origin: *');

$host = "localhost";
$dbname = "orienta";
$username = "root";
$password = "";
$conn = new PDO("mysql:host=$host;dbname=$dbname",$username,$password);


if($_GET){

    if (isset($_GET['universidad'])) {
        $consulta = 'SELECT DISTINCT(Universidad) FROM `corte`;';
    }
    if (isset($_GET['comunidad'])) {
        $consulta = 'SELECT DISTINCT(Comunidad) FROM `materias`;';
    }

    if(!empty($_GET['universidad'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte` where Universidad LIKE '%".$_GET['universidad']."%';";

    }

    if(!empty($_GET['facultad'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%';";

    }
    
    if(!empty($_GET['grado'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte`where titulo LIKE '%". $_GET['grado']."%';";

    }

    if(!empty($_GET['universidad']) && !empty($_GET['facultad'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%' && Universidad LIKE '%". $_GET['universidad']."%';";

    }

    if(!empty($_GET['universidad']) && !empty($_GET['grado'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte`where Titulo LIKE '%". $_GET['grado']."%' && Universidad LIKE '%". $_GET['universidad']."%';";

    }

    if(!empty($_GET['facultad']) && !empty($_GET['grado'])){
        $consulta = "SELECT titulo,Centro,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%' && Titulo LIKE '%". $_GET['grado']."%';";

    }

    if(!empty($_GET['facultad']) && !empty($_GET['grado']) && !empty($_GET['universidad'])){
        $consulta = "SELECT Universidad,titulo,Centro,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%' && Titulo LIKE '%". $_GET['grado']."%' && Universidad LIKE '%". $_GET['universidad']."%';";

    }

    $consulta= $conn->prepare($consulta);

    $consulta->execute();

    $contenido = [];
    while ($fila = $consulta->fetch(PDO::FETCH_ASSOC)) {
        $contenido[] = $fila;
    }

    echo json_encode($contenido);
}

?>