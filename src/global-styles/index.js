/* @flow */
import {injectGlobal} from 'styled-components';
import leafletCss from '../../node_modules/leaflet/dist/leaflet.css';

import normalizeCss from './normalize-css';

export default () => injectGlobal`
  ${normalizeCss}
  ${leafletCss}
`;
