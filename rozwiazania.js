
function sprawdz() {
	fetch('/strona/chemia/zadania/zad1/roz.txt') // <-- tutaj wpisz adres pliku z zadaniem
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd sieci!');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('roz1').innerHTML = data;
    })
    .catch(error => {
      console.error('Wystąpił błąd:', error);
      document.getElementById('roz1').innerText = 'Nie udało się pobrać rozwiązania.';
    });
}
