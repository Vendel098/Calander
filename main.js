let aktualisEv = new Date().getFullYear();
let aktualisHonap = new Date().getMonth(); 
let aktualisNap = new Date().getDate();     

let esemenyek = {};
try {
    const mentett = localStorage.getItem('esemenyek');
    if (mentett) esemenyek = JSON.parse(mentett);
} catch(e) {}

let aktualisNezet = 'honap';
let kivalasztottDatum = null;
let aktualisTorlesDatum = null;
let aktualisTorlesIndex = null;

const honapNevekNagy = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];

// HTML5 Drag and Drop funkciók
function drag(ev, cim, szin) {
    ev.dataTransfer.setData("text/plain", JSON.stringify({ cim: cim, szin: szin }));
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev, datumKulcs) {
    ev.preventDefault();
    ev.stopPropagation();
    try {
        const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
        if (data && data.cim && data.szin) {
            kivalasztottDatum = datumKulcs;
            esemenyLetrehozas();
            document.getElementById("esemenyCim").value = data.cim;
            document.getElementById("esemenySzin").value = data.szin;
            document.getElementById("esemenyDatum").value = datumFormatum(datumKulcs);
        }
    } catch(e) { console.error(e); }
}

function datumFormatum(datumKulcs) {
    const reszek = datumKulcs.split('-');
    const ev = reszek[0];
    const honap = reszek[1].padStart(2, '0');
    const nap = reszek[2].padStart(2, '0');
    return `${ev}-${honap}-${nap}`;
}

// Google Naptár alapú renderelő
function nagyNaptarRajzolas() {
    const honapEvElem = document.getElementById("nagyHonapEv");
    const napokContainer = document.getElementById("nagyNapok");
    const hetNapokHeader = document.getElementById("nagyHetNapok");
    
    if (!honapEvElem || !napokContainer || !hetNapokHeader) return;

    document.querySelectorAll('.nezet-gomb').forEach(b => b.classList.remove('aktiv'));
    const aktivGomb = document.getElementById(`gomb-${aktualisNezet}`);
    if (aktivGomb) aktivGomb.classList.add('aktiv');

    const ma = new Date();

    if (aktualisNezet === 'honap') {
        hetNapokHeader.style.display = "grid";
        hetNapokHeader.innerHTML = "<div>Hétfő</div><div>Kedd</div><div>Szerda</div><div>Csütörtök</div><div>Péntek</div><div>Szombat</div><div>Vasárnap</div>";
        napokContainer.style.gridTemplateColumns = "repeat(7, 1fr)";
        
        honapEvElem.innerText = `${honapNevekNagy[aktualisHonap]} ${aktualisEv}`;
        napokContainer.innerHTML = "";

        let elsoNap = new Date(aktualisEv, aktualisHonap, 1).getDay();
        elsoNap = elsoNap === 0 ? 6 : elsoNap - 1;

        const napokSzama = new Date(aktualisEv, aktualisHonap + 1, 0).getDate();
        const elozoHonapNapok = new Date(aktualisEv, aktualisHonap, 0).getDate();

        for (let i = 0; i < elsoNap; i++) {
            const napSzam = elozoHonapNapok - elsoNap + i + 1;
            const m = aktualisHonap === 0 ? 11 : aktualisHonap - 1;
            const e = aktualisHonap === 0 ? aktualisEv - 1 : aktualisEv;
            let dk = `${e}-${m + 1}-${napSzam}`;
            napokContainer.appendChild(generalNagyNapDiv(napSzam, true, dk, ma));
        }

        for (let nap = 1; nap <= napokSzama; nap++) {
            let dk = `${aktualisEv}-${aktualisHonap + 1}-${nap}`;
            napokContainer.appendChild(generalNagyNapDiv(nap, false, dk, ma));
        }

        const osszesNap = elsoNap + napokSzama;
        const kovetkezoNapok = 42 - osszesNap;
        for (let i = 1; i <= kovetkezoNapok; i++) {
            const m = aktualisHonap === 11 ? 0 : aktualisHonap + 1;
            const e = aktualisHonap === 11 ? aktualisEv + 1 : aktualisEv;
            let dk = `${e}-${m + 1}-${i}`;
            napokContainer.appendChild(generalNagyNapDiv(i, true, dk, ma));
        }
    } 
    else if (aktualisNezet === 'het') {
        hetNapokHeader.style.display = "grid";
        hetNapokHeader.innerHTML = "<div>Hétfő</div><div>Kedd</div><div>Szerda</div><div>Csütörtök</div><div>Péntek</div><div>Szombat</div><div>Vasárnap</div>";
        napokContainer.style.gridTemplateColumns = "repeat(7, 1fr)";
        napokContainer.innerHTML = "";

        let d = new Date(aktualisEv, aktualisHonap, aktualisNap);
        let day = d.getDay();
        let diff = d.getDate() - day + (day == 0 ? -6 : 1);
        let hetElsoNapja = new Date(d.setDate(diff));

        honapEvElem.innerText = `${hetElsoNapja.getFullYear()} ${honapNevekNagy[hetElsoNapja.getMonth()]}`;

        for (let i = 0; i < 7; i++) {
            let futoNap = new Date(hetElsoNapja);
            futoNap.setDate(hetElsoNapja.getDate() + i);
            let dk = `${futoNap.getFullYear()}-${futoNap.getMonth() + 1}-${futoNap.getDate()}`;
            let napDiv = generalNagyNapDiv(futoNap.getDate(), futoNap.getMonth() !== aktualisHonap, dk, ma);
            napDiv.style.minHeight = "350px";
            napokContainer.appendChild(napDiv);
        }
    } 
    else if (aktualisNezet === 'nap') {
        hetNapokHeader.style.display = "none";
        napokContainer.style.gridTemplateColumns = "1fr";
        napokContainer.innerHTML = "";

        honapEvElem.innerText = `${aktualisEv}. ${honapNevekNagy[aktualisHonap]} ${aktualisNap}.`;
        let dk = `${aktualisEv}-${aktualisHonap + 1}-${aktualisNap}`;
        let napDiv = generalNagyNapDiv(aktualisNap, false, dk, ma);
        napDiv.style.minHeight = "400px";
        napokContainer.appendChild(napDiv);
    } 
    else if (aktualisNezet === 'ev') {
        hetNapokHeader.style.display = "none";
        napokContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
        napokContainer.innerHTML = "";
        honapEvElem.innerText = `${aktualisEv}`;

        for (let m = 0; m < 12; m++) {
            let honapDoboz = document.createElement("div");
            honapDoboz.className = "nagy-nap";
            honapDoboz.style.padding = "15px";
            honapDoboz.style.textAlign = "center";
            
            let hCim = document.createElement("h4");
            hCim.innerText = honapNevekNagy[m];
            hCim.style.color = "#fa276d";
            honapDoboz.appendChild(hCim);

            let darab = 0;
            for (let k in esemenyek) {
                if (k.startsWith(`${aktualisEv}-${m + 1}-`)) darab += esemenyek[k].length;
            }

            let hInf = document.createElement("p");
            hInf.style.fontSize = "12px";
            hInf.style.marginTop = "10px";
            hInf.innerText = darab > 0 ? ` ${darab} esemény` : "Nincs esemény";
            honapDoboz.appendChild(hInf);
            
            honapDoboz.onclick = () => {
                aktualisHonap = m;
                aktualisNezet = 'honap';
                miniNaptarRajzolas();
                nagyNaptarRajzolas();
            };
            napokContainer.appendChild(honapDoboz);
        }
    }
}

function generalNagyNapDiv(napSzam, masHonap, dk, ma) {
    const napDiv = document.createElement("div");
    napDiv.className = "nagy-nap" + (masHonap ? " mas-honap" : "");
    
    // Drag & Drop Dropzone tulajdonságok hozzáadása
    napDiv.setAttribute("ondragover", "allowDrop(event)");
    napDiv.setAttribute("ondrop", `drop(event, '${dk}')`);

    const reszek = dk.split('-');
    if (parseInt(reszek[2]) === ma.getDate() && (parseInt(reszek[1]) - 1) === ma.getMonth() && parseInt(reszek[0]) === ma.getFullYear()) {
        napDiv.classList.add("ma");
    }

    let esemenyHtml = `<div class="nap-szam">${napSzam}</div><div class="nagy-esemenyek">`;
    if (esemenyek[dk] && esemenyek[dk].length > 0) {
        esemenyek[dk].slice(0, 3).forEach((esemeny, i) => {
            esemenyHtml += `<div class="nagy-esemeny ${esemeny.szin}" onclick="event.stopPropagation(); esemenyReszletekMegjelenitese('${dk}', ${i});">${esemeny.cim}</div>`;
        });
        if (esemenyek[dk].length > 3) {
            esemenyHtml += `<div class="nagy-esemeny">+${esemenyek[dk].length - 3} további</div>`;
        }
    }
    esemenyHtml += `</div>`;
    napDiv.innerHTML = esemenyHtml;

    napDiv.onclick = function() {
        kivalasztottDatum = dk;
        aktualisNap = parseInt(reszek[2]);
        aktualisHonap = parseInt(reszek[1]) - 1;
        aktualisEv = parseInt(reszek[0]);
        esemenyLetrehozas();
    };
    return napDiv;
}

function nagyNavigacio(irany) {
    if (aktualisNezet === 'honap') {
        aktualisHonap += irany;
        if (aktualisHonap < 0) { aktualisHonap = 11; aktualisEv--; }
        if (aktualisHonap > 11) { aktualisHonap = 0; aktualisEv++; }
    } else if (aktualisNezet === 'het') {
        let d = new Date(aktualisEv, aktualisHonap, aktualisNap);
        d.setDate(d.getDate() + (irany * 7));
        aktualisEv = d.getFullYear();
        aktualisHonap = d.getMonth();
        aktualisNap = d.getDate();
    } else if (aktualisNezet === 'nap') {
        let d = new Date(aktualisEv, aktualisHonap, aktualisNap);
        d.setDate(d.getDate() + irany);
        aktualisEv = d.getFullYear();
        aktualisHonap = d.getMonth();
        aktualisNap = d.getDate();
    } else if (aktualisNezet === 'ev') {
        aktualisEv += irany;
    }
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
}

function valasztottNezet(nezet) {
    aktualisNezet = nezet;
    nagyNaptarRajzolas();
}

function nagyMaiNap() {
    const ma = new Date();
    aktualisEv = ma.getFullYear();
    aktualisHonap = ma.getMonth();
    aktualisNap = ma.getDate();
    kivalasztottDatum = `${aktualisEv}-${aktualisHonap+1}-${aktualisNap}`;
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
}

function miniNaptarRajzolas() {
    const honapEvElem = document.getElementById("miniHonapEv");
    const napokContainer = document.getElementById("miniNapok");
    if (!honapEvElem || !napokContainer) return;

    honapEvElem.innerText = `${honapNevekNagy[aktualisHonap]} ${aktualisEv}`;
    napokContainer.innerHTML = "";

    let elsoNap = new Date(aktualisEv, aktualisHonap, 1).getDay();
    elsoNap = elsoNap === 0 ? 6 : elsoNap - 1;
    const napokSzama = new Date(aktualisEv, aktualisHonap + 1, 0).getDate();
    const ma = new Date();

    for (let i = 0; i < elsoNap; i++) {
        napokContainer.appendChild(document.createElement("div"));
    }

    for (let nap = 1; nap <= napokSzama; nap++) {
        let napDiv = document.createElement("div");
        napDiv.innerText = nap;
        let dk = `${aktualisEv}-${aktualisHonap + 1}-${nap}`;
        
        if (esemenyek[dk] && esemenyek[dk].length > 0) {
            let jelolo = document.createElement("span");
            jelolo.className = "esemeny-jel";
            napDiv.appendChild(jelolo);
        }
        if (nap === ma.getDate() && aktualisHonap === ma.getMonth() && aktualisEv === ma.getFullYear()) {
            napDiv.classList.add("nap-jelolo");
        }
        napDiv.onclick = () => {
            aktualisNap = nap;
            kivalasztottDatum = dk;
            nagyNaptarRajzolas();
        };
        napokContainer.appendChild(napDiv);
    }
}

function miniElozoHonap() { aktualisHonap--; if (aktualisHonap < 0) { aktualisHonap = 11; aktualisEv--; } miniNaptarRajzolas(); nagyNaptarRajzolas(); }
function miniKovetkezoHonap() { aktualisHonap++; if (aktualisHonap > 11) { aktualisHonap = 0; aktualisEv++; } miniNaptarRajzolas(); nagyNaptarRajzolas(); }

function esemenyLetrehozas() {
    document.getElementById("esemenyModalCim").innerText = "Esemény létrehozása";
    document.getElementById("esemenyCim").value = "";
    document.getElementById("esemenyIdopont").value = "";
    document.getElementById("esemenyLeiras").value = "";
    document.getElementById("esemenySzin").value = "kek";
    
    if(!kivalasztottDatum) {
        kivalasztottDatum = `${aktualisEv}-${aktualisHonap+1}-${aktualisNap}`;
    }
    document.getElementById("esemenyDatum").value = datumFormatum(kivalasztottDatum);
    document.getElementById("esemenyModal").classList.add("megjelenit");
}

function esemenyBezarasa() { document.getElementById("esemenyModal").classList.remove("megjelenit"); }

function esemenyMentese() {
    const cim = document.getElementById("esemenyCim").value.trim();
    const datum = document.getElementById("esemenyDatum").value;
    const idopont = document.getElementById("esemenyIdopont").value;
    const szin = document.getElementById("esemenySzin").value;
    const leiras = document.getElementById("esemenyLeiras").value.trim();

    if (!cim || !datum) { alert("Cím és Dátum megadása kötelező!"); return; }

    const d = new Date(datum);
    const dk = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    if (!esemenyek[dk]) esemenyek[dk] = [];
    esemenyek[dk].push({ cim: cim, idopont: idopont, szin: szin, leiras: leiras });
    
    localStorage.setItem('esemenyek', JSON.stringify(esemenyek));
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
    esemenyBezarasa();
}

function esemenyReszletekMegjelenitese(datum, index) {
    const esemeny = esemenyek[datum][index];
    document.getElementById("reszletekCim").innerHTML = ` ${esemeny.cim}`;
    document.getElementById("reszletekTartalom").innerHTML = `
        <div style="margin-bottom: 12px;"><strong> Dátum:</strong> ${datum}</div>
        <div style="margin-bottom: 12px;"><strong> Időpont:</strong> ${esemeny.idopont || "Egész napos"}</div>
        <div style="margin-bottom: 12px;"><strong> Leírás:</strong> ${esemeny.leiras || "Nincs megadva"}</div>
        <div style="margin-bottom: 12px;"><strong> Szín:</strong> ${esemeny.szin}</div>
    `;
    aktualisTorlesDatum = datum;
    aktualisTorlesIndex = index;
    document.getElementById("esemenyReszletekModal").classList.add("megjelenit");
}

function reszletekBezarasa() { document.getElementById("esemenyReszletekModal").classList.remove("megjelenit"); }

function esemenyTorlese() {
    if (aktualisTorlesDatum && aktualisTorlesIndex !== null) {
        esemenyek[aktualisTorlesDatum].splice(aktualisTorlesIndex, 1);
        if (esemenyek[aktualisTorlesDatum].length === 0) delete esemenyek[aktualisTorlesDatum];
        localStorage.setItem('esemenyek', JSON.stringify(esemenyek));
        miniNaptarRajzolas();
        nagyNaptarRajzolas();
        reszletekBezarasa();
    }
}

function beallitasokMegnyitasa() { document.getElementById("beallitasokModal").classList.add("megjelenit"); }
function beallitasokBezarasa() { document.getElementById("beallitasokModal").classList.remove("megjelenit"); }

function temaValtas(tema) {
    if (tema === 'sotet') {
        document.body.classList.add('sotet-mod');
        localStorage.setItem('tema', 'sotet');
        document.querySelector('.tema-gomb.sotet-gomb').classList.add('aktiv');
        document.querySelector('.tema-gomb.vilagos-gomb').classList.remove('aktiv');
    } else {
        document.body.classList.remove('sotet-mod');
        localStorage.setItem('tema', 'vilagos');
        document.querySelector('.tema-gomb.vilagos-gomb').classList.add('aktiv');
        document.querySelector('.tema-gomb.sotet-gomb').classList.remove('aktiv');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
    
    const profilGomb = document.getElementById("profilGomb");
    const profilDropdown = document.getElementById("profilDropdown");
    
    if (profilGomb && profilDropdown) {
        profilGomb.addEventListener('click', function(e) {
            e.stopPropagation();
            profilDropdown.classList.toggle("mutat");
        });
    }

    window.onclick = function(event) {
        if (profilDropdown && profilDropdown.classList.contains("mutat") && event.target !== profilGomb) {
            profilDropdown.classList.remove("mutat");
        }
        const beallitasokModal = document.getElementById('beallitasokModal');
        const esemenyModal = document.getElementById('esemenyModal');
        const esemenyReszletekModal = document.getElementById('esemenyReszletekModal');
        
        if (event.target === beallitasokModal) beallitasokModal.classList.remove('megjelenit');
        if (event.target === esemenyModal) esemenyModal.classList.remove('megjelenit');
        if (event.target === esemenyReszletekModal) esemenyReszletekModal.classList.remove('megjelenit');
    };

    if (localStorage.getItem('tema') === 'sotet') {
        temaValtas('sotet');
    } else {
        temaValtas('vilagos');
    }
});