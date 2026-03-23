let aktualisEv = new Date().getFullYear();
let aktualisHonap = new Date().getMonth();
let esemenyek = {};

try {
    const mentett = localStorage.getItem('esemenyek');
    if (mentett) {
        esemenyek = JSON.parse(mentett);
    }
} catch(e) {}

let aktualisNezet = 'honap';
let kivalasztottDatum = null;
let aktualisTorlesDatum = null;
let aktualisTorlesIndex = null;

function miniNaptarRajzolas() {
    const honapEvElem = document.getElementById("miniHonapEv");
    const napokContainer = document.getElementById("miniNapok");
    
    if (!honapEvElem || !napokContainer) return;

    const ev = aktualisEv;
    const honap = aktualisHonap;

    const honapNevek = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];

    honapEvElem.innerText = `${honapNevek[honap]} ${ev}`;
    napokContainer.innerHTML = "";

    let elsoNap = new Date(ev, honap, 1).getDay();
    elsoNap = elsoNap === 0 ? 6 : elsoNap - 1;

    const napokSzama = new Date(ev, honap + 1, 0).getDate();
    const ma = new Date();

    for (let i = 0; i < elsoNap; i++) {
        const ures = document.createElement("div");
        napokContainer.appendChild(ures);
    }

    for (let nap = 1; nap <= napokSzama; nap++) {
        let napDiv = document.createElement("div");
        napDiv.innerText = nap;
        
        let datumKulcs = `${ev}-${honap + 1}-${nap}`;
        
        if (esemenyek[datumKulcs] && esemenyek[datumKulcs].length > 0) {
            let jelolo = document.createElement("span");
            jelolo.className = "esemeny-jel";
            napDiv.appendChild(jelolo);
        }

        if (nap === ma.getDate() && honap === ma.getMonth() && ev === ma.getFullYear()) {
            napDiv.classList.add("nap-jelolo");
        }
        
        napDiv.onclick = (function(e, m, n) {
            return function() { nagyNaptarUgras(e, m, n); };
        })(ev, honap, nap);
        
        napokContainer.appendChild(napDiv);
    }
}

function nagyNaptarRajzolas() {
    const honapEvElem = document.getElementById("nagyHonapEv");
    const napokContainer = document.getElementById("nagyNapok");
    
    if (!honapEvElem || !napokContainer) return;

    const ev = aktualisEv;
    const honap = aktualisHonap;

    const honapNevek = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
    honapEvElem.innerText = `${honapNevek[honap]} ${ev}`;
    napokContainer.innerHTML = "";

    let elsoNap = new Date(ev, honap, 1).getDay();
    elsoNap = elsoNap === 0 ? 6 : elsoNap - 1;

    const napokSzama = new Date(ev, honap + 1, 0).getDate();
    const elozoHonapNapok = new Date(ev, honap, 0).getDate();
    const ma = new Date();

    for (let i = 0; i < elsoNap; i++) {
        const napDiv = document.createElement("div");
        napDiv.className = "nagy-nap mas-honap";
        const napSzam = elozoHonapNapok - elsoNap + i + 1;
        napDiv.innerHTML = `<div class="nap-szam">${napSzam}</div><div class="nagy-esemenyek"></div>`;
        napDiv.onclick = (function(e, m, n) {
            return function() { 
                const elozoEv = m === 0 ? e - 1 : e;
                const elozoHonap = m === 0 ? 11 : m - 1;
                nagyNaptarUgras(elozoEv, elozoHonap, n);
            };
        })(ev, honap, napSzam);
        napokContainer.appendChild(napDiv);
    }

    for (let nap = 1; nap <= napokSzama; nap++) {
        let napDiv = document.createElement("div");
        napDiv.className = "nagy-nap";
        
        let datumKulcs = `${ev}-${honap + 1}-${nap}`;
        
        if (nap === ma.getDate() && honap === ma.getMonth() && ev === ma.getFullYear()) {
            napDiv.classList.add("ma");
        }
        
        let esemenyHtml = `<div class="nap-szam">${nap}</div><div class="nagy-esemenyek">`;
        if (esemenyek[datumKulcs] && esemenyek[datumKulcs].length > 0) {
            esemenyek[datumKulcs].slice(0, 3).forEach(esemeny => {
                esemenyHtml += `<div class="nagy-esemeny ${esemeny.szin}">${esemeny.cim}</div>`;
            });
            if (esemenyek[datumKulcs].length > 3) {
                esemenyHtml += `<div class="nagy-esemeny">+${esemenyek[datumKulcs].length - 3} további</div>`;
            }
        }
        esemenyHtml += `</div>`;
        napDiv.innerHTML = esemenyHtml;
        
        napDiv.onclick = (function(e, m, n, dk) {
            return function() { napKivalasztasa(e, m + 1, n, dk); };
        })(ev, honap, nap, datumKulcs);
        
        napokContainer.appendChild(napDiv);
    }

    const osszesNap = elsoNap + napokSzama;
    const kovetkezoNapok = 42 - osszesNap;
    for (let i = 1; i <= kovetkezoNapok; i++) {
        const napDiv = document.createElement("div");
        napDiv.className = "nagy-nap mas-honap";
        napDiv.innerHTML = `<div class="nap-szam">${i}</div><div class="nagy-esemenyek"></div>`;
        napDiv.onclick = (function(e, m, n) {
            return function() { 
                const kovEv = m === 11 ? e + 1 : e;
                const kovHonap = m === 11 ? 0 : m + 1;
                nagyNaptarUgras(kovEv, kovHonap, n);
            };
        })(ev, honap, i);
        napokContainer.appendChild(napDiv);
    }
}

function nagyNaptarUgras(ev, honap, nap) {
    aktualisEv = ev;
    aktualisHonap = honap;
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
    
    const datumKulcs = `${ev}-${honap + 1}-${nap}`;
    napKivalasztasa(ev, honap + 1, nap, datumKulcs);
}

function napKivalasztasa(ev, honap, nap, datumKulcs) {
    kivalasztottDatum = datumKulcs;
    const honapNevek = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];
    
    const nagyHonapEv = document.getElementById("nagyHonapEv");
    if (nagyHonapEv) {
        const honapNevekNagy = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
        nagyHonapEv.innerText = `${honapNevekNagy[honap-1]} ${ev}`;
    }
    
    esemenyekMegjelenitese(datumKulcs);
}

function esemenyekMegjelenitese(datum) {
    const esemenyListaElem = document.getElementById("esemenyLista");
    if (!esemenyListaElem) return;
    
    esemenyListaElem.innerHTML = "";
    
    if (!esemenyek[datum] || esemenyek[datum].length === 0) {
        esemenyListaElem.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 20px;">✨ Nincs esemény ezen a napon</div>';
        return;
    }
    
    esemenyek[datum].forEach((esemeny, index) => {
        const kartya = document.createElement("div");
        kartya.className = `esemeny-kartya ${esemeny.szin}`;
        kartya.onclick = () => esemenyReszletekMegjelenitese(datum, index);
        
        kartya.innerHTML = `
            <div class="esemeny-cim">${esemeny.cim}</div>
            <div class="esemeny-idopont">🕒 ${esemeny.idopont || "Egész napos"}</div>
            <div class="esemeny-leiras">${esemeny.leiras || "Nincs leírás"}</div>
        `;
        
        esemenyListaElem.appendChild(kartya);
    });
}

function esemenyReszletekMegjelenitese(datum, index) {
    const esemeny = esemenyek[datum][index];
    document.getElementById("reszletekCim").innerHTML = `📌 ${esemeny.cim}`;
    document.getElementById("reszletekTartalom").innerHTML = `
        <div style="margin-bottom: 12px;"><strong>📅 Dátum:</strong> ${datum}</div>
        <div style="margin-bottom: 12px;"><strong>🕒 Időpont:</strong> ${esemeny.idopont || "Egész napos"}</div>
        <div style="margin-bottom: 12px;"><strong>📝 Leírás:</strong> ${esemeny.leiras || "Nincs megadva"}</div>
        <div style="margin-bottom: 12px;"><strong>🎨 Szín:</strong> ${esemeny.szin}</div>
    `;
    
    aktualisTorlesDatum = datum;
    aktualisTorlesIndex = index;
    
    document.getElementById("esemenyReszletekModal").classList.add("megjelenit");
}

function esemenyTorlese() {
    if (aktualisTorlesDatum && aktualisTorlesIndex !== null) {
        esemenyek[aktualisTorlesDatum].splice(aktualisTorlesIndex, 1);
        
        if (esemenyek[aktualisTorlesDatum].length === 0) {
            delete esemenyek[aktualisTorlesDatum];
        }
        
        localStorage.setItem('esemenyek', JSON.stringify(esemenyek));
        miniNaptarRajzolas();
        nagyNaptarRajzolas();
        
        if (kivalasztottDatum) {
            esemenyekMegjelenitese(kivalasztottDatum);
        }
        
        reszletekBezarasa();
    }
}

function miniElozoHonap() {
    aktualisHonap--;
    if (aktualisHonap < 0) {
        aktualisHonap = 11;
        aktualisEv--;
    }
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
}

function miniKovetkezoHonap() {
    aktualisHonap++;
    if (aktualisHonap > 11) {
        aktualisHonap = 0;
        aktualisEv++;
    }
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
}

function nagyElozoHonap() {
    aktualisHonap--;
    if (aktualisHonap < 0) {
        aktualisHonap = 11;
        aktualisEv--;
    }
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
}

function nagyKovetkezoHonap() {
    aktualisHonap++;
    if (aktualisHonap > 11) {
        aktualisHonap = 0;
        aktualisEv++;
    }
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
}

function nagyMaiNap() {
    const ma = new Date();
    aktualisEv = ma.getFullYear();
    aktualisHonap = ma.getMonth();
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
    
    const datumKulcs = `${aktualisEv}-${aktualisHonap + 1}-${ma.getDate()}`;
    napKivalasztasa(aktualisEv, aktualisHonap + 1, ma.getDate(), datumKulcs);
}

function valasztottNezet(nezet) {
    aktualisNezet = nezet;
    const gombok = document.querySelectorAll('.nezet-gomb');
    if (gombok) {
        gombok.forEach(gomb => {
            gomb.classList.remove('aktiv');
            if (gomb.innerText.toLowerCase() === nezet || 
                (nezet === 'honap' && gomb.innerText === 'Hónap') ||
                (nezet === 'het' && gomb.innerText === 'Hét') ||
                (nezet === 'nap' && gomb.innerText === 'Nap') ||
                (nezet === 'ev' && gomb.innerText === 'Év')) {
                gomb.classList.add('aktiv');
            }
        });
    }
    
    if (nezet === 'honap') {
        nagyNaptarRajzolas();
    } else {
        try {
            alert(nezet + ' nézet hamarosan elérhető');
        } catch(e) {}
    }
}

function beallitasokMegnyitasa() {
    const modal = document.getElementById('beallitasokModal');
    if (modal) modal.classList.add('megjelenit');
}

function beallitasokBezarasa() {
    const modal = document.getElementById('beallitasokModal');
    if (modal) modal.classList.remove('megjelenit');
}

function temaBeallitasa(tema) {
    try {
        if (tema === 'sotet') {
            document.body.classList.add('sotet-mod');
            localStorage.setItem('tema', 'sotet');
        } else {
            document.body.classList.remove('sotet-mod');
            localStorage.setItem('tema', 'vilagos');
        }
        
        const vilagosGomb = document.querySelector('.tema-gomb.vilagos-gomb');
        const sotetGomb = document.querySelector('.tema-gomb.sotet-gomb');
        
        if (vilagosGomb && sotetGomb) {
            if (tema === 'sotet') {
                vilagosGomb.classList.remove('aktiv');
                sotetGomb.classList.add('aktiv');
            } else {
                sotetGomb.classList.remove('aktiv');
                vilagosGomb.classList.add('aktiv');
            }
        }
    } catch(e) {}
}

function belepes() {
    try {
        alert('Belépés funkció hamarosan elérhető!');
    } catch(e) {}
}

function regisztracio() {
    try {
        alert('Regisztráció funkció hamarosan elérhető!');
    } catch(e) {}
}

function sablonEsemenyLetrehozas(cim, szin) {
    const ma = new Date();
    const ev = ma.getFullYear();
    const honap = String(ma.getMonth() + 1).padStart(2, '0');
    const nap = String(ma.getDate()).padStart(2, '0');
    
    const cimInput = document.getElementById('esemenyCim');
    const szinSelect = document.getElementById('esemenySzin');
    const datumInput = document.getElementById('esemenyDatum');
    const idopontInput = document.getElementById('esemenyIdopont');
    const leirasInput = document.getElementById('esemenyLeiras');
    
    if (cimInput) cimInput.value = cim;
    if (szinSelect) szinSelect.value = szin;
    if (datumInput) datumInput.value = `${ev}-${honap}-${nap}`;
    if (idopontInput) idopontInput.value = '12:00';
    if (leirasInput) leirasInput.value = '';
    
    const modal = document.getElementById('esemenyModal');
    if (modal) modal.classList.add('megjelenit');
}

function esemenyLetrehozas() {
    const ma = new Date();
    const ev = ma.getFullYear();
    const honap = String(ma.getMonth() + 1).padStart(2, '0');
    const nap = String(ma.getDate()).padStart(2, '0');
    
    const cimInput = document.getElementById('esemenyCim');
    const leirasInput = document.getElementById('esemenyLeiras');
    const datumInput = document.getElementById('esemenyDatum');
    const idopontInput = document.getElementById('esemenyIdopont');
    const szinSelect = document.getElementById('esemenySzin');
    
    if (cimInput) cimInput.value = '';
    if (leirasInput) leirasInput.value = '';
    if (datumInput) datumInput.value = `${ev}-${honap}-${nap}`;
    if (idopontInput) idopontInput.value = '12:00';
    if (szinSelect) szinSelect.value = 'kek';
    
    const modal = document.getElementById('esemenyModal');
    if (modal) modal.classList.add('megjelenit');
}

function esemenyBezarasa() {
    const modal = document.getElementById('esemenyModal');
    if (modal) modal.classList.remove('megjelenit');
}

function reszletekBezarasa() {
    const modal = document.getElementById('esemenyReszletekModal');
    if (modal) modal.classList.remove('megjelenit');
}

function esemenyMentese() {
    const cimInput = document.getElementById('esemenyCim');
    const leirasInput = document.getElementById('esemenyLeiras');
    const datumInput = document.getElementById('esemenyDatum');
    const idopontInput = document.getElementById('esemenyIdopont');
    const szinSelect = document.getElementById('esemenySzin');
    
    if (!cimInput || !datumInput) return;
    
    const cim = cimInput.value.trim();
    const leiras = leirasInput ? leirasInput.value.trim() : '';
    const datum = datumInput.value;
    const idopont = idopontInput ? idopontInput.value : '';
    const szin = szinSelect ? szinSelect.value : 'kek';
    
    if (!cim) {
        alert('Kérlek add meg az esemény címét!');
        return;
    }
    
    if (!datum) {
        alert('Kérlek válassz dátumot!');
        return;
    }
    
    const ujEsemeny = {
        cim: cim,
        leiras: leiras,
        idopont: idopont,
        szin: szin,
        letrehozasDatum: new Date().toISOString()
    };
    
    if (!esemenyek[datum]) {
        esemenyek[datum] = [];
    }
    
    esemenyek[datum].push(ujEsemeny);
    localStorage.setItem('esemenyek', JSON.stringify(esemenyek));
    
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
    
    if (kivalasztottDatum === datum) {
        esemenyekMegjelenitese(datum);
    }
    
    esemenyBezarasa();
}

function keresesEsemenyekben() {
    const keresoSzovegInput = document.getElementById('keresesBevitel');
    if (!keresoSzovegInput) return;
    
    const keresoSzoveg = keresoSzovegInput.value.toLowerCase().trim();
    const esemenyListaElem = document.getElementById('esemenyLista');
    
    if (!esemenyListaElem) return;
    
    if (!keresoSzoveg) {
        if (kivalasztottDatum) {
            esemenyekMegjelenitese(kivalasztottDatum);
        } else {
            esemenyListaElem.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 20px;">🔍 Kezdj el keresni az események között</div>';
        }
        return;
    }
    
    const talaltEsemenyek = [];
    
    for (const [datum, esemenyTomb] of Object.entries(esemenyek)) {
        esemenyTomb.forEach((esemeny) => {
            if (esemeny.cim.toLowerCase().includes(keresoSzoveg) || 
                (esemeny.leiras && esemeny.leiras.toLowerCase().includes(keresoSzoveg))) {
                talaltEsemenyek.push({
                    datum: datum,
                    esemeny: esemeny
                });
            }
        });
    }
    
    if (talaltEsemenyek.length === 0) {
        esemenyListaElem.innerHTML = '<div style="text-align: center; color: #9ca3af; padding: 20px;">🔍 Nincs találat a keresésre</div>';
        return;
    }
    
    esemenyListaElem.innerHTML = '<div style="margin-bottom: 15px; font-weight: 600;">🔍 Találatok:</div>';
    
    talaltEsemenyek.forEach(talalt => {
        const kartya = document.createElement("div");
        kartya.className = `esemeny-kartya ${talalt.esemeny.szin}`;
        kartya.onclick = () => {
            kivalasztottDatum = talalt.datum;
            const [ev, honap, nap] = talalt.datum.split('-');
            const honapNevek = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];
            
            const nagyHonapEv = document.getElementById("nagyHonapEv");
            if (nagyHonapEv) {
                const honapNevekNagy = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
                nagyHonapEv.innerText = `${honapNevekNagy[parseInt(honap)-1]} ${ev}`;
            }
            
            esemenyekMegjelenitese(talalt.datum);
            
            const keresMezo = document.getElementById('keresesBevitel');
            if (keresMezo) keresMezo.value = '';
            keresesEsemenyekben();
        };
        
        kartya.innerHTML = `
            <div class="esemeny-cim">📌 ${talalt.esemeny.cim}</div>
            <div class="esemeny-idopont">📅 ${talalt.datum} | 🕒 ${talalt.esemeny.idopont || "Egész napos"}</div>
            <div class="esemeny-leiras">${talalt.esemeny.leiras || "Nincs leírás"}</div>
        `;
        
        esemenyListaElem.appendChild(kartya);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    miniNaptarRajzolas();
    nagyNaptarRajzolas();
    
    const mentettTema = localStorage.getItem('tema');
    if (mentettTema === 'sotet') {
        document.body.classList.add('sotet-mod');
        const sotetGomb = document.querySelector('.tema-gomb.sotet-gomb');
        if (sotetGomb) sotetGomb.classList.add('aktiv');
    } else {
        const vilagosGomb = document.querySelector('.tema-gomb.vilagos-gomb');
        if (vilagosGomb) vilagosGomb.classList.add('aktiv');
    }
    
    const keresMezo = document.getElementById('keresesBevitel');
    if (keresMezo) {
        keresMezo.addEventListener('input', keresesEsemenyekben);
    }
    
    const ma = new Date();
    const datumKulcs = `${ma.getFullYear()}-${ma.getMonth() + 1}-${ma.getDate()}`;
    napKivalasztasa(ma.getFullYear(), ma.getMonth() + 1, ma.getDate(), datumKulcs);
});

window.onclick = function(event) {
    const beallitasokModal = document.getElementById('beallitasokModal');
    const esemenyModal = document.getElementById('esemenyModal');
    const reszletekModal = document.getElementById('esemenyReszletekModal');
    
    if (event.target === beallitasokModal) {
        beallitasokBezarasa();
    }
    
    if (event.target === esemenyModal) {
        esemenyBezarasa();
    }
    
    if (event.target === reszletekModal) {
        reszletekBezarasa();
    }
}