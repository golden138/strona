var path = '/Fotonika/OOA';
var maksSize = 0;
var scriptsToLoad = [];
var zadToLoad = [];

function setPath(p) {
	path = p;
}

function setMaksSize(x) {
	maksSize = x;
}

function sprawdz(x) {
	var rozwiazanie = path + '/zadania/'+x+'/roz.txt';
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
		
		if(rodzaj_zad === 'normalne') {
			document.getElementById(gdzie).innerHTML = odp;
		}
		
		if(rodzaj_zad === 'wynik') {
			var odp1 = json_format.odp1;
			document.getElementById(gdzie).innerHTML = sprawdzTextField(odp1, nr) + '</br></br>' + odp;
		}
		
		if(rodzaj_zad === 'abc') {
			document.getElementById(gdzie).innerHTML = sprawdzRadio(odp, nr);
		}
		
		if(rodzaj_zad === 'podpowiedz') {
			//document.getElementById(gdzie).innerHTML = sprawdzRadio(odp, nr);
		}
      //document.getElementById(gdzie).innerHTML = data;//
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
    var element = document.getElementById(y);
    if (!element) {
        console.error("Nie znaleziono elementu o id:", y);
        return 0; // lub inna wartość domyślna
    }

    var dane = element.value;
    if (dane === null) {
        dane = ' ';
    }

    var wynik = 0;
    if (dane.trim() === "") {
        return 0;
    } else {
        for (var i = 0; i < tablica.length; i++) {
            if (porownajBezSpacjiILiter(tablica[i], dane)) {
                wynik = 1;
                break; // przerywamy pętlę
            }
        }
        return wynik;
    }
}

/*function sprawdzTextField_One(x, y) {
	var tablica = x.trim().split(';');
	var dane = document.getElementById(y).value;
	if(dane === null) {
		dane = ' ';
	}
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
}*/

function sprawdzRadio(x, y) { // x to odpowiedzi a y to nr
	var wynik = 0;
	var wyniki = '';
	for(var i = 0; i < x.length; i++) {
		var id_input = 'p' + i + '_zad' + y;
		//console.log(id_input);
		wyniki += przykladowaOdp_textField(x[i]);
		if(sprawdzRadio_One(x[i], id_input) === 1) {
			//console.log('Element: ' + id_input + ' OK');
			//document.getElementById(id_input).style.backgroundColor = "#abebc6";
			wynik++;
		}else{
			//console.log('Element: ' + id_input + ' ERROR');
			//document.getElementById(id_input).style.backgroundColor = "#f1948a";
		}
	}
	return '<p>Wynik: ' + wynik + ' na ' + x.length + ' punkty</p><p>Przykładowe odpowiedzi:</p>' + wyniki;
}

function sprawdzRadio_One(x, y) {
	var tablica = x.trim().split(';');
	//var dane = document.getElementById(y).value;
	var wynik = 0;
	var selected = document.querySelector('input[name="'+y+'"]:checked');
	console.log('input[name="'+y+'"]:checked');
	if (selected) {
		var dane = selected.value;
		console.log("Zaznaczony: " + dane);
		for(var i = 0; i < tablica.length; i++) {
			if( porownajBezSpacjiILiter(tablica[i], dane)) {
				wynik = 1;
				i = tablica.length;
			}
		}
	}
	return wynik;
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
	var tresc = path + '/zadania/'+x+'/zad.txt';
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
		if(rodzaj_zad === 'slowo_wpisywanie') {
			dane = '<div class="zad"><img src="/strona/img/online-learning.png" />Zadanie ' + nr + '.</div><p>' + polecenie + '</p>' + getSlowa(box_slowa) + '<div id="' + x + '_tresc"></div><div class="roz" onclick="zaladuj(\'zad'+ nr +'\');">Jeszcze raz</div><div class="roz" onclick="sprawdz(\'zad'+ nr +'\');">Rozwiązanie</div><div id="roz' + nr + '"></div>';
			document.getElementById(x).innerHTML = dane;
			getTresc(x);
		}
		
		if(rodzaj_zad === 'abc') {
			dane = '<div class="zad"><img src="/strona/img/online-learning.png" />Zadanie ' + nr + '.</div><p>' + polecenie + '</p><div id="' + x + '_tresc"></div><div class="roz" onclick="zaladuj(\'zad'+ nr +'\');">Jeszcze raz</div><div class="roz" onclick="sprawdz(\'zad'+ nr +'\');">Rozwiązanie</div><div id="roz' + nr + '"></div>';
			document.getElementById(x).innerHTML = dane;
			getTrescRadio(x);
			console.log("OK");
		}
		
		if(rodzaj_zad === 'podpowiedz') {
			dane = '<div class="zad"><img src="/strona/img/online-learning.png" />Zadanie ' + nr + '.</div><p>' + polecenie + '</p><div id="' + x + '_tresc"></div><div class="roz" onclick="zaladuj(\'zad'+ nr +'\');">Jeszcze raz</div>';
			document.getElementById(x).innerHTML = dane;
			getTrescPodpowiedz(x);
			console.log("OK");
		}
		
		if(rodzaj_zad === 'normalne') {
			dane = '<div class="zad"><img src="/strona/img/online-learning.png" />Zadanie ' + nr + '.</div><p>' + polecenie + '</p><div id="' + x + '_tresc"></div><div class="roz" onclick="zaladuj(\'zad'+ nr +'\');">Jeszcze raz</div><div class="roz" onclick="sprawdz(\'zad'+ nr +'\');">Rozwiązanie</div><div id="roz' + nr + '"></div>';
			document.getElementById(x).innerHTML = dane;
			//getTrescRadio(x);
		}
		
		
		//console.log(rodzaj_zad.trim().toLowerCase);
    })
    .catch(error => {
		console.error('Wystąpił błąd:', error);
		document.getElementById(x).innerHTML = '<div class="zad">Zadanie ' + nr + '.</div><p>Nie udało się pobrać treści zadania</p>';
    });
}




function getSlowa(x) {
	var tablica = x.trim().split(';');
	if(tablica.length === 1 && tablica[0] === 'null') {
		return '</br>';
	}else{
		var tresc = '<div class="dwie_linie"><ol>';
		for(var i = 0; i < tablica.length; i++) {
			//console.log(tablica[i]);
			tresc += '<li>'+tablica[i]+'</li>';
		}
		tresc += '</ol></div>';
		return tresc;
	}
}

function getTresc(x) {
  const rozwiazanie = path + '/zadania/' + x + '/tresc.txt';

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

function getTrescRadio(x) {
  const rozwiazanie = path + '/zadania/' + x + '/tresc.txt';

  fetch(rozwiazanie, { cache: "no-store" })
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(x+'_tresc').innerHTML = '<div class="wieksze">' + findRadio(data, x) + '</div>';
    })
    .catch(error => {
      console.error('Wystąpił błąd:', error);
      document.getElementById(x+'_tresc').innerHTML = '<div class="wieksze">Nie udało się załadować treści</div>';
    });
}

function getTrescPodpowiedz(x) {
  const rozwiazanie = path + '/zadania/' + x + '/tresc.txt';

  fetch(rozwiazanie, { cache: "no-store" })
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(x+'_tresc').innerHTML = '<div class="wieksze">' + findPodpowiedz(data, x) + '</div>';
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

function findRadio(x, y) {
	var wynik = '<form class="tresc_zadan_form">';
	var nr = 0;
	var jest = 0;
	var licznik = 0;
	for(var i = 0; i < x.length; i++) {
		jest = 0;
		var tmp = x.charAt(i);
		if(tmp === '_') {
			if(i + 2 < x.length) {
				var tmp1 = x.charAt(i+1);
				var tmp2 = x.charAt(i+2);
				if((tmp1 === '_') && (tmp2 === '_')) {
					licznik++;
					//wynik += '<input type="text" id="pole' + nr + '_' + y + '" required>';
					//nr++;
					nr = 0;
					jest = 1;
				}
			}
		}
		if(tmp === '@') {
			if(i + 2 < x.length) {
				var tmp1 = x.charAt(i+1);
				var tmp2 = x.charAt(i+2);
				if((tmp1 === '@') && (tmp2 === '@')) {
					//licznik++;
					wynik += '</br><input type="radio" id="pole'+ licznik + '_' + nr + '_' + y + '" name="p'+ licznik + '_' + y + '" value="p'+ nr +'">';
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

function escapeForJS(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function findPodpowiedz(x, y) {
	var wynik = ' ';
	var json_format = JSON.parse(x);
	var ile = json_format.zad.length;
	console.log('Ile zadań : ' + ile);
	for(var i = 0; i < ile; i++) {
		var dane = json_format.zad[i];
		var tresc = dane.tresc;
		wynik += '<h3>'+ (i+1) + '. '+ tresc +'</h3>';
		var ile2 = dane.odp.length;
		var poprawna = dane.wynik;
		for(var j = 0; j < ile2; j++) {
			var dane2 = dane.odp[j];
			var odpowiedz = dane2.war1;
			var dane3 = dane2.war2;
			wynik += '<div id="pole'+ i + '_' + j + '_' + y + '" class="punkt" data-clicked="false" onclick="poleSprawdz'+ i + '_' + j + '_' + y + '();">'+odpowiedz+'</div><div id="odp'+ i + '_' + j + '_' + y +'"></div>';
			var script_TMP1 = document.createElement('script');
			//console.log("Dane3 = " + dane3);
			//console.log(formatTresc3((dane3+'\r\n') , y));
			let safeDane3 = escapeForJS(formatTresc3((dane3+'\r\n') , y));

			let imgSrc = (j + 1) === poprawna ? "/strona/img/accept.png" : "/strona/img/no.png";
			let innerHTMLPart = dane3.charAt(0) !== '@' ? `' <img src="${imgSrc}" />${safeDane3}'` : `' <img src="${imgSrc}" />'`;

			script_TMP1.textContent =
			  'window.poleSprawdz' + i + '_' + j + '_' + y + ' = function() {' +
			  'console.log("OK");' +
			  'var div = document.getElementById("pole' + i + '_' + j + '_' + y + '");' +
			  'div.dataset.clicked = "true";' +
			  'document.getElementById("odp' + i + '_' + j + '_' + y + '").innerHTML = ' + innerHTMLPart + ';' +
			  'console.log("OK");' +
			  '}';

			document.body.appendChild(script_TMP1);
		}
		if(dane.podpowiedz.charAt(0) !== '@') {
			
			//console.log("Pod = " + dane.podpowiedz);
			var script_TMP = document.createElement('script');
			script_TMP.textContent = 'window.Sprawdz_p'+ i +'_'+ y + ' = function() { document.getElementById(\'podpowiedz'+ i +'_'+ y + '\').innerHTML = \'' + formatTresc3((dane.podpowiedz+'\r\n') , y) +'\';}'
			document.body.appendChild(script_TMP);
			wynik += '</br><div class="roz" onclick="Sprawdz_p'+ i +'_'+ y + '();">Podpowiedz</div><div id="podpowiedz' + i +'_'+ y + '"></div></br>';
		}
	}
	return wynik;
}

function sprawdzFormat(x) {
	var jest = 0;
	var ile = 100;
	if(x.length < ile) {
		ile = x.length;
	}
	for(var i = 0; i < ile-1; i++) {
		var tmp = x.charAt(i);
		var tmp1 = x.charAt(i+1);
		if(tmp === '\r' && tmp1 === '\n') {
			jest = 1;
			break;
		}
	}
	return jest;
}

function changeFormat(data) {
	var data2;
	if(sprawdzFormat(data) === 0) {
		data2 = data.replace(/\r?\n/g, '\r\n');
	}else {
		data2 = data;
	}
	return data2;
}

function getArtykul() {
	const statusPath = localStorage.getItem("status");
	var gdzie = path + '/Posty/' + statusPath + '/tresc.txt';
  //const rozwiazanie = path + '/zadania/' + x + '/tresc.txt';

  fetch(gdzie, { cache: "no-store" })
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
		
		var data2;
		if(sprawdzFormat(data) === 0) {
			data2 = data.replace(/\r?\n/g, '\r\n');
		}else {
			data2 = data;
		}
      document.getElementById('Artykul').innerHTML = '<div class="wieksze">' + formatText(data2) + '</div>';
	  addApp();
	  addZad();
    })
    .catch(error => {
      console.error('Wystąpił błąd:', error);
      document.getElementById('Artykul').innerHTML = '<div class="wieksze">Nie udało się załadować treści</div>';
    });
}

function czyLiczba(znak) {
  return znak >= '0' && znak <= '9';
}

function sprawdzPunktText(input2) {
	var input = '';
	var jest = 0;
	var ile_jest = 0;
	for(var i = 0; i < input2.length; i++) {
		var tmp = input2.charAt(i);
		if(i < 20 && jest === 0) {
			if((i+1) < input2.length) {
				var tmp1 = input2.charAt(i+1);
				if(tmp === ' ' && tmp1 === '*') {
					ile_jest = (i+2);
					jest = 1;
					break;
				}
			}
		}else{
			break;
		}
	}
	if(jest === 1) {
		input += '•';
		ile_jednostek = ile_jest;
		
	}
	for(var i = ile_jest; i < input2.length; i++) {
		input += input2.charAt(i);
	}
	ile_jednostek /= 2;
	return {
        input: input,
        ile_jednostek: ile_jednostek,
        jest: jest
    };
}

function formatTresc3(x , zad_nr) {
	var wynik2 = '';
	var przesuniecie = 0;
	var wynik = '';
	var first = 0;
	var lista = 0;
	for(var i = 0; i < x.length; i++) {
		var tmp = x.charAt(i);
		if(tmp === '\r') {
			if(przesuniecie === 1) {
				wynik2 += '<div style="margin-left: 20px;">' + wynik + '</div>';
				przesuniecie = 0;
			}else{
				var out = sprawdzPunktText(wynik);
				
				if(out.jest === 1) {
					wynik2 += '<div style="margin-left: ' + (20*out.ile_jednostek+10) + 'px;">' + out.input + '</div>';
				} else {
					wynik2 += '<p>' + wynik + '</p>';
				}
				przesuniecie = 0;
			}
			wynik = '';
			i++;
		} else {
			if(tmp === '*' || czyLiczba(tmp)) {
				if(i > 1) {
					var tmp_1 = x.charAt(i-1);
					if(tmp_1 === '\n') {
						if(czyLiczba(tmp)) {
							tmp1 = x.charAt(i+1);
							if(tmp1 === '.') {
								i++;
							}
						}
						lista = 1;
						wynik += '• ';
						przesuniecie = 1;
					}else{
						wynik += tmp;
					}
				} else {
					wynik += '• ';
					przesuniecie = 1;
					if(czyLiczba(tmp)) {
						tmp1 = x.charAt(i+1);
						if(tmp1 === '.') {
							i++;
						}
					}
					lista = 1;
				}
			} else {
				if(tmp === '$') {
					i++;
					var k = 0;
					var nazwa = '';
					for(var j = i; j < x.length; j++) {
						var tmp_tmp = x.charAt(j);
						k++;
						if(tmp_tmp === '$') {
							break;
						}else{
							nazwa += tmp_tmp;
						}
					}
					i += k;
					//sprawdzam czy w nazwa jest ?rozmiar
					var nazwa2 = nazwa.split('?')[0];
					var sizeMaks = 0;
					if (nazwa.indexOf('?') !== -1) {
						sizeMaks = Number(nazwa.split('?')[1]);
					}
					
					const statusPath = localStorage.getItem("status");
					var gdzie = path + '/zadania/' + zad_nr + '/'+ nazwa2;
					//console.log("IMG = " + gdzie);
					if(sizeMaks > 0) {
						wynik2 += '<img src="'+gdzie+'" style="display: block; margin: auto; width:' + sizeMaks + 'px; height: auto;"/>';
					}else{
						wynik2 += '<img src="'+gdzie+'" style="display: block; margin: auto;"/>';
					}
				}else{
					var tmp1 = x.charAt(i+1);
					if(tmp === '#' && tmp1 === '#') {
						i+=2;
						var k = 0;
						var nazwa = '';
						for(var j = i; j < x.length; j++) {
							var tmp_tmp = x.charAt(j);
							var tmp_tmp1 = x.charAt(j+1);
							k++;
							if(tmp_tmp === '#' && tmp_tmp1 === '#') {
								break;
							}else{
								nazwa += tmp_tmp;
							}
						}
						i += (k+1);
						wynik += generateTable(nazwa);
					}else{
						wynik += tmp;
					}
					
				}
				
			}
		}
	}
	return wynik2;
}

function formatTresc2(x) {
	var wynik2 = '';
	var przesuniecie = 0;
	var wynik = '';
	var first = 0;
	var lista = 0;
	var mocne = 0;
	var strong_w = 0;
	for(var i = 0; i < x.length; i++) {
		var tmp = x.charAt(i);
		if(tmp === '\r') {
			if(przesuniecie === 1) {
				if(mocne === 1) {
					wynik2 += '<div style="margin-left: 20px;"><div class="w1">' + wynik + '</div></div>';
				}else {
					if(strong_w === 1) {
						wynik2 += '<div class="zad"><img src="/strona/img/online-learning.png">'+wynik+'</div>';
					}else{
						wynik2 += '<div style="margin-left: 20px;">' + wynik + '</div>';
					}
				}
				mocne = 0;
				strong_w = 0;
				przesuniecie = 0;
			}else{
				var out = sprawdzPunktText(wynik);
				
				if(out.jest === 1) {
					wynik2 += '<div style="margin-left: ' + (20*out.ile_jednostek+10) + 'px;">' + out.input + '</div>';
				} else {
					wynik2 += '<p>' + wynik + '</p>';
				}
				przesuniecie = 0;
			}
			wynik = '';
			i++;
		} else {
			if(tmp === '*' || czyLiczba(tmp)) {
				if(i > 1) {
					var tmp_1 = x.charAt(i-1);
					if(tmp_1 === '\n') {
						if(czyLiczba(tmp)) {
							tmp1 = x.charAt(i+1);
							if(tmp1 === '.') {
								i++;
							}
						}
						lista = 1;
						wynik += '• ';
						przesuniecie = 1;
					}else{
						wynik += tmp;
					}
				} else {
					wynik += '• ';
					przesuniecie = 1;
					if(czyLiczba(tmp)) {
						tmp1 = x.charAt(i+1);
						if(tmp1 === '.') {
							i++;
						}
					}
					lista = 1;
				}
			} else {
				
				if(tmp === '!') {
					if(i > 1) {
						var tmp_1 = x.charAt(i-1);
						if(tmp_1 === '\n') {
							lista = 1;
							wynik += '• ';
							przesuniecie = 1;
							mocne = 1;
						}else{
							wynik += tmp;
						}
					} else {
						wynik += '• ';
						przesuniecie = 1;
						lista = 1;
						mocne = 1;
					}
				}else {
					if(tmp === '&') {
						if(i > 1) {
							var tmp_1 = x.charAt(i-1);
							if(tmp_1 === '\n') {
								lista = 1;
								przesuniecie = 1;
								strong_w = 1;
							}else{
								wynik += tmp;
							}
						} else {
							przesuniecie = 1;
							lista = 1;
							strong_w = 1;
						}
					}else{
						if(tmp === '$') {
							i++;
							var k = 0;
							var nazwa = '';
							for(var j = i; j < x.length; j++) {
								var tmp_tmp = x.charAt(j);
								k++;
								if(tmp_tmp === '$') {
									break;
								}else{
									nazwa += tmp_tmp;
								}
							}
							i += k;
							//sprawdzam czy w nazwa jest ?rozmiar
							var nazwa2 = nazwa.split('?')[0];
							var sizeMaks = 0;
							if (nazwa.indexOf('?') !== -1) {
								sizeMaks = Number(nazwa.split('?')[1]);
							}
							
							const statusPath = localStorage.getItem("status");
							var gdzie = path + '/Posty/' + statusPath + '/img/' + nazwa2;
							if(sizeMaks > 0) {
								wynik2 += '<img src="'+gdzie+'" style="display: block; margin: auto; width:' + sizeMaks + 'px; height: auto;"/>';
							}else{
								wynik2 += '<img src="'+gdzie+'" style="display: block; margin: auto;"/>';
							}
						}else{
							var tmp1 = x.charAt(i+1);
							if(tmp === '#' && tmp1 === '#') {
								i+=2;
								var k = 0;
								var nazwa = '';
								for(var j = i; j < x.length; j++) {
									var tmp_tmp = x.charAt(j);
									var tmp_tmp1 = x.charAt(j+1);
									k++;
									if(tmp_tmp === '#' && tmp_tmp1 === '#') {
										break;
									}else{
										nazwa += tmp_tmp;
									}
								}
								i += (k+1);
								wynik += generateTable(nazwa);
							}else{
								var tmp1 = x.charAt(i+1);
								if(tmp === '@' && tmp1 === '@') {
									i+=2;
									var k = 0;
									var nazwa = '';
									for(var j = i; j < x.length; j++) {
										var tmp_tmp = x.charAt(j);
										var tmp_tmp1 = x.charAt(j+1);
										k++;
										if(tmp_tmp === '@' && tmp_tmp1 === '@') {
											break;
										}else{
											nazwa += tmp_tmp;
										}
									}
									i += (k+1);
									const statusPath = localStorage.getItem("status");
									var gdzie = path + '/Posty/' + statusPath + '/' + nazwa;
									scriptsToLoad.push(gdzie);
									console.log("add script = " + gdzie);
								}else{
									var tmp1 = x.charAt(i+1);
									if(tmp === '%' && tmp1 === '%') {
										i+=2;
										var k = 0;
										var nazwa = '';
										for(var j = i; j < x.length; j++) {
											var tmp_tmp = x.charAt(j);
											var tmp_tmp1 = x.charAt(j+1);
											k++;
											if(tmp_tmp === '%' && tmp_tmp1 === '%') {
												break;
											}else{
												nazwa += tmp_tmp;
											}
										}
										i += (k+1);
										wynik2 += generateHTML(nazwa);
									}else{
										var tmp1 = x.charAt(i+1);
										if(tmp === '%' && tmp1 === '@') {
											i+=2;
											var k = 0;
											var nazwa = '';
											for(var j = i; j < x.length; j++) {
												var tmp_tmp = x.charAt(j);
												var tmp_tmp1 = x.charAt(j+1);
												k++;
												if(tmp_tmp === '@' && tmp_tmp1 === '%') {
													break;
												}else{
													nazwa += tmp_tmp;
												}
											}
											i += (k+1);
											wynik2 += generateCODE(nazwa);
										}else{
											var tmp1 = x.charAt(i+1);
											if(tmp === '#' && tmp1 === '@') {
												i+=2;
												var k = 0;
												var nazwa = '';
												for(var j = i; j < x.length; j++) {
													var tmp_tmp = x.charAt(j);
													var tmp_tmp1 = x.charAt(j+1);
													k++;
													if(tmp_tmp === '@' && tmp_tmp1 === '#') {
														break;
													}else{
														nazwa += tmp_tmp;
													}
												}
												i += (k+1);
												console.log('add zad = ' + nazwa)
												zadToLoad.push(nazwa);
												wynik2 += '<div id="'+nazwa+'"></div>';
											}else{
												wynik += tmp;
											}
										}
									}
								}
								
							}
							
						}
					}
				}
			}
		}
	}
	return wynik2;
}

function generateTable(text) {
  // usuń puste linie i białe znaki
  const lines = text.trim().split(/\r?\n/);
  let html = '<table border="1">\n';

  lines.forEach((line, index) => {
    const cells = line.split(/\t+/); // podział po tabulatorze
    html += '  <tr>\n';
    cells.forEach(cell => {
      const tag = index === 0 ? 'th' : 'td'; // pierwszy wiersz = nagłówki
      html += `    <${tag}>${cell.trim()}</${tag}>\n`;
    });
    html += '  </tr>\n';
  });

  html += '</table>';
  return html;
}

// Wstawia HTML w postaci stringu
function generateHTML(htmlString) {
    // Można tutaj ewentualnie uciec niektóre znaki, jeśli potrzebne
    return htmlString;
}


// Wstawia HTML w postaci stringu
function generateCODE(htmlString) {
    // Można tutaj ewentualnie uciec niektóre znaki, jeśli potrzebne
    return '<div class="code-box"><pre><code class="language-python">' + htmlString + '</pre></code></div>';
}

function addApp() {
	console.log("addApp = "+  scriptsToLoad.length);
    scriptsToLoad.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';

        // Opcjonalnie: logujemy czy się załadował
        script.onload = () => console.log(`Wykonano skrypt: ${url}`);
        script.onerror = () => console.error(`Błąd przy ładowaniu skryptu: ${url}`);

        document.body.appendChild(script);
    });
}

function addZad() {
	console.log("addZad = "+  zadToLoad.length);
    zadToLoad.forEach(nazwa => {
        zaladuj(nazwa);
    });
}

function formatText(x) {
	var wynik = '<div class="newest"><div class="entries2">';
	
	//************************** Wczytanie tytułu ************************
	var tytul = 0;
	var tytul_var = '';
	for(var i = 0; i < x.length; i++) {
		var tmp = x.charAt(i);
		if(tmp === '\r') {
			var tmp1 = x.charAt(i+1);
			var tmp2 = x.charAt(i+2);
			if(tmp2 === '\r') {
				tytul = i + 4;
				break;
			}
		} else {
			tytul_var += tmp;
		}
	}
	wynik += '<h1>'+tytul_var+'</h1>';
	
	var jest = 0;
	var jest_dane = 0;
	var dane = '';
	var tytul2 = '';
	for(var i = tytul; i < x.length; i++) {
		var tmp = x.charAt(i);
		if(czyLiczba(tmp)) {
			
			if(jest_dane === 0) {
				tytul2 += tmp;
			}else {
				var tmp1 = x.charAt(i+1);
				var tmp_1 = x.charAt(i-1);
				var tmp_3 = x.charAt(i-3);
				var tmp_5 = x.charAt(i-5);
				if(tmp1 === '.' && tmp_1 === '\n' && tmp_3 === '\n' && tmp_5 !== ':') {
					jest = 1;
					if(jest === 1 && jest_dane === 1) {
						wynik += '<div class="entry"><div class="entrytxt2"><h2>' + tytul2 + '</h2>'+formatTresc2(dane)+'</div></div>';
						
					}
					tytul2 = tmp + tmp1;
					i++;
					
					
					jest_dane = 0;
					dane = '';
				}else{
					dane += tmp;
				}
			}
			
		} else {
			if(jest_dane === 0) {
				if(tmp === '\r') {
					var tmp1 = x.charAt(i+1);
					var tmp2 = x.charAt(i+2);
					if(tmp2 === '\r') {
						jest_dane = 1;
					}
				} else {
					tytul2 += tmp;
				}
			}else {
				dane += tmp;
			}
		}
	}
	const statusPath = localStorage.getItem("status");
	var gdzie = path + '/Posty/' + statusPath + '/audio.mp3';
	wynik += '<div class="entry"><div class="entrytxt2"><h2>Podsumowanie do odsłuchania</h2>&nbsp;&nbsp;<audio controls><source src="'+gdzie+'" type="audio/mpeg"></audio></div></div>';
	wynik += '</div></div>';
	if(maksSize === 0) {
		wynik += '<div class="roz" onclick="downloadPDF(\''+path+'\');">Generuj PDF</div>';
	} else {
		wynik += '<div class="roz" onclick="downloadPDF(\''+path+'\' , ' + maksSize + ');">Generuj PDF</div>';
	}
	return wynik;
}