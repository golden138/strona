var tytul_artykul = "";

//**************************************  Edycja Tytuł  *******************************

// pobierz elementy z HTML-a
const pole_tytul_a = document.getElementById('tytul_artykul');

// nasłuchuj zmian w polu
pole_tytul_a.addEventListener("input", function() {
  const wartosc = pole_tytul_a.value;
  document.getElementById('info_tytul_artykul').innerHTML = '<h1>' + wartosc + '</h1>';
});

//************************************* Elementy artykulu  ****************************
var container_edycja = document.getElementById("kontener");

function getStruktura(t , w) {
	var wynik = '<div class="entry"><div class="entrytxt2"><h2>' + t + '</h2>' + formatTresc2(w) + '</div></div>';
	return wynik;
}

container_edycja.addEventListener("input", function(e) {
    if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        // ID elementu, który wywołał zdarzenie
        var nr = getNumer(e.target.id);
		if(nr !== null) {
			console.log("Zdarzenie pochodzi z input o id:", nr);
			var nazwa = "podglad_" + nr;
			var tmp1 = "nazwaPunkt_" + nr;
			var tmp2 = "trescPunkt_" + nr;
			var tP = document.getElementById(tmp1).value;
			var wP = document.getElementById(tmp2).value;
			wP = changeFormat(wP) + '\r\n\r\n';
			console.log(wP);
			console.log(formatTresc2(wP));
			document.getElementById(nazwa).innerHTML = getStruktura(tP , wP);
		}
    }
});

//tabulacja w TEXTAREA
document.addEventListener("keydown", function(e) {
    // sprawdzamy, czy naciśnięto Tab w textarea
    if (e.target.tagName === "TEXTAREA" && e.key === "Tab") {
        e.preventDefault(); // zapobiega przejściu do następnego elementu

        // pobierz bieżącą pozycję kursora
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;

        // wstaw tabulator
        var value = e.target.value;
        e.target.value = value.substring(0, start) + "\t" + value.substring(end);

        // przesuń kursor o jeden znak po wstawieniu
        e.target.selectionStart = e.target.selectionEnd = start + 1;
    }
});

function getNumer(id) {
    // sprawdzamy, czy id zawiera "_"
    if (!id.includes("_")) return null;

    // dzielimy po "_"
    let parts = id.split("_");

    // ostatnia część to numer
    let numer = Number(parts[parts.length - 1]);

    // sprawdzamy, czy to rzeczywiście liczba
    if (isNaN(numer)) return null;

    return numer;
}

//*************************************  Dodanie DIV **********************************
var lista_div = [];
const ogolnaStruktura = '<div class="entry"><div class="entrytext2"></div></div>';

function get_nr_new() {
	var wynik = 255;
	for(var i = 0; i < 64; i++) {
		if (!lista_div.includes(i)) {
			wynik = i;
			break;
		}
	}
	return wynik;
}

function addDiv_edycja() {
	var nr = get_nr_new();
	if(nr !== 255) {
			
		// Tworzymy nowego diva
		var nazwa = "div_nr_" + nr;
		var newDiv = document.createElement("div");
		newDiv.id = nazwa;
		newDiv.className = "box";
		// Wstawiamy label i input
		zawartosc = '<div style="float: right;" onclick="usun_edycja(' + nr + ');"><img src="/strona/img/delete.png"/></div><div class="pole_edycja"><label for="nazwaPunkt_' + nr + '"># Podaj nazwe punktu : </label><input type="text" id="nazwaPunkt_' + nr + '" class="tt"></div><div class="pole_edycja"><textarea id="trescPunkt_' + nr + '" class="tt2" rows="6" placeholder="Wpisz treść..."></textarea></div><div id="podglad_' + nr + '"></div>';
		newDiv.innerHTML = zawartosc + '<hr>';
		// Dodajemy nowy div do kontenera
		kontener.appendChild(newDiv);
		lista_div.push(nr);
	} else {
		
	}
}

function usun_edycja(x) {
	//usuwam z listy element o numerze x
	var index = lista_div.indexOf(x);
	
	if (index !== -1) {
		lista_div.splice(index, 1); // usuwa 1 element na tym indeksie
		var nazwa = "div_nr_" + x;
		console.log("usuwam : " + nazwa); 
		var rmdiv = document.getElementById(nazwa);
		if (rmdiv && rmdiv.parentNode) {
			rmdiv.parentNode.removeChild(rmdiv); // działa w każdej przeglądarce
		}
	}
}