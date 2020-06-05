import useGlobalState from '../hooks/useGlobalState';
import Select from 'react-select';
import chroma from 'chroma-js';

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    position: 'absolute',
    top: '40px',
    left: '40px',
    width: '400px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    borderRadius: '3px'
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: '#898989'
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    paddingLeft: '20px',
    paddingTop: '13px',
    paddingBottom: '13px'
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    marginRight: '32px'
  }),
  control: (provided, state) => ({
    ...provided,
    borderRadius: '3px',
    background: 'white',
    height: '100%',
    border: 'none',
    boxShadow: 'none'
  }),

  option: (styles, {data, isDisabled, isFocused, isSelected}) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css())
      }
    };
  },

  menu: (styles, {data}) => {
    return {
      ...styles,
      transform: 'translateY(-13px)',
      paddingTop: '2px',
      zIndex: -1,
      borderRadius: '3px'
    };
  },
  multiValue: (styles, {data}) => {
    const c = chroma(data.color);
    return {
      ...styles,
      backgroundColor: data.color,
      height: '30px',
      borderRadius: '30px',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px 14px'
    };
  },
  multiValueLabel: (styles, {data}) => ({
    ...styles,
    fontFamily: "'PT Sans', sans-serif",
    color: '#fff',
    padding: '0'
  }),
  multiValueRemove: (styles, {data}) => ({
    ...styles,
    color: data.color,
    borderRadius: '30px',
    color: 'white',

    ':hover': {
      backgroundColor: data.color
    }
  })
};

function SearchBar() {
  const {searchTags, filters, actions} = useGlobalState();

  return (
    <Select
      onChange={(filters) => actions.setFilters(filters)}
      instanceId="selector"
      options={searchTags}
      styles={customStyles}
      isMulti
      placeholder="Discover new music"
      value={filters}
      components={{
        DropdownIndicator: () => (
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12.5" cy="7.5" r="7" stroke="#333333" />
            <line
              x1="0.646447"
              y1="19.7175"
              x2="7.71751"
              y2="12.6464"
              stroke="black"
            />
          </svg>
        ),
        IndicatorSeparator: () => null
      }}
    />
  );
}

export default SearchBar;
