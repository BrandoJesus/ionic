<?php
	include_once("_QueryModel.php");
	$q = new _QueryModel;

	if($_GET['op'] == 1){//SUBE DATOS DE LOS PEDIDOS DETALLE
		$array = json_decode(file_get_contents("php://input"));
		$f = 0;
		foreach($array as $r){
		
			$q->query("select nro_pedido from siv_pedidosd where id_vendedor = '".$r->id_vendedor."' and id_clientes = '".$r->id_clientes."' and nro_pedido = '".$r->nro_pedido."' and id_productos = '".$r->id_productos."'");
			$row = $q->getFetchArray();
			if(count($row) <= 0){

				if($q->query("insert into siv_pedidosd(id_vendedor,id_clientes,nro_pedido,id_productos,cantidad,descuento,precio,tipo) values('".$r->id_ventas."','".$r->id_clientes."','".$r->nro_pedido."','".$r->id_productos."','".$r->cantidad."','".$r->descuento."','".$r->total."','".$r->tipo."')")) $f++;
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



	}else{//DESCARGA LOS PEDIDOS DETALLE

		//$q->query("select a.id_vendedor,a.id_clientes,a.nro_pedido,a.id_productos,(select b.nombre from siv_productos as b where b.id_productos = a.id_productos) as producto,a.cantidad,a.descuento,(a.precio/a.cantidad) as precio,a.precio as total,a.tipo from siv_pedidosd as a where a.tipo = 1 or a.tipo = 2");
		
		$q->query("select a.id,a.id_ventas,a.id_cliente,a.id_productos,(select b.nombre from siv_productos as b where b.id = a.id_productos) as producto,a.cantidad,a.descuento,(a.precio/a.cantidad) as precio,a.precio as total,a.tipo from siv_pedidosd as a where a.tipo = 1 or a.tipo = 2");
		
		
		$array=$q->getFetchArrayEach();
		

		$array = json_encode($array);
		echo $array;
	}

	//echo $_GET['jsoncallback'] . '(' .$array.');';


 ?>