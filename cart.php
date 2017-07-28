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
	$id = intval($path_components[1]);
	$query = "SELECT compounds.id, Name, pid, size, size_name, Price, quantity, Structure FROM compounds JOIN tempcart ON compounds.id = tempcart.pid WHERE tempcart.id = $id";

	$result = $conn->query($query);

	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if($outp != "") {
			$outp .= ",";
		}
		$outp .= '{"id":"'.$rs["id"].'",';
		$outp .= '"Name":"'.$rs["Name"].'",';
		$outp .= '"pid":"'.$rs["pid"].'",';
		$outp .= '"size":"'.$rs["size"].'",';
		$outp .= '"Price":"'.$rs["Price"].'",';
		$outp .= '"size_name":"'.$rs["size_name"].'",';
		$outp .= '"quantity":"'.$rs["quantity"].'",';
		$outp .= '"Structure":"'.$rs["Structure"].'"}';
	}

	$outp = '{"records":['.$outp.']}';
	$conn->close();
	echo($outp);
	exit();
}

else if($_SERVER['REQUEST_METHOD'] == "POST") {
	if($_POST['type'] == "customer") {
		$id = $mysqli->real_escape_string($_POST['id']);
		$name = $mysqli->real_escape_string($_POST['name']);
		$email = $mysqli->real_escape_string($_POST['email']);
		$shipAddress = $mysqli->real_escape_string($_POST['shipAddress']);
		$cartID = $mysqli->real_escape_string($_POST['cartID']);
		$query = "INSERT INTO customer_info VALUES ('$id', '$name', '$email', '$shipAddress', '$cartID')";
		$conn->query($query);

		$bid = $mysqli->real_escape_string($_POST['bid']);
		$institution = $mysqli->real_escape_string($_POST['institution']);
		$contact = $mysqli->real_escape_string($_POST['contact']);
		$contactEmail = $mysqli->real_escape_string($_POST['contactEmail']);
		$contactPhone = $mysqli->real_escape_string($_POST['contactPhone']);
		$billAddress = $mysqli->real_escape_string($_POST['billAddress']);
		$poNo = $mysqli->real_escape_string($_POST['poNo']);
		$billQuery = "INSERT INTO billing_info VALUES ('$bid', '$institution', '$contact', '$contactEmail', '$contactPhone', '$billAddress', '$poNo')";
		$conn->query($billQuery);

		$oid = $mysqli->real_escape_string($_POST['oid']);
		$cid = $mysqli->real_escape_string($_POST['cid']);
		$date = date(gmdate('Y-m-d h:i:s'));
		$invoiceQuery = "INSERT INTO orders VALUES ('$oid', '$cid', '$date')";
		$conn->query($invoiceQuery);

		$message = "Shipping Info\nName: ".$name."\nEmail: ".$email."Address: ".shipAddress."\nBilling Info\nInstitution: ".$institution."\nContact Name: ".$contact."\nContact Email: ".$contactEmail."\nContact Phone: ".$contactPhone."\nBilling Address: ".$billAddress;
		$message = wordwrap($message, 70, "\r\n");

		mail('kevin.loo69@gmail.com, kjun.liu94@gmail.com', 'Email test', $message);
	}
	exit(); 
}

else if ($_SERVER['REQUEST_METHOD'] == "PUT") {
	$id = intval($path_components[1]);
	$pid = intval($path_components[2]);
	$qty = intval($path_components[3]);
	$query = "UPDATE tempcart SET quantity=$qty WHERE id=$id AND pid=$pid";
	if($conn->query($query) === TRUE) {
		echo "Record updated successfully";
	}
	else {
		echo $conn->error;
	}
	exit();
}

else if($_SERVER['REQUEST_METHOD'] == "DELETE") {
	$id = intval($path_components[1]);
	$query = "DELETE FROM tempcart WHERE pid=$id";
	$conn->query($query);
	exit();
}
?>