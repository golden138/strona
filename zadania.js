function sprawdz(x) {
	var rozwiazanie = '/strona/chemia/zadania/'+x+'/roz.txt';
	var gdzie = 'roz';
	for(var i = 3; i < x.length; i++) {
		gdzie += x.charAt(i);
	}
	
	fetch(rozwiazanie) // <-- tutaj wpisz adres pliku z zadaniem
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(gdzie).innerHTML = data;
    })
    .catch(error => {
      console.error('Wystąpił błąd:', error);
      document.getElementById(gdzie).innerText = 'Nie udało się pobrać rozwiązania.';
    });
}

function zaladuj(x) {
	var tresc = '/strona/chemia/zadania/'+x+'/zad.txt';
	var nr = '';
	for(var i = 3; i < x.length; i++) {
		nr += x.charAt(i);
	}
	fetch(tresc) // <-- tutaj wpisz adres pliku z zadaniem
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
		var zdj;
		var tresc_zad = data;
		var dane = '<div class="zad"><img src="img/ph-meter.png" />Zadanie ' + nr + '.</div><p>' + data + '</p><div class="roz" onclick="sprawdz(\'zad'+ nr +'\');">Rozwiązani</div><div id="roz' + nr + '"></div>';
		document.getElementById('zad1').innerHTML = dane;
    })
    .catch(error => {
		console.error('Wystąpił błąd:', error);
		document.getElementById(gdzie).innerHTML = '<div class="zad">Zadanie ' + nr + '.</div><p>Nie udało się pobrać treści zadania</p>';
    });
}

window.onload = zaladuj('zad1');