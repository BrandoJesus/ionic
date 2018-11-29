<?php
	include_once("_QueryModel.php");
	$q = new _QueryModel;

	$q->query("select * from siv_configuracion");
	$array=$q->getFetchArrayEach();

	$array = json_encode($array);
	echo $array;

	//echo $_GET['jsoncallback'] . '(' .$array.');';


 ?>