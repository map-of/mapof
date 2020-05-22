export function createFeatureCollection(data, genres) {
  return {
    type: 'FeatureCollection',
    features: data.map((item) => {
      return {
        type: 'Feature',
        properties: {
          ...item,
          color: genres.find(({id}) => id === item.genre).color
        },
        geometry: {
          type: 'Point',
          coordinates: [item.lng, item.lat]
        }
      };
    })
  };
}
