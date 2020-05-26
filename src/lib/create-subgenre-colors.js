import chroma from 'chroma-js';

export function createSubgenreColors(genres) {
  const allGenres = [];

  genres.forEach((genre) => {
    allGenres.push({
      value: genre.id,
      label: genre.name,
      color: genre.color,
      type: 'genre'
    });

    const subgenres = genre.subgenres.split(',');
    const subgenreCount = subgenres.length;
    const scale = chroma
      .scale(['white', genre.color, 'black'])
      .padding(0.3)
      .colors(subgenreCount);

    subgenres.filter(Boolean).forEach((subgenre, index) => {
      allGenres.push({
        value: subgenre.toLowerCase(),
        label: subgenre.charAt(0).toUpperCase() + subgenre.slice(1),
        color: scale[index],
        type: 'genre'
      });
    });
  });

  return allGenres;
}
