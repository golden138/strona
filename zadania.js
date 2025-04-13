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