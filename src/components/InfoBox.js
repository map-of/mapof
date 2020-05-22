import useGlobalState from '../hooks/useGlobalState';
import styled from 'styled-components';

const InfoBox = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  bottom: 40px;
  width: 485px;
  z-index: 1;
  background: ${({color}) => color || 'white'};
`;

const InfoBoxItem = styled.div`
  background: ${({color}) => color};
`;

function HomePage() {
  const {infoBoxItems, selectedInfoBoxItem} = useGlobalState();

  if (selectedInfoBoxItem) {
    return (
      <InfoBox color={selectedInfoBoxItem.properties.color}>
        <InfoBoxItem>
          {selectedInfoBoxItem.properties.name} -{' '}
          {selectedInfoBoxItem.properties.genre}
        </InfoBoxItem>
      </InfoBox>
    );
  }

  if (!infoBoxItems) {
    return null;
  }

  return (
    <InfoBox>
      {infoBoxItems.map(({properties: {color, name, genre}}) => {
        return (
          <InfoBoxItem color={color}>
            {name} - {genre}
          </InfoBoxItem>
        );
      })}
    </InfoBox>
  );
}

export default HomePage;
