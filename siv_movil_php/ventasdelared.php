<?php
	include_once("_QueryModel.php");
	$q = new _QueryModel;

	function fecha_a_mysql($fecha_web){
		$fecha=explode('/',$fecha_web);
	    return $fecha_v=$fecha[2].'-'.$fecha[1].'-'.$fecha[0];
	}

	if($_GET['op'] == 1){//ACTUALIZA SERVIDOR PEDIDOS H
		$array = json_decode(file_get_contents("php://input"));
		$f = 0;
		foreach($array as $r){
		
			$q->query("select nro_pedido from siv_pedidosh where id_vendedor = '".$r->id_vendedor."' and nro_pedido = '".$r->nro_pedido."' and id_clientes = '".$r->id_clientes."'");
			$row = $q->getFetchArray();
			$f=0;
			if(count($row) <= 0){

				if($q->query("insert into siv_pedidosh(id_vendedor,id_clientes,nro_pedido,descuento,igv,subtotal,total,tipo,fch_regi,usu_regi,lat,lon) values('".$r->id_vendedor."','".$r->id_clientes."','".$r->nro_pedido."','".$r->descuento."','".$r->igv."','".$r->subtotal."','".$r->total."','".$r->tipo."','".$r->fch_regi."','".$r->usu_regi."','".$r->lat."','".$r->lon."')")) $f++;
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


	}else{//ENVIA DATOS AL APP 
	//	$q->query("select a.id_vendedor,a.id_clientes,a.nro_pedido,a.fecha,a.descuento,a.igv,a.subtotal,a.total,a.tipo,date_format(a.fch_regi,'%Y-%m-%d') as fch_regi,(select b.nombre from siv_clientes as b where b.id_clientes = a.id_clientes) as nombre,(select d.direccion from siv_clientes as d where d.id_clientes = a.id_clientes) as direccion,(CASE  WHEN a.tipo = 1 THEN 'FACTURA' WHEN a.tipo = 2 THEN 'BOLETA' END) as nombre_tipo,a.usu_regi,a.lat,a.lon from siv_pedidosh as a where a.tipo = 1 or a.tipo = 2");
	
		$q->query("select a.id_vendedor,a.id_clientes,a.nro_pedido,a.fecha,a.descuento,a.igv,a.subtotal,a.total,a.tipo,date_format(a.fch_regi,'%Y-%m-%d') as fch_regi,(select b.nombre from siv_clientes as b where b.codigo = a.id_clientes) as nombre,(select d.direccion from siv_clientes as d where d.codigo = a.id_clientes) as direccion,(CASE  WHEN a.tipo = 1 THEN 'FACTURA' WHEN a.tipo = 2 THEN 'BOLETA' END) as nombre_tipo,a.usu_regi,a.lat,a.lon from siv_pedidosh as a where a.tipo = 1 or a.tipo = 2");
		$array=$q->getFetchArrayEach();
		$array = json_encode($array);
		echo $array;

	}

	
	//echo $_GET['jsoncallback'] . '(' .$array.');';


 ?>