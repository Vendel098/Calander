<?php
session_start();

// Opcionális bejelentkezés kezelése
$nev = isset($_SESSION['nev']) ? htmlspecialchars($_SESSION['nev']) : "Vendég";
$be_van_jelentkezve = isset($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Naptár</title>
<link rel="stylesheet" href="main.css">
<script src="main.js" defer></script>
<script>
    const USER_LOGGED_IN = <?php echo $be_van_jelentkezve ? 'true' : 'false'; ?>;
</script>
</head>
<body>

<div class="navigacios-sav">
    <div class="navigacios-sav-bal">
        <div class="nezet-valaszto">
            <button class="nezet-gomb" id="gomb-nap" onclick="valasztottNezet('nap')">Nap</button>
            <button class="nezet-gomb" id="gomb-het" onclick="valasztottNezet('het')">Hét</button>
            <button class="nezet-gomb" id="gomb-honap" onclick="valasztottNezet('honap')">Hónap</button>
            <button class="nezet-gomb" id="gomb-ev" onclick="valasztottNezet('ev')">Év</button>
        </div>
    </div>
    
    <div class="navigacios-sav-jobb">
        <button class="beallitasok-gomb" onclick="beallitasokMegnyitasa()">Beállítások</button>
        <div class="profil-container">
            <button class="profil-gomb" id="profilGomb"><?php echo $nev; ?></button>
            <div class="profil-dropdown" id="profilDropdown">
                <?php if ($be_van_jelentkezve): ?>
                    <a class="dropdown-item" href="logout.php">Kijelentkezés</a>
                <?php else: ?>
                    <a class="dropdown-item bejelentkezes-link" href="login.php">Bejelentkezés</a>
                <?php endif; ?>
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
        <?php if ($be_van_jelentkezve): ?>
        <div class="esemeny-sablonok">
            <h3>Esemény sablonok</h3>
            <div class="sablon-lista">
                <div class="sablon-esemeny" data-szin="kek" draggable="true" ondragstart="drag(event, 'Szülinap', 'kek')">Szülinap</div>
                <div class="sablon-esemeny" data-szin="zold" draggable="true" ondragstart="drag(event, 'Utazás', 'zold')">Utazás</div>
                <div class="sablon-esemeny" data-szin="narancs" draggable="true" ondragstart="drag(event, 'Orvos', 'narancs')">Orvos</div>
                <div class="sablon-esemeny" data-szin="piros" draggable="true" ondragstart="drag(event, 'Egyéb', 'piros')">Egyéb</div>
                <div class="uj-esemeny" onclick="esemenyLetrehozas()">Esemény létrehozása</div>
            </div>
        </div>
        <?php endif; ?>
    </div>

    <div class="jobb-oldali-panel">
        <div class="nagy-naptar-fejlec">
            <h2 id="nagyHonapEv"></h2>
            <div class="nagy-naptar-nav">
                <button onclick="nagyNavigacio(-1)">◀</button>
                <button class="ma-gomb" onclick="nagyMaiNap()">Ma</button>
                <button onclick="nagyNavigacio(1)">▶</button>
            </div>
        </div>
        <div class="nagy-het-napok" id="nagyHetNapok"></div>
        <div class="nagy-napok" id="nagyNapok"></div>
    </div>
</div>

<div id="esemenyModal" class="esemeny-modal">
    <div class="esemeny-modal-tartalom">
        <div class="esemeny-modal-fejlec">
            <h3 id="esemenyModalCim">Esemény létrehozása</h3>
            <button class="esemeny-modal-bezaras" onclick="esemenyBezarasa()">&times;</button>
        </div>
        <div class="esemeny-modal-test">
            <div class="esemeny-form-csoport">
                <label>Esemény megnevezése</label>
                <input type="text" id="esemenyCim" placeholder="Pl. Megbeszélés">
            </div>
            <div class="esemeny-form-sor">
                <div class="esemeny-form-csoport">
                    <label>Dátum</label>
                    <input type="date" id="esemenyDatum">
                </div>
                <div class="esemeny-form-csoport">
                    <label>Időpont</label>
                    <input type="time" id="esemenyIdopont">
                </div>
            </div>
            <div class="esemeny-form-csoport">
                <label>Szín</label>
                <select id="esemenySzin">
                    <option value="kek">Kék</option>
                    <option value="zold">Zöld</option>
                    <option value="narancs">Narancs</option>
                    <option value="piros">Piros</option>
                    <option value="lila">Lila</option>
                </select>
            </div>
            <div class="esemeny-form-csoport">
                <label>Leírás</label>
                <textarea id="esemenyLeiras" rows="3" placeholder="További részletek..."></textarea>
            </div>
            <button class="esemeny-mentes-gomb" onclick="esemenyMentese()">Esemény mentése</button>
        </div>
    </div>
</div>

<div id="esemenyReszletekModal" class="modal">
    <div class="modal-tartalom">
        <div class="modal-fejlec">
            <h3 id="reszletekCim">Esemény részletei</h3>
            <button class="modal-bezaras" onclick="reszletekBezarasa()">&times;</button>
        </div>
        <div class="modal-test">
            <div id="reszletekTartalom"></div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="esemeny-mentes-gomb" style="background: #dc3545;" onclick="esemenyTorlese()">Törlés</button>
                <button class="esemeny-mentes-gomb" style="background: #6c757d;" onclick="reszletekBezarasa()">Bezárás</button>
            </div>
        </div>
    </div>
</div>

<div id="beallitasokModal" class="modal">
    <div class="modal-tartalom">
        <div class="modal-fejlec">
            <h3>Beállítások</h3>
            <button class="modal-bezaras" onclick="beallitasokBezarasa()">&times;</button>
        </div>
        <div class="modal-test">
            <div class="beallitas-elem">
                <span>Sötét mód</span>
                <div class="tema-valto">
                    <button class="tema-gomb vilagos-gomb" onclick="temaValtas('vilagos')">Világos</button>
                    <button class="tema-gomb sotet-gomb" onclick="temaValtas('sotet')">Sötét</button>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>