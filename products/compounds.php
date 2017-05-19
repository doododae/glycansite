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
	$query = "SELECT * FROM compounds";

	$result = $conn->query($query);

	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if($outp != "") {
			$outp .= ",";
		}
		$outp .= '{"id":"'.$rs["id"].'",';
		$outp .= '"Family":"'.$rs["Family"].'",';
		$outp .= '"Series":"'.$rs["Series"].'",';
		$outp .= '"Name":"'.$rs["Name"].'",';
		$outp .= '"Structure":"'.$rs["Structure"].'",';
		$outp .= '"Link_A":"'.$rs["Link_A"].'",';
		$outp .= '"Link_B":"'.$rs["Link_B"].'",';
		$outp .= '"Link_C":"'.$rs["Link_C"].'",';
		$outp .= '"Picture":"'.$rs["Picture"].'",';
		$outp .= '"Price":"'.$rs["Price"].'",';
		$outp .= '"Keywords":"'.$rs["Keywords"].'"}';
	}

	$outp = '{"records":['.$outp.']}';
	$conn->close();
	echo($outp);
	exit();
}

else if($_SERVER['REQUEST_METHOD'] == "POST") {
	$id = intval($_POST['id']);
	$pid = intval($_POST['pid']);
	$size = intval($_POST['size']);
	$qty = intval($_POST['quantity']);
	$size_name = $conn->real_escape_string($_POST['size_name']);
	$query = "INSERT INTO tempcart VALUES ($id, $pid, $size, '$size_name', $qty)";
	$conn->query($query);
	exit();
}
?>
