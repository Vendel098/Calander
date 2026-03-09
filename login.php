<?php
    $servername = "localhost";
    $username   = "root";
    $password   = "";
    $dbname     = "ikt_calander";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Conection error(szar vagy): " . $conn->connect_error);
    }

    $error   = "";
    $success = "";

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $email  = trim($_POST["email"] ?? "");
        $jelszo = $_POST["jelszo"] ?? "";

        if ($email === "" || $jelszo === "") {
            $error = "Töltsd ki az összes mezőt!";
        } else {
            // SQL injection elleni védelem
            $email = $conn->real_escape_string($email);
            
            $sql    = "SELECT * FROM users WHERE email='$email'";
            $result = $conn->query($sql);

            if ($result->num_rows === 0) {
                $error = "A megadott e-mail címmel nem létezik felhasználó.";
            } else {
                $user = $result->fetch_assoc();

                // Jelszó ellenőrzése hash-vel
                if (password_verify($jelszo, $user["jelszo"])) {
                    $success = "Sikeres bejelentkezés! Üdvözlöm, " . htmlspecialchars($user["nev"]) . "!";
                    // TODO: session indítása, redirect a főoldalra
                } else {
                    $error = "Rossz jelszó!";
                }
            }
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