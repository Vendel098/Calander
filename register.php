<?php
session_start();

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "ikt_calander";

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

    if ($nev === "" || $felhasznalonev === "" || $email === "" || $jelszo === "") {
        $error = "Minden mező kitöltése kötelező!";
    } elseif ($jelszo !== $jelszo_confirm) {
        $error = "A jelszavak nem egyeznek meg!";
    } elseif (strlen($jelszo) < 6) {
        $error = "A jelszónak legalább 6 karakter hosszúnak kell lennie!";
    } else {
        // Ellenőrzések prepared statementtel
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $error = "Ez az e-mail cím már regisztrálva van!";
            $stmt->close();
        } else {
            $stmt->close();
            $stmt = $conn->prepare("SELECT id FROM users WHERE felhasznalonev = ?");
            $stmt->bind_param("s", $felhasznalonev);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) {
                $error = "Ez a felhasználónév már foglalt!";
                $stmt->close();
            } else {
                $stmt->close();
                $jelszo_hash = password_hash($jelszo, PASSWORD_DEFAULT);

                $insert = $conn->prepare("INSERT INTO users (nev, felhasznalonev, email, jelszo, regisztralva) VALUES (?, ?, ?, ?, NOW())");
                $insert->bind_param("ssss", $nev, $felhasznalonev, $email, $jelszo_hash);

                if ($insert->execute()) {
                    // Automatikus bejelentkeztetés: session beállítása
                    $new_user_id = $conn->insert_id;
                    $_SESSION['user_id'] = $new_user_id;
                    $_SESSION['nev'] = $nev;

                    $insert->close();
                    header("Location: main.php");
                    exit;
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
                <?php echo htmlspecialchars($error); ?>
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
                <input type="password" class="input-field" name="jelszo" id="jelszo" placeholder="Jelszó" autocomplete="off" required>
                <i class="fa-sharp fa-solid fa-eye-slash"></i>
                <div id="jelszo-warning" style="color: #721c24; font-size: 12px; margin-top: 5px; display: none;">
                    ⚠️ A jelszónak legalább 6 karakter hosszúnak kell lennie!
                </div>
            </div>

            <div class="input-box">
                <input type="password" class="input-field" name="jelszo_confirm" id="jelszo_confirm" placeholder="Jelszó megerősítése" autocomplete="off" required>
                <i class="fa-sharp fa-solid fa-eye-slash"></i>
            </div>

            <div class="input-submit">
                <button type="submit" class="submit-btn" id="submit"></button>
                <label for="submit">Regisztráció</label>
            </div>
        </form>

        <script>
            // Valós idejű jelszó validáció
            const jelszóInput = document.getElementById('jelszo');
            const jelszóWarning = document.getElementById('jelszo-warning');
            const formElement = document.querySelector('form');

            jelszóInput.addEventListener('input', function() {
                if (this.value.length < 6 && this.value.length > 0) {
                    jelszóWarning.style.display = 'block';
                } else {
                    jelszóWarning.style.display = 'none';
                }
            });

            // Form beküldés előtti validáció
            formElement.addEventListener('submit', function(e) {
                if (jelszóInput.value.length < 6) {
                    e.preventDefault();
                    jelszóWarning.style.display = 'block';
                    jelszóInput.focus();
                    return false;
                }
            });
        </script>

        <div class="sign-up-link">
            <p>Már van fiókod? <a href="login.php">Bejelentkezés</a></p>
        </div>

    </div>
</body>
</html>