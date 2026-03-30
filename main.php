<?php
session_start();

// Ha nincs bejelentkezve a felhasználó, átirányítás a login oldalra
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$nev = htmlspecialchars($_SESSION['nev']);
?>
<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kalendárium</title>
<link rel="stylesheet" href="main.css">
<script src="main.js" defer></script>
</head>
<body>

<div class="navigacios-sav">
    <div class="navigacios-sav-bal">
        <div class="nezet-valaszto">
            <button class="nezet-gomb" onclick="valasztottNezet('nap')">Nap</button>
            <button class="nezet-gomb" onclick="valasztottNezet('het')">Hét</button>
            <button class="nezet-gomb aktiv" onclick="valasztottNezet('honap')">Hónap</button>
            <button class="nezet-gomb" onclick="valasztottNezet('ev')">Év</button>
        </div>
        
        <div class="kereses-mezo">
            <span>"icon"</span>
            <input type="text" id="keresesBevitel" placeholder="Keresés eseményekben">
        </div>
    </div>
    
    <div class="navigacios-sav-jobb">
        <button class="beallitasok-gomb" onclick="beallitasokMegnyitasa()">Beállítások</button>
        <div class="profil-container">
            <button class="profil-gomb"><?php echo $nev; ?></button>
            <div class="profil-dropdown">
                <a class="dropdown-item" href="logout.php">Kijelentkezés</a>
            </div>
        </div>
    </div>
</div>

<div class="fo-tartalom">
    <div class="bal-oldali-panel">
        <div class="mini-naptar">
            <div class="naptar-fejlec">
                <button onclick="miniElozoHonap()">◀</button>
                <h2 id="miniHonapEv"></h2>
                <button onclick="miniKovetkezoHonap()">▶</button>
            </div>
            <div class="het-napok">
                <div>H</div><div>K</div><div>Sze</div><div>Cs</div>
                <div>P</div><div>Szo</div><div>V</div>
            </div>
            <div class="napok" id="miniNapok"></div>
        </div>

        <div class="esemeny-sablonok">
            <h3>Esemény sablonok</h3>
            <div class="sablon-lista">
                <div class="sablon-esemeny" data-szin="kek" onclick="sablonEsemenyLetrehozas('Szülinap', 'kek')">Szülinap</div>
                <div class="sablon-esemeny" data-szin="zold" onclick="sablonEsemenyLetrehozas('Utazás', 'zold')">Utazás</div>
                <div class="sablon-esemeny" data-szin="narancs" onclick="sablonEsemenyLetrehozas('Orvos', 'narancs')">Orvos</div>
                <div class="sablon-esemeny" data-szin="piros" onclick="sablonEsemenyLetrehozas('Egyéb', 'piros')">Egyéb</div>
                <div class="uj-esemeny" onclick="esemenyLetrehozas()">Esemény létrehozása</div>
            </div>
        </div>
    </div>

    <div class="jobb-oldali-panel">
        <div class="nagy-naptar-fejlec">
            <h2 id="nagyHonapEv"></h2>
            <div class="nagy-naptar-nav">
                <button onclick="nagyElozoHonap()">◀</button>
                <button class="ma-gomb" onclick="nagyMaiNap()">Ma</button>
                <button onclick="nagyKovetkezoHonap()">▶</button>
            </div>
        </div>
        <div class="nagy-het-napok" id="nagyHetNapok">
            <div>Hétfő</div><div>Kedd</div><div>Szerda</div><div>Csütörtök</div>
            <div>Péntek</div><div>Szombat</div><div>Vasárnap</div>
        </div>
        <div class="nagy-napok" id="nagyNapok"></div>
    </div>
</div>

<!-- A modálok és egyéb elemek változatlanok, lásd eredeti main.html -->
<div id="beallitasokModal" class="modal"> ... </div>
<div id="esemenyModal" class="esemeny-modal"> ... </div>
<div id="esemenyReszletekModal" class="modal"> ... </div>

</body>
</html>