import useGlobalState from '../hooks/useGlobalState';
import styled from 'styled-components';
import chroma from 'chroma-js';

const SubmitContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  bottom: 40px;
  width: 485px;
  z-index: 2;
  background: ${({accentColor}) => chroma(accentColor).brighten(0.25)};
  color: #fff;
`;

const SubmitHeader = styled.div`
  padding: 25px 70px 25px 40px;
  width: 100%;
  height: 90px;
  background: green;
  position: sticky;
  top: 0;
  z-index: 1;
`;

function Submit() {
  const {accentColor, actions} = useGlobalState();

  return (
    <SubmitContainer accentColor={accentColor}>
      <SubmitHeader>Moin</SubmitHeader>
    </SubmitContainer>
  );
}

export default Submit;
