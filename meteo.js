const riquadroMeteo = document.getElementById('riquadro-meteo');

const URL_METEO =
  'https://api.open-meteo.com/v1/forecast?latitude=45.0703&longitude=7.6869&current=temperature_2m,wind_speed_10m&timezone=Europe%2FRome';

function formattaOraMeteo(dataOraIso) {
  if (typeof dataOraIso !== 'string' || !dataOraIso.includes('T')) {
    return dataOraIso;
  }
  const [dataParte, oraParte] = dataOraIso.split('T');
  const [anno, mese, giorno] = dataParte.split('-');
  return `${giorno}/${mese}/${anno} alle ${oraParte}`;
}

async function caricaMeteoTorino() {
  try {
    const risposta = await fetch(URL_METEO);

    if (!risposta.ok) {
      throw new Error('Risposta non valida dal servizio meteo');
    }

    const dati = await risposta.json();
    const attuale = dati.current;

    if (
      !attuale ||
      typeof attuale.temperature_2m !== 'number' ||
      typeof attuale.wind_speed_10m !== 'number' ||
      !attuale.time
    ) {
      throw new Error('Dati meteo incompleti');
    }

    riquadroMeteo.innerHTML = '';

    const listaDati = document.createElement('ul');
    listaDati.className = 'weather-list';

    const voceTemp = document.createElement('li');
    voceTemp.innerHTML = `<strong>Temperatura:</strong> ${attuale.temperature_2m} °C`;

    const voceVento = document.createElement('li');
    voceVento.innerHTML = `<strong>Vento:</strong> ${attuale.wind_speed_10m} km/h`;

    const voceOra = document.createElement('li');
    voceOra.innerHTML = `<strong>Rilevazione:</strong> ${formattaOraMeteo(attuale.time)}`;

    listaDati.append(voceTemp, voceVento, voceOra);
    riquadroMeteo.appendChild(listaDati);
  } catch (errore) {
    riquadroMeteo.innerHTML = '';
    const messaggioErrore = document.createElement('p');
    messaggioErrore.className = 'weather-error';
    messaggioErrore.textContent =
      'Dati meteo non disponibili al momento. Riprova più tardi.';
    riquadroMeteo.appendChild(messaggioErrore);
  }
}

caricaMeteoTorino();