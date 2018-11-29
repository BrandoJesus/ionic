<?php //header("Content-type", "text/html");
	include_once("_QueryModel.php");
	$q = new _QueryModel;

	$q->query("select * from siv_usuarios");
	$array=$q->getFetchArrayEach();

	$array = json_encode($array);
	echo $array;

	//echo $_GET['JSON_CALLBACK'] . '(' .$array.')';


 ?>