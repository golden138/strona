function sprawdz(x) {
	var rozwiazanie = '/angielski/zadania/'+x+'/roz.txt';
	var gdzie = 'roz';
	var nr = '';
	for(var i = 3; i < x.length; i++) {
		gdzie += x.charAt(i);
		nr += x.charAt(i);
	}
	
	fetch(rozwiazanie, { cache: "no-store" }) // <-- tutaj wpisz adres pliku z zadaniem
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
		var json_format = JSON.parse(data);
		
		var rodzaj_zad = json_format.typ_zad;
		
		var odp = json_format.odp;
		
		
		if(rodzaj_zad.trim().toLowerCase() === 'slowo_wpisywanie') {
			document.getElementById(gdzie).innerHTML = sprawdzTextField(odp, nr);
		}
      //document.getElementById(gdzie).innerHTML = data;
    })
    .catch(error => {
      console.error('Wystąpił błąd:', error);
      document.getElementById(gdzie).innerText = 'Nie udało się pobrać rozwiązania.';
    });
    setTimeout(function() {
  	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 500);
}

function sprawdzTextField(x, y) { // x to odpowiedzi a y to nr
	var wynik = 0;
	var wyniki = '';
	for(var i = 0; i < x.length; i++) {
		var id_input = 'pole' + i + '_zad' + y;
		wyniki += przykladowaOdp_textField(x[i]);
		if(sprawdzTextField_One(x[i], id_input) === 1) {
			//console.log('Element: ' + id_input + ' OK');
			document.getElementById(id_input).style.backgroundColor = "#abebc6";
			wynik++;
		}else{
			//console.log('Element: ' + id_input + ' ERROR');
			document.getElementById(id_input).style.backgroundColor = "#f1948a";
		}
	}
	return '<p>Wynik: ' + wynik + ' na ' + x.length + ' punkty</p><p>Przykładowe odpowiedzi:</p>' + wyniki;
}

function sprawdzTextField_One(x, y) {
	var tablica = x.trim().split(';');
	var dane = document.getElementById(y).value;
	var wynik = 0;
	if (dane.trim() === "") {
      return 0;
    } else {
		for(var i = 0; i < tablica.length; i++) {
			if( porownajBezSpacjiILiter(tablica[i], dane)) {
				wynik = 1;
				i = tablica.length;
			}
		}
		return wynik;
    }
}

function przykladowaOdp_textField(x) {
	var tablica = x.trim().split(';');
	return '-> ' + tablica[0] + '</br>';
}

function porownajBezSpacjiILiter(a, b) {
  // Usuń nadmiarowe spacje i zamień na pojedyncze
  const normalize = str => str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' '); // zamienia wiele spacji na jedną

  return normalize(a) === normalize(b);
}

function zaladuj(x) {
	var tresc = '/angielski/zadania/'+x+'/zad.txt';
	var nr = '';
	for(var i = 3; i < x.length; i++) {
		nr += x.charAt(i);
	}
	fetch(tresc, { cache: "no-store" }) // <-- tutaj wpisz adres pliku z zadaniem
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
		var zdj;
		var dane;
		var json_format = JSON.parse(data);
		
		var rodzaj_zad = json_format.typ_zad;  // Przypisz poprawnie
		
		var polecenie = json_format.polecenie;
		
		var box_slowa = json_format.slowa;
		
		var tekst = json_format.tresc;
		//dane = '<div class="zad"><img src="img/ph-meter.png" />Zadanie ' + nr + '.</div><p>' + polecenie + '</p><div class="roz" onclick="sprawdz(\'zad'+ nr +'\');">Rozwiązani</div><div id="roz' + nr + '"></div>';
		if(rodzaj_zad.trim().toLowerCase() === 'slowo_wpisywanie') {
			dane = '<div class="zad"><img src="img/ph-meter.png" />Zadanie ' + nr + '.</div><p>' + polecenie + '</p>' + getSlowa(box_slowa) + '<div id="' + x + '_tresc"></div><div class="roz" onclick="sprawdz(\'zad'+ nr +'\');">Rozwiązanie</div><div id="roz' + nr + '"></div>';
		}
		
		document.getElementById(x).innerHTML = dane;
		getTresc(x);
		//console.log(rodzaj_zad);
    })
    .catch(error => {
		console.error('Wystąpił błąd:', error);
		document.getElementById(x).innerHTML = '<div class="zad">Zadanie ' + nr + '.</div><p>Nie udało się pobrać treści zadania</p>';
    });
}

function getSlowa(x) {
	var tablica = x.trim().split(';');
	var tresc = '<div class="dwie_linie"><ol>';
	for(var i = 0; i < tablica.length; i++) {
		//console.log(tablica[i]);
		tresc += '<li>'+tablica[i]+'</li>';
	}
	tresc += '</ol></div>';
	return tresc;
}

function getTresc(x) {
  const rozwiazanie = '/angielski/zadania/' + x + '/tresc.txt';

  fetch(rozwiazanie, { cache: "no-store" })
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(x+'_tresc').innerHTML = '<div class="wieksze">' + findTextField(data, x) + '</div>';
    })
    .catch(error => {
      console.error('Wystąpił błąd:', error);
      document.getElementById(x+'_tresc').innerHTML = '<div class="wieksze">Nie udało się załadować treści</div>';
    });
}

function findTextField(x, y) {
	var wynik = '<form class="tresc_zadan_form">';
	var nr = 0;
	var jest = 0;
	for(var i = 0; i < x.length; i++) {
		jest = 0;
		var tmp = x.charAt(i);
		if(tmp === '_') {
			if(i + 2 < x.length) {
				var tmp1 = x.charAt(i+1);
				var tmp2 = x.charAt(i+2);
				if((tmp1 === '_') && (tmp2 === '_')) {
					wynik += '<input type="text" id="pole' + nr + '_' + y + '" required>';
					nr++;
					jest = 1;
				}
			}
		}
		if(jest === 0) {
			wynik += tmp;
		}else{
			i += 2;
		}
	}
	wynik += '</form>'
	return wynik;
}

function start() {
	var gdzie = '/angielski/zadania/nr_zadan.txt';
	var tresc = '';
	fetch(gdzie) // <-- tutaj wpisz adres pliku z zadaniem
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
		var tablica = data.trim().split(/\s+/);
		for(var i = 0; i < tablica.length; i++) {
			console.log(tablica[i]);
			tresc += '<div id="'+tablica[i]+'"></div>';
		}
		document.getElementById("Wszystkie_zadania").innerHTML = tresc;
		for(var i = 0; i < tablica.length; i++) {
			zaladuj(tablica[i]);
		}
    })
    .catch(error => {
		console.error('Wystąpił błąd:', error);
    });
}

window.onload = start();