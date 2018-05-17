import {injectGlobal} from 'styled-components';

import normalizeCss from './normalize-css';

export default () => injectGlobal`
  ${normalizeCss}
`;
