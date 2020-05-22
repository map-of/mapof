import {createContext, useReducer, useContext} from 'react';

/* Action Types */
const SET_MAP_BOUNDS = 'SET_MAP_BOUNDS';

/* Define a context and a reducer for updating the context */
const GlobalStateContext = createContext();

const initialState = {
  mapState: {
    bounds: [-180, -90, 180, 90]
  }
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

    default:
      return state;
  }
};

/* Export a component to provide the context to its children. This is used in our _app.js file */
export const GlobalStateProvider = ({children}) => {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);

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

  const setMapBounds = async (bounds) => {
    dispatch({
      type: SET_MAP_BOUNDS,
      payload: bounds
    });
  };

  return {
    mapState: state.mapState,
    setMapBounds
  };
};

export default useGlobalState;
