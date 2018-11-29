<?php
include_once("_QueryModel.php");
$q = new _QueryModel;

if($_GET['op'] == 1){//ACTUALIZA EL SERVIDOR

	$array = json_decode(file_get_contents("php://input"));
	$f = 0;
	foreach($array as $r){
		$q->query("select id_clientes from siv_clientes where id_clientes like '".$r->id_clientes."'");
		$row = $q->getFetchArray();
		if($row['id_clientes'] == ''){

			if($q->query("insert into siv_clientes(id_clientes,nombre,tipo_documento,documento,direccion,telefono,email,vendedor,listaprecio) values('".$r->id_clientes."','".$r->nombre."','".$r->tipo_documento."','".$r->documento."','".$r->direccion."','".$r->telefono."','".$r->email."','".$r->vendedor."','".$r->listaprecio."')")) $f++;
		}else{
			if($q->query("update siv_clientes set nombre = '".$r->nombre."',tipo_documento = '".$r->tipo_documento."',documento = '".$r->documento."',direccion = '".$r->direccion."',telefono = '".$r->telefono."',email = '".$r->email."',vendedor = '".$r->vendedor."',listaprecio = '".$r->listaprecio."' where id_clientes like '".$r->id_clientes."'")) $f++;
		}

	}

	if($f > 0){
		$array = array('0'=>array("respuesta"=>1));
		$array = json_encode($array);
		echo $array;
	}else{
		$array = array();
		$array = json_encode($array);
		echo $array;
	}
	

}else{//ACTUALIZA LA APP

	$q->query("select * from siv_clientes");
	$array=$q->getFetchArrayEach();

	$array = json_encode($array);
	echo $array;

	//echo $_GET['jsoncallback'] . '(' .$array.');';
}


 ?>