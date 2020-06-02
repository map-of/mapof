import {createContext, useReducer, useContext} from 'react';
import produce from 'immer';
import chroma from 'chroma-js';

import {createFeatureCollection} from '../lib/create-feature-collection';
import {createSubgenreColors} from '../lib/create-subgenre-colors';

/* Action Types */
const SET_MAP_BOUNDS = 'SET_MAP_BOUNDS';
const SET_DATA = 'SET_DATA';
const SET_INFO_BOX_ITEMS = 'SET_INFO_BOX_ITEMS';
const SET_SELECTED_INFO_BOX_ITEM = 'SET_SELECTED_INFO_BOX_ITEM';
const SET_FILTERS = 'SET_FILTERS';
const SET_ACCENT_COLOR = 'SET_ACCENT_COLOR';
const SET_PLAYER_ITEM = 'SET_PLAYER_ITEM';
const SET_IS_PLAYING = 'SET_IS_PLAYING';

/* Define a context and a reducer for updating the context */
const GlobalStateContext = createContext();

const initialState = {
  mapState: {
    bounds: [-180, -90, 180, 90]
  },
  data: null,
  genres: null,
  cities: null,
  filters: null,
  infoBoxItems: null,
  selectedInfoBoxItem: null,
  playerItem: null,
  isPlaying: false,
  accentColor: 'deeppink'
};

const globalStateReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_MAP_BOUNDS:
      draft.mapState.bound = action.payload;
      return;

    case SET_DATA:
      draft.data = action.payload;
      return;

    case SET_INFO_BOX_ITEMS:
      draft.infoBoxItems = action.payload;
      draft.selectedInfoBoxItem = null;
      return;

    case SET_SELECTED_INFO_BOX_ITEM:
      draft.selectedInfoBoxItem = action.payload;
      return;

    case SET_FILTERS:
      draft.filters = action.payload;
      draft.infoBoxItems = null;
      draft.selectedInfoBoxItem = null;
      return;

    case SET_ACCENT_COLOR:
      draft.accentColor = action.payload;
      return;

    case SET_PLAYER_ITEM:
      draft.playerItem = action.payload;
      draft.isPlaying = true;
      return;

    case SET_IS_PLAYING:
      draft.isPlaying = action.payload;
      return;

    default:
      return;
  }
});

/* Export a component to provide the context to its children. This is used in our _app.js file */
export const GlobalStateProvider = ({children, initialData}) => {
  const [state, dispatch] = useReducer(globalStateReducer, {
    ...initialState,
    data: initialData?.data
      ? createFeatureCollection(initialData.data, initialData.genres)
      : initialState.data,
    genres: initialData?.genres
      ? createSubgenreColors(initialData.genres)
      : initialState.genres,
    cities: initialData?.data
      ? initialData.data.reduce((acc, item) => {
          acc[item.locationName] = acc[item.locationName] || {
            lat: item.lat,
            lng: item.lng,
            type: 'city',
            value: item.locationName.toLowerCase(),
            label: item.locationName,
            color: 'grey'
          };

          return acc;
        }, {})
      : initialData.cities
  });

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

/*
Default export is a hook that provides a simple API for updating the global state.
This also allows us to keep all of this state logic in this one file
*/
const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setMapBounds = (bounds) => {
    dispatch({
      type: SET_MAP_BOUNDS,
      payload: bounds
    });
  };

  const setData = (data) => {
    dispatch({
      type: SET_DATA,
      payload: data
    });
  };

  const setInfoBoxItems = (items) => {
    dispatch({
      type: SET_INFO_BOX_ITEMS,
      payload: items
    });
  };

  const setSelectedInfoBoxItem = (item) => {
    dispatch({
      type: SET_SELECTED_INFO_BOX_ITEM,
      payload: item
    });
  };

  const setFilters = (filters) => {
    dispatch({
      type: SET_FILTERS,
      payload: filters
    });
  };

  // const setAccentColor = (color) => {
  //   dispatch({
  //     type: SET_ACCENT_COLOR,
  //     payload: color
  //   });
  // };

  const setPlayerItem = (playerItem) => {
    dispatch({
      type: SET_PLAYER_ITEM,
      payload: playerItem
    });
  };
  const setIsPlaying = (isPlaying) => {
    dispatch({
      type: SET_IS_PLAYING,
      payload: isPlaying
    });
  };

  const filterData = (data, filters) => {
    const genreFilters = filters
      .filter((f) => f.type === 'genre')
      .map((f) => f.value);
    const cityFilters = filters
      .filter((f) => f.type === 'city')
      .map((f) => f.value);

    return {
      ...data,
      features: data.features.filter((item) => {
        return (
          (cityFilters.includes(item.properties.locationName.toLowerCase()) ||
            !cityFilters.length) &&
          (genreFilters.includes(item.properties.genre) || !genreFilters.length)
        );
      })
    };
  };

  const getAccentColor = (filters) => {
    const genreFilters = filters.filter((f) => f.type === 'genre');

    if (genreFilters.length === 1) {
      return genreFilters[0].color;
    } else if (genreFilters.length > 1) {
      return chroma.average(genreFilters.map((f) => f.color)).hex();
    }

    return 'deeppink';
  };


  const filteredData = state.filters
    ? filterData(state.data, state.filters)
    : state.data;

  return {
    data: state.data,
    filteredData,
    infoBoxItems: state.infoBoxItems
      ? state.infoBoxItems
      : state.filters
      ? filteredData.features
      : null,
    selectedInfoBoxItem: state.selectedInfoBoxItem,
    mapState: state.mapState,
    genres: state.genres,
    cities: state.cities,
    searchTags: [...state.genres, ...Object.values(state.cities)],
    filters: state.filters,
    accentColor: state.filters
      ? getAccentColor(state.filters)
      : state.accentColor,
    playerItem: state.playerItem,
    isPlaying: state.isPlaying,
    actions: {
      setData,
      setMapBounds,
      setInfoBoxItems,
      setSelectedInfoBoxItem,
      setFilters,
      setPlayerItem,
      setIsPlaying
    }
  };
};

export default useGlobalState;
