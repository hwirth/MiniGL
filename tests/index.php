<?php

$json = "[";

$file_names = glob("*.js");
sort( $file_names );

forEach( $file_names as $file_name ) {
	$json .= '"' . $file_name . '",';
}

$json = substr( $json, 0, -1 ) . "]";

echo $json;