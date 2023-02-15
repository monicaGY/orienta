<?php
// require_once 'funciones.php';
header('Access-Control-Allow-Origin: *');

$host = "localhost";
$dbname = "orienta";
$username = "root";
$password = "";
$conn = new PDO("mysql:host=$host;dbname=$dbname",$username,$password);


if(isset($_GET)){
    if (isset($_GET['universidades'])) {
        $consulta = 'SELECT nombre FROM `universidad`;';

    }elseif(isset($_GET['materias'])){
        $consulta = 'SELECT DISTINCT(nombre) FROM `materias`;';

    }elseif (isset($_GET['comunidades'])) {
        $consulta = 'SELECT * FROM `ccaa`;';

    }elseif(isset($_GET['grados'])){
        $consulta = 'SELECT DISTINCT(Titulo) FROM `grado`;';
    }
    
    
    if (isset($_GET['codComunidad']) && isset($_GET['grado'])) {
        // ccaa.Nombre, universidad.Nombre, grado.Titulo,grado.N_Corte 
        $consulta='SELECT ccaa.Nombre AS comunidad, universidad.Nombre, grado.Titulo,grado.N_Corte FROM universidad
            INNER JOIN grado ON grado.Cod_uni =universidad.Codigo
            INNER JOIN ccaa ON ccaa.Codigo=universidad.Cod_comunidad 
            WHERE ccaa.Codigo="'.$_GET['codComunidad'].'" && grado.Titulo="'.$_GET['grado'].'"';
        
    }elseif(!empty($_GET['comunidad'])){
        $consulta = 'SELECT materias.Nombre FROM `materias` INNER JOIN ccaa ON ccaa.Codigo = materias.Comunidad WHERE ccaa.Codigo="'.$_GET['comunidad'].'"';
    
    }elseif(!empty($_GET['universidad'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte` where Universidad LIKE '%".$_GET['universidad']."%';";

    }elseif(!empty($_GET['facultad'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%';";

    }elseif(!empty($_GET['grado'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte`where titulo LIKE '%". $_GET['grado']."%';";

    }elseif(!empty($_GET['universidad']) && !empty($_GET['facultad'])){
        
        $consulta = "SELECT titulo,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%' && Universidad LIKE '%". $_GET['universidad']."%';";

    }elseif(!empty($_GET['universidad']) && !empty($_GET['grado'])){
        $consulta = "SELECT titulo,N_Corte FROM `corte`where Titulo LIKE '%". $_GET['grado']."%' && Universidad LIKE '%". $_GET['universidad']."%';";

    }// }elseif(!empty($_GET['facultad']) && !empty($_GET['grado'])){
    //     $consulta = "SELECT titulo,Centro,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%' && Titulo LIKE '%". $_GET['grado']."%';";

    // }elseif(!empty($_GET['facultad']) && !empty($_GET['grado']) && !empty($_GET['universidad'])){
    //     $consulta = "SELECT Universidad,titulo,Centro,N_Corte FROM `corte`where centro LIKE '%". $_GET['facultad']."%' && Titulo LIKE '%". $_GET['grado']."%' && Universidad LIKE '%". $_GET['universidad']."%';";

    // }
    

    $consulta= $conn->prepare($consulta);

    $consulta->execute();

    $contenido = [];
    while ($fila = $consulta->fetch(PDO::FETCH_ASSOC)) {
        $contenido[] = $fila;
    }

    echo json_encode($contenido);
}

?>