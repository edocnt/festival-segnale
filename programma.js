const statoProgramma = document.getElementById('stato-programma');
const grigliaEventi = document.getElementById('griglia-eventi');

function formattaData(dataIso) {
  const data = new Date(`${dataIso}T12:00:00`);
  if (Number.isNaN(data.getTime())) {
    return dataIso;
  }
  const testoData = data.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return testoData.charAt(0).toUpperCase() + testoData.slice(1);
}

function creaSchedaEvento(evento, mappaSedi) {
  const articolo = document.createElement('article');
  articolo.className = 'event-card';

  const immagine = document.createElement('img');
  immagine.src = evento.immagine;
  immagine.alt = evento.immagine_alt;
  immagine.width = 900;
  immagine.height = 600;

  const corpo = document.createElement('div');
  corpo.className = 'event-body';

  const meta = document.createElement('p');
  meta.className = 'event-meta';
  meta.textContent = `${formattaData(evento.data)} · ${evento.orario} · ${evento.categoria}`;

  const titolo = document.createElement('h3');
  titolo.textContent = evento.titolo;

  const descrizione = document.createElement('p');
  descrizione.textContent = evento.descrizione;

  const luogo = document.createElement('p');
  luogo.className = 'event-place';
  const etichettaSede = document.createElement('strong');
  etichettaSede.textContent = 'Sede: ';
  const nomeSede = mappaSedi.get(evento.sede_id) || 'Sede da definire';
  luogo.append(etichettaSede, document.createTextNode(nomeSede));

  corpo.append(meta, titolo, descrizione, luogo);
  articolo.append(immagine, corpo);

  return articolo;
}

async function caricaProgramma() {
  try {
    const [rispostaEventi, rispostaSedi] = await Promise.all([
      fetch('dati/eventi.json'),
      fetch('dati/sedi.json'),
    ]);

    if (!rispostaEventi.ok || !rispostaSedi.ok) {
      throw new Error('Errore nel caricamento dei file dati');
    }

    const [datiEventi, datiSedi] = await Promise.all([
      rispostaEventi.json(),
      rispostaSedi.json(),
    ]);

    if (!Array.isArray(datiEventi) || datiEventi.length === 0) {
      grigliaEventi.innerHTML = '';
      statoProgramma.hidden = false;
      statoProgramma.textContent = 'Nessun evento in programma.';
      return;
    }

    const mappaSedi = new Map(
      datiSedi.map((sede) => [sede.id, sede.nome])
    );

    grigliaEventi.innerHTML = '';
    datiEventi.forEach((evento) => {
      grigliaEventi.appendChild(creaSchedaEvento(evento, mappaSedi));
    });

    statoProgramma.textContent = '';
    statoProgramma.hidden = true;
  } catch (errore) {
    grigliaEventi.innerHTML = '';
    statoProgramma.hidden = false;
    statoProgramma.textContent = 'Il programma non è disponibile.';
  }
}

caricaProgramma();