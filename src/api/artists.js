export function fetchArtists(genre) {
  return fetch(
    `https://script.google.com/macros/s/` +
      `AKfycbytro_BuOciH12QClPlDg1GF60DdHCsMgN3MZGqaq6QfhUvfwkB/exec?` +
      `genre=${genre}`,
    {
      method: 'GET'
    }
  ).then(
    response => (response.ok ? response.text() : Promise.reject(response))
  );
}

export function submitArtist(artist) {
  return fetch(
    `https://script.google.com/macros/s/` +
      `AKfycbytro_BuOciH12QClPlDg1GF60DdHCsMgN3MZGqaq6QfhUvfwkB/exec`,
    {
      method: 'POST',
      body: JSON.stringify(artist)
    }
  ).then(
    response =>
      response.ok ? Promise.resolve('Success') : Promise.reject(response)
  );
}
