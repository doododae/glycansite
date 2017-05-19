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
	$query = "SELECT compounds.id, Name, size, size_name, Price, quantity, Structure FROM compounds JOIN tempcart ON compounds.id = tempcart.pid";

	$result = $conn->query($query);

	$outp = "";
	while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
		if($outp != "") {
			$outp .= ",";
		}
		$outp .= '{"id":"'.$rs["id"].'",';
		$outp .= '"Name":"'.$rs["Name"].'",';
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
		$id = $_POST['id'];
		$name = $_POST['name'];
		$email = $_POST['email'];
		$shipAddress = $_POST['shipAddress'];
		$cartID = $_POST['cartID'];
		$query = "INSERT INTO customer_info VALUES ('$id', '$name', '$email', '$shipAddress', '$cartID')";
		$conn->query($query);

		$bid = $_POST['bid'];
		$institution = $_POST['institution'];
		$contact = $_POST['contact'];
		$contactEmail = $_POST['contactEmail'];
		$contactPhone = $_POST['contactPhone'];
		$billAddress = $_POST['billAddress'];
		$poNo = $_POST['poNo'];
		$billQuery = "INSERT INTO billing_info VALUES ('$bid', '$institution', '$contact', '$contactEmail', '$contactPhone', '$billAddress', '$poNo')";
		$conn->query($billQuery);

		$oid = $_POST['oid'];
		$cid = $_POST['cid'];
		$date = date(gmdate('Y-m-d h:i:s'));
		$invoiceQuery = "INSERT INTO orders VALUES ('$oid', '$cid', '$date')";
		$conn->query($invoiceQuery);

		$message = "Shipping Info\nName: ".$name."\nEmail: ".$email."Address: ".shipAddress."\nBilling Info\nInstitution: ".$institution."\nContact Name: ".$contact."\nContact Email: ".$contactEmail."\nContact Phone: ".$contactPhone."\nBilling Address: ".$billAddress;
		$message = wordwrap($message, 70, "\r\n");

		mail('kevin.loo69@gmail.com, kjun.liu94@gmail.com', 'Email test', $message);
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