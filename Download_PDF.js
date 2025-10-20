var wielkosc = 300;
var ile_jednostek = 1;

async function downloadPDF(path) {
  try {
    const statusPath = localStorage.getItem("status");
    const gdzie = path + '/Posty/' + statusPath + '/tresc.txt';
    const response = await fetch(gdzie, { cache: "no-store" });
    if (!response.ok) throw new Error('Błąd sieci!');
    const data = await response.text();
	console.log(path);
	var data2 = data.replace(/\r?\n/g, '\r\n');
    const content = await formatTextPdf(data2, path); // ✅ teraz poprawnie

    const docDefinition = {
      content: content,
	  footer: {
		columns: [
		  {
			text: '2025 © Sebastian G.',
			alignment: 'center',
			fontSize: 8,   // 🔹 mniejsza czcionka
			margin: [0, 0, 0, 5] // 🔹 lekki odstęp od dolnej krawędzi
		  }
		]
	  },
      styles: {
        header: { fontSize: 16, bold: true, alignment: 'center' },
        subheader: { fontSize: 14, bold: true },
        default: { fontSize: 12 }
      }
    };

    //pdfMake.createPdf(docDefinition).open();
	pdfMake.createPdf(docDefinition).download("plik.pdf");
  } catch (error) {
    alert('Nie udało się załadować treści: ' + error);
  }
}

async function downloadPDFW(path, wiel) {
  try {
	wielkosc = wiel;
    const statusPath = localStorage.getItem("status");
    const gdzie = path + '/Posty/' + statusPath + '/tresc.txt';
    const response = await fetch(gdzie, { cache: "no-store" });
    if (!response.ok) throw new Error('Błąd sieci!');
    const data = await response.text();
	console.log(path);
	var data2 = data.replace(/\r?\n/g, '\r\n');
    const content = await formatTextPdf(data2, path); // ✅ teraz poprawnie

    const docDefinition = {
      content: content,
	  footer: {
		columns: [
		  {
			text: '2025 © Sebastian G.',
			alignment: 'center',
			fontSize: 8,   // 🔹 mniejsza czcionka
			margin: [0, 0, 0, 5] // 🔹 lekki odstęp od dolnej krawędzi
		  }
		]
	  },
      styles: {
        header: { fontSize: 16, bold: true, alignment: 'center' },
        subheader: { fontSize: 14, bold: true },
        default: { fontSize: 12 }
      }
    };
	wielkosc = 300;
    //pdfMake.createPdf(docDefinition).open();
	pdfMake.createPdf(docDefinition).download("plik.pdf");
  } catch (error) {
    alert('Nie udało się załadować treści: ' + error);
  }
}


function czyLiczba(znak) {
  return znak >= '0' && znak <= '9';
}

function toBase64(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url; // URL lokalny lub Base64
  });
}

function parseSubSupText(input2) {
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
  const parts = [];
  let lastIndex = 0;
  const regex = /<(sub|sup)>(.*?)<\/\1>/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    // tekst przed tagiem
    if (match.index > lastIndex) {
      parts.push({ text: input.slice(lastIndex, match.index) });
    }

    // bazowy znak - ostatni znak przed tagiem
    const baseChar = parts.length ? parts[parts.length - 1].text.slice(-1) : '';
    if (baseChar) {
      parts[parts.length - 1].text = parts[parts.length - 1].text.slice(0, -1);
      if (parts[parts.length - 1].text === '') parts.pop();
      parts.push({ text: baseChar });
    }

    // sub/sup jako mniejszy znak
    const offset = match[1] === 'sub' ? -3 : 5;
    parts.push({ text: match[2], fontSize: 8, lineHeight: offset });

    lastIndex = regex.lastIndex;
  }

  // reszta tekstu
  if (lastIndex < input.length) {
    parts.push({ text: input.slice(lastIndex) });
  }
	var ile_w = 0;
	if(ile_jednostek > 1) {
		ile_w = 2;
	}
  return {
    text: parts,
    alignment: 'justify',
    margin: [10*ile_jednostek, 2+ile_w, 5, 0+ile_w]
  };
}


/*function parseSubSupText(input) {
  const parts = [];
  let lastIndex = 0;
  const regex = /<(sub|sup)>(.*?)<\/\1>/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: input.slice(lastIndex, match.index) });
    }

    const baseChar = parts.length ? parts[parts.length - 1].text.slice(-1) : '';
    if (baseChar) {
      parts[parts.length - 1].text = parts[parts.length - 1].text.slice(0, -1);
      if (parts[parts.length - 1].text === '') parts.pop();
      parts.push({ text: baseChar });
    }

    const offset = match[1] === 'sub' ? -3 : 5;
    parts.push({ text: match[2], fontSize: 8, baseline: offset });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    parts.push({ text: input.slice(lastIndex) });
  }

  // obsługa podpunktów z wyraźnymi wcięciami
  const finalParts = [];
  for (let p of parts) {
    if (!p.text) continue;

    const lines = p.text.split(/\n/);
    for (let line of lines) {
      if (line.trim() === '') continue;

      const matchBullet = line.match(/^(\s*)\*\s/);
      if (matchBullet) {
        const indent = matchBullet[1].length;
        const level = Math.floor(indent / 2) + 1;
        const spacesPerLevel = 8; // mocne wcięcie
        finalParts.push({
          text: ' '.repeat(level * spacesPerLevel) + '* ' + line.trim().substring(2),
        });
      } else {
        finalParts.push({ text: line });
      }
    }
  }

  return {
    text: finalParts,
    alignment: 'justify',
    margin: [10, 2, 5, 0],
  };
}*/






async function scaleBase64Half(base64) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width / 2;
            canvas.height = img.height / 2;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const newBase64 = canvas.toDataURL("image/png");
            resolve(newBase64);
        };
        img.onerror = reject;
        img.src = base64;
    });
}



async function renderLatexToBase64OriginalSize(latex) {
    return new Promise((resolve, reject) => {
        try {
            // Tymczasowy div w DOM
            const temp = document.createElement("div");
            temp.style.position = "absolute";
            temp.style.left = "-9999px";
            temp.style.color = "black";        // Tekst czarny
            temp.style.background = "white";   // Tło białe
            temp.style.fontSize = "28px";      // Rozmiar czcionki (można zmieniać)
            temp.style.padding = "0px";       // Odstęp wokół równania
            //temp.style.borderRadius = "8px";   // Zaokrąglenie (opcjonalnie)
            document.body.appendChild(temp);

            // Render LaTeX za pomocą KaTeX
            katex.render(latex, temp, { throwOnError: false, displayMode: true });

            // Poczekaj, aż KaTeX zakończy renderowanie
            setTimeout(() => {
                html2canvas(temp, { 
                    backgroundColor: null, // zachowaj przezroczystość (lub ustaw kolor tła)
                    useCORS: true,
                    allowTaint: false
                }).then(canvas => {
                    const base64 = canvas.toDataURL("image/png");
					var width = canvas.width / 2;
					var height = canvas.height / 2;
					document.body.removeChild(temp);
					resolve({ base64, width, height })
                }).catch(err => {
                    document.body.removeChild(temp);
                    reject(err);
                });
            }, 100); // lekko zwiększone opóźnienie

        } catch (err) {
            reject(err);
        }
    });
}

function generatePdfTable(input) {
    const lines = input.trim().split(/\r?\n/);
    const body = [];

    lines.forEach((line, index) => {
        const cells = line.split(/\t+/).map(cell => cell.trim());

        if (index === 0) {
            // nagłówki
            body.push(cells.map(cell => ({
                text: cell, 
                bold: true, 
                fillColor: '#eeeeee', 
                margin: [2, 2, 2, 2]
            })));
        } else {
            body.push(cells.map(cell => {
                // tutaj sprawdzamy i parsujemy sub/sup
                if (/<(sub|sup)>.*?<\/\1>/.test(cell)) {
                    return parseSubSupText(cell);
                } else {
                    return { text: cell, margin: [2, 2, 2, 2] };
                }
            }));
        }
    });

    return {
        table: {
            headerRows: 1,
            widths: Array(lines[0].split(/\t+/).length).fill('*'),
            body: body
        },
        layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 2,
            paddingBottom: () => 2
        },
        margin: [0, 5, 0, 5]
    };
}



async function formatTresc2Pdf(x, path) {
	var wynik = '';
	var wynik2 = [];
	var first = 0;
	var lista = 0;
	for(var i = 0; i < x.length; i++) {
		var tmp = x.charAt(i);
		if(tmp === '\r') {
			if(wynik.length > 0) {
				wynik2.push(parseSubSupText(wynik));
				ile_jednostek = 1;
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
						ile_jednostek = 2;
					}else{
						wynik += tmp;
					}
				} else {
					wynik += '• ';
					ile_jednostek = 2;
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
					var nazwa2 = nazwa.split('?')[0];
					const statusPath = localStorage.getItem("status");
					var gdzie = path + '/Posty/' + statusPath + '/img/' + nazwa2;
					 try {
						const base64Image = await toBase64(gdzie);
						const dim = await getImageDimensions(base64Image);

						// dopasowanie szerokości, zachowanie proporcji
						var maxWidth = wielkosc;
						var scale = maxWidth / dim.width;
						var wys = dim.height * scale;
						var height = dim.height * scale;
						if(wys > wielkosc) {
							maxWidth = wielkosc * dim.width / dim.height;
							//scale = maxWidth / dim.width;
							height = wielkosc;
							console.log('ee ' + maxWidth + ' ' + dim.width + ' ' + dim.height);
						}
						//var height = dim.height * scale;
						console.log(nazwa + ' -> '+ maxWidth + ' , ' + height);

						wynik2.push({
						  image: base64Image,
						  width: maxWidth,
						  height: height,
						  margin: [0, 5, 0, 5],
						  alignment: 'center'
						});

					  } catch (err) {
						console.error('Błąd wczytania obrazka:', err);
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
						wynik2.push(generatePdfTable(nazwa));
						//wynik += generateTable(nazwa);
					}else{
						var tmp1 = x.charAt(i+1);
						if(tmp === '\\' && (tmp1 === '[' || tmp1 === '(')) {
							//równania
							i+=2;
							var k = 0;
							var nazwa = '';
							for(var j = i; j < x.length; j++) {
								var tmp_tmp = x.charAt(j);
								var tmp_tmp1 = x.charAt(j+1);
								k++;
								if(tmp_tmp === '\\' && (tmp_tmp1 === ']' || tmp_tmp1 === ')')) {
									break;
								}else{
									nazwa += tmp_tmp;
								}
							}
							i += (k+1);
							const base64Img = await renderLatexToBase64OriginalSize(nazwa);
							var base64I = base64Img.base64;
							// dopasowanie szerokości, zachowanie proporcji
							var maxWidth = 500;
							var ww = base64Img.width;
							var hh = base64Img.height;
							var height = base64Img.height * scale;
							var wwN = ww;
							var hhN = hh;
							if(ww > maxWidth) {
								wwN = maxWidth;
								hhN = wwN * hh / ww;
							}
							wynik2.push({
								image: base64I,
								width: wwN,
								height: hhN,
								alignment: 'center',
								margin: [0, 0, 0, 0]
							});
						}else{
							wynik += tmp;
						}
					}
					
				}
				
			}
		}
	}
	return wynik2;
}

async function formatTextPdf(x, path) {
	var wynik = [];
	
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
	// Dodaj tytuł
    wynik.push({ 
	  text: tytul_var, 
	  style: 'header', 
	  margin: [0, 0, 0, 10], 
	  alignment: 'center' // <-- to wyśrodkowuje tekst
	});
	
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
						// Dodaj podtytuł / nagłówek podpunktu
						wynik.push({ 
						  text: tytul2, 
						  style: 'subheader', 
						  margin: [5, 10, 5, 0] 
						});
						var podpunktContent = await formatTresc2Pdf(dane, path);
						// Dodaj treść podpunktu jako normalny tekst
						wynik.push(podpunktContent);

						//wynik += '<div class="entry"><div class="entrytxt"><h2>' + tytul2 + '</h2>'+formatTresc2(dane)+'</div></div>';
						
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
	return wynik;
}