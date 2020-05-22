import {createContext, useReducer, useContext} from 'react';
import {createFeatureCollection} from '../lib/create-feature-collection';

/* Action Types */
const SET_MAP_BOUNDS = 'SET_MAP_BOUNDS';
const SET_DATA = 'SET_DATA';
const SET_INFO_BOX_ITEMS = 'SET_INFO_BOX_ITEMS';
const SET_SELECTED_INFO_BOX_ITEM = 'SET_SELECTED_INFO_BOX_ITEM';

/* Define a context and a reducer for updating the context */
const GlobalStateContext = createContext();

const initialState = {
  mapState: {
    bounds: [-180, -90, 180, 90]
  },
  data: null,
  infoBoxItems: null,
  selectedInfoBoxItem: null,
  genres: null
};

const globalStateReducer = (state, action) => {
  switch (action.type) {
    case SET_MAP_BOUNDS:
      return {
        ...state,
        mapState: {
          ...state.mapState,
          bounds: action.payload
        }
      };

    case SET_DATA:
      return {
        ...state,
        data: action.payload
      };

    case SET_INFO_BOX_ITEMS:
      return {
        ...state,
        infoBoxItems: action.payload,
        selectedInfoBoxItem: null
      };
    case SET_SELECTED_INFO_BOX_ITEM:
      return {
        ...state,
        selectedInfoBoxItem: action.payload
      };

    default:
      return state;
  }
};

/* Export a component to provide the context to its children. This is used in our _app.js file */
export const GlobalStateProvider = ({children, initialData}) => {
  const [state, dispatch] = useReducer(globalStateReducer, {
    ...initialState,
    data: initialData?.data
      ? createFeatureCollection(initialData.data, initialData.genres)
      : initialState.data,
    genres: initialData?.genres ?? initialState.genres
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

  return {
    data: state.data,
    infoBoxItems: state.infoBoxItems,
    selectedInfoBoxItem: state.selectedInfoBoxItem,
    mapState: state.mapState,
    actions: {
      setData,
      setMapBounds,
      setInfoBoxItems,
      setSelectedInfoBoxItem
    }
  };
};

export default useGlobalState;
