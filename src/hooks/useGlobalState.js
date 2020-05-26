import {createContext, useReducer, useContext} from 'react';
import produce from 'immer';

import {createFeatureCollection} from '../lib/create-feature-collection';
import {createSubgenreColors} from '../lib/create-subgenre-colors';

/* Action Types */
const SET_MAP_BOUNDS = 'SET_MAP_BOUNDS';
const SET_DATA = 'SET_DATA';
const SET_INFO_BOX_ITEMS = 'SET_INFO_BOX_ITEMS';
const SET_SELECTED_INFO_BOX_ITEM = 'SET_SELECTED_INFO_BOX_ITEM';
const SET_FILTERS = 'SET_FILTERS';

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
  playerItem: null
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

  const getSearchTags = () => {};

  return {
    data: state.data,
    filteredData: state.filters
      ? filterData(state.data, state.filters)
      : state.data,
    infoBoxItems: state.infoBoxItems,
    selectedInfoBoxItem: state.selectedInfoBoxItem,
    mapState: state.mapState,
    genres: state.genres,
    cities: state.cities,
    searchTags: [...state.genres, ...Object.values(state.cities)],
    filters: state.filters,
    actions: {
      setData,
      setMapBounds,
      setInfoBoxItems,
      setSelectedInfoBoxItem,
      setFilters
    }
  };
};

export default useGlobalState;
