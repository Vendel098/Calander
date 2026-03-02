<?php
    $servername = "localhost";
    $username   = "root";
    $password   = "";
    $dbname     = "loginrendszer";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Kapcsolodasi hiba: " . $conn->connect_error);
    }

    $success = "";
    $error   = "";

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $nev              = trim($_POST["nev"] ?? "");
        $felhasznalonev   = trim($_POST["felhasznalonev"] ?? "");
        $email            = trim($_POST["email"] ?? "");
        $jelszo           = $_POST["jelszo"] ?? "";
        $jelszo_confirm   = $_POST["jelszo_confirm"] ?? "";

        // Ellenőrzések
        if ($nev === "" || $felhasznalonev === "" || $email === "" || $jelszo === "") {
            $error = "Minden mező kitöltése kötelező!";
        } elseif ($jelszo !== $jelszo_confirm) {
            $error = "A jelszavak nem egyeznek meg!";
        } elseif (strlen($jelszo) < 6) {
            $error = "A jelszónak legalább 6 karakter hosszúnak kell lennie!";
        } else {
            // Szanitáció SQL injection ellen
            $nev = $conn->real_escape_string($nev);
            $felhasznalonev = $conn->real_escape_string($felhasznalonev);
            $email = $conn->real_escape_string($email);

            // Ellenőrizze, hogy az email már létezik-e
            $check_email = $conn->query("SELECT * FROM users WHERE email='$email'");
            if ($check_email->num_rows > 0) {
                $error = "Ez az e-mail cím már regisztrálva van!";
            } else {
                // Ellenőrizze, hogy a felhasználónév már létezik-e
                $check_username = $conn->query("SELECT * FROM users WHERE felhasznalonev='$felhasznalonev'");
                if ($check_username->num_rows > 0) {
                    $error = "Ez a felhasználónév már foglalt!";
                } else {
                    // Jelszó hash-elése
                    $jelszo_hash = password_hash($jelszo, PASSWORD_DEFAULT);

                    // Beszúrás az adatbázisba az idő automatikus hozzáadásával
                    $sql = "INSERT INTO users (nev, felhasznalonev, email, jelszo, regisztralva) 
                            VALUES ('$nev', '$felhasznalonev', '$email', '$jelszo_hash', NOW())";

                    if ($conn->query($sql) === TRUE) {
                        $success = "Sikeres regisztráció! Most <a href='login.html'>bejelentkezhet</a>.";
                    } else {
                        $error = "Hiba: " . $conn->error;
                    }
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
    <title>Register</title>
    <link rel="stylesheet" href="login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <script src="main.js" defer></script>
</head>
<body>
    <div class="login-box">
        <div class="login-header">
            <header>Register</header>
        </div>

        <?php if ($success !== ""): ?>
            <div style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #c3e6cb;">
                <?php echo $success; ?>
            </div>
        <?php endif; ?>

        <?php if ($error !== ""): ?>
            <div style="background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #f5c6cb;">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="register.php">
            <div class="input-box">
                <input type="text" class="input-field" name="nev" placeholder="Teljes név" autocomplete="off" required>
            </div>

            <div class="input-box">
                <input type="text" class="input-field" name="felhasznalonev" placeholder="Felhasználónév" autocomplete="off" required>
            </div>

            <div class="input-box">
                <input type="email" class="input-field" name="email" placeholder="Email" autocomplete="off" required>
            </div>

            <div class="input-box">
                <input type="password" class="input-field" name="jelszo" placeholder="Jelszó" autocomplete="off" required>
                <i class="fa-sharp fa-solid fa-eye-slash"></i>
            </div>

            <div class="input-box">
                <input type="password" class="input-field" name="jelszo_confirm" placeholder="Jelszó megerősítése" autocomplete="off" required>
                <i class="fa-sharp fa-solid fa-eye-slash"></i>
            </div>

            <div class="input-submit">
                <button type="submit" class="submit-btn" id="submit"></button>
                <label for="submit">Regisztráció</label>
            </div>
        </form>

        <div class="sign-up-link">
            <p>Már van fiókod? <a href="login.html">Bejelentkezés</a></p>
        </div>

    </div>
</body>
</html>