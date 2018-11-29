<?php
	include_once("_QueryModel.php");
	$q = new _QueryModel;

	$q->query("select a.* from siv_productos as a");
	$array=$q->getFetchArrayEach();

	$array = json_encode($array);
	echo $array;

	//echo $_GET['jsoncallback'] . '(' .$array.');';


 ?>