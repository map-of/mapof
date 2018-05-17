import {injectGlobal} from 'styled-components';

import normalizeCss from './normalize-css';

export default () => injectGlobal`
  ${normalizeCss}

  .mapboxgl-popup-content {
    padding: 0;
    border-radius: 0;
  }
`;
