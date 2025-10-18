var path = '/strona/Fotonika/OOA';

async function getNav() {
  const gdzie = path + '/nr_posty.txt';
  let tresc = '';

  try {
    const response = await fetch(gdzie);
    if (!response.ok) throw new Error('Błąd sieci!');
    const data = await response.text();

    // Parsujemy JSON
    const json_format = JSON.parse(data);
    const zawartosc = json_format.posty;
    const ile = zawartosc.length;

    // Budujemy HTML
    for (let i = 0; i < ile; i++) {
      const Kategoria = zawartosc[i].kategoria;
      const dane = zawartosc[i].data;

      tresc += `<h2>${Kategoria}</h2><ul>`;
      for (let j = 0; j < dane.length; j++) {
        const postId = dane[j];
        const title = await getTitle(postId); // <--- czekamy na tytuł
		var script_TMP1 = document.createElement('script');
		script_TMP1.textContent = 'window.post_nr' + postId + ' = function() { localStorage.setItem("status", \'' + postId + '\'); window.location.reload(); }';
        tresc += `<li onclick="post_nr${postId}()">${title}</li>`;
		document.body.appendChild(script_TMP1);
      }
      tresc += '</ul>';
    }

    return tresc;

  } catch (error) {
    console.error('Wystąpił błąd:', error);
    return '<p>Błąd wczytywania danych</p>';
  }
}


async function getTitle(x) {
  const gdzie = `${path}/Posty/${x}/tresc.txt`;
  try {
    const response = await fetch(gdzie, { cache: "no-store" });
    if (!response.ok) throw new Error('Błąd sieci!');
    const data = await response.text();
    return getTitle2(data);
  } catch (error) {
    console.error('Wystąpił błąd:', error);
    return '(brak tytułu)';
  }
}

function getTitle2(x) {
  // prostsza metoda: pierwszy wiersz to tytuł
  const linie = x.split(/\r?\n/);
  return linie[0].trim();
}

async function start1() {
  document.getElementById("manual").innerHTML = await getNav();
}


window.onload = start1;