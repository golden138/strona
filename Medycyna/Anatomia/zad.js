var path = '/strona/Medycyna/Anatomia';

function start() {
	setPath(path);
	setMaksSize(360);
	var statusPath = localStorage.getItem("status");
	if (statusPath === null || statusPath === "") {
		console.log("Path : " + statusPath);
		localStorage.setItem("status", 'Post1');
	}
	getArtykul();
	// Wczytaj wartość przy otwarciu
	//localStorage.setItem("status", 'Post1');
	statusPath = localStorage.getItem("status");
	console.log(statusPath);
	var gdzie = path + '/Posty/' + statusPath + '/nr_zadan.txt';
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
	setTimeout(function() {
  	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 500);
}

window.onload = start();