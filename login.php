<?php
session_start();

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "ikt_calander";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
}

$error   = "";
$success = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email  = trim($_POST["email"] ?? "");
    $jelszo = $_POST["jelszo"] ?? "";

    if ($email === "" || $jelszo === "") {
        $error = "Töltsd ki az összes mezőt!";
    } else {
        // Prepared statement a biztonságért
        $stmt = $conn->prepare("SELECT id, nev, jelszo FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $error = "A megadott e-mail címmel nem létezik felhasználó.";
        } else {
            $user = $result->fetch_assoc();

            if (password_verify($jelszo, $user["jelszo"])) {
                // Sikeres bejelentkezés: session beállítása és átirányítás
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['nev'] = $user['nev'];

                header("Location: main.php");
                exit;
            } else {
                $error = "Rossz jelszó!";
            }
        }

        $stmt->close();
    }
}
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="login.css">
    <script src="main.js" defer></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <title>Login</title>
</head>
<body>
    <div class="login-box">
        <div class="login-header">
            <h2>Bejelentkezés</h2>
        </div>

        <?php if ($success !== ""): ?>
            <div style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #c3e6cb;">
                <?php echo htmlspecialchars($success); ?>
            </div>
        <?php endif; ?>

        <?php if ($error !== ""): ?>
            <div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #f5c6cb;">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <div class="input-box">
                <input type="email" class="input-field" name="email" placeholder="Email" autocomplete="off" required>
            </div>

            <div class="input-box">
                <input type="password" class="input-field" name="jelszo" placeholder="Jelszó" autocomplete="off" required>
                <i class="fa-sharp fa-solid fa-eye-slash"></i>
            </div>
            
            <div class="input-submit">
                <button type="submit" class="submit-btn" id="submit"></button>
                <label for="submit">Bejelentkezés</label>
            </div>
        </form>

        <div class="sign-up-link">
            <p>Nincs fiókod? <a href="register.php">Regisztráció</a></p>
        </div>

    </div>
</body>
</html>