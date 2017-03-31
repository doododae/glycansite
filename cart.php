<?php
$server = "localhost";
$user = "kliu10";
$pass = "Saweqr1!";
$dbname = "glycan";

$conn = new mysqli($server, $user, $pass, $dbname);

if($conn->connect_error) {
	die("Connection failed: ").$conn->connect_error;
}

if(isset($_SERVER["PATH_INFO"])) {
	$path_components = explode("/", $_SERVER["PATH_INFO"]);
}
else {
	$path_components = null;
}

$input = json_decode(file_get_contents("php://input"));

if($_SERVER['REQUEST_METHOD'] == "GET") {
	$query = "SELECT Name FROM compounds JOIN tempcart ON compounds.id = tempcart.pid";

	$result = $conn->query($query);

	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if($outp != "") {
			$outp .= ",";
		}
		$outp .= '{"Name":"'.$rs["Name"].'"}';
	}

	$outp = '{"records":['.$outp.']}';
	$conn->close();
	echo($outp);
	exit();
}

else if($_SERVER['REQUEST_METHOD'] == "POST") {
	$id = $_POST['id'];
	$name = $_POST['name'];
	$email = $_POST['email'];
	$shipAddress = $_POST['shipAddress'];
	$billAddress = $_POST['billAddress'];
	$cartID = $_POST['cartID'];
	$query = "INSERT INTO customer_info VALUES ('$id', '$name', '$email', '$shipAddress', '$billAddress', '$cartID')";
	$conn->query($query);
	exit();
}
?>