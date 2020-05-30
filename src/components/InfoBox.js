import useGlobalState from '../hooks/useGlobalState';
import styled from 'styled-components';
import chroma from 'chroma-js';

const InfoBox = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  bottom: 40px;
  width: 485px;
  z-index: 1;
  background: ${({accentColor}) => chroma(accentColor).brighten(0.25)};
  overflow-y: auto;
  color: #fff;
  display: grid;
  grid-template-rows: 90px auto;
  grid-gap: 1px;
  align-content: start;
`;

const InfoBoxHeader = styled.div`
  padding: 25px 70px 25px 40px;
  width: 100%;
  background: green;
  position: sticky;
  top: 0;
`;

const InfoBoxImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  /* right: 0;
  bottom: 0; */
  filter: ${({rotate}) => `hue-rotate(${rotate}deg) blur(1px);`};
  left: 0;
  object-fit: cover;
  z-index: -1;
`;
const InfoBoxTitle = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 16px;
`;

const InfoBoxSubtitle = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 12px;
`;

const InfoBoxItem = styled.div`
  /* height: 100px; */
  display: grid;
  grid-gap: 1px;
  grid-template-columns: 100px 1fr;
  align-self: start;
`;

const InfoBoxItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoBoxItemInfo = styled.div`
  background: ${({color}) => color};
  display: grid;
  grid-template-rows: 1fr 1fr;
  padding: 18px 0 10px 18px;
`;

const InfoBoxItemTop = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr 30px;
  padding-right: 23px;
`;

const InfoBoxItemTitle = styled.div`
  font-size: 18px;
`;

const InfoBoxItemSubtitle = styled.div`
  font-size: 12px;
`;

const InfoBoxItemAction = styled.button`
  grid-row: span 2;
  /* background: black; */
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  align-self: center;
  cursor: pointer;
`;
const InfoBoxItemGenres = styled.div`
  display: flex;
  align-items: flex-end;
`;

const InfoBoxItemGenre = styled.div`
  color: ${({color}) => color};
  background: #fff;
  margin-right: 5px;
  height: 30px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
`;

function HomePage() {
  const {
    infoBoxItems,
    selectedInfoBoxItem,
    filters,
    accentColor
  } = useGlobalState();

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
    <InfoBox accentColor={accentColor}>
      <InfoBoxHeader>
        <InfoBoxImage
          rotate={chroma(accentColor).hsl()[0]}
          accentColor={accentColor}
          src="https://www.verbraucherzentrale.de/sites/default/files/styles/article_full_image_desktop/public/2018-07/Festival-Fotolia_142515887_M-melinda-nagy.jpg?itok=awxjNvOV&h=a22c0743"
        />
        <InfoBoxTitle>
          {filters.map((filter) => (
            <span>{filter.label.toUpperCase()} </span>
          ))}
        </InfoBoxTitle>
        <InfoBoxSubtitle>{infoBoxItems.length} entries</InfoBoxSubtitle>
      </InfoBoxHeader>
      {infoBoxItems.map(({properties: {color, name, genres}}) => {
        return (
          <InfoBoxItem key={name}>
            <InfoBoxItemImage
              loading="lazy"
              src="https://placekitten.com/200/301"
            />
            <InfoBoxItemInfo color={color}>
              <InfoBoxItemTop>
                <InfoBoxItemTitle> {name}</InfoBoxItemTitle>
                <InfoBoxItemAction>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="15" cy="15" r="14.5" stroke="white" />
                    <path d="M10.5 8V22L21.5 15L10.5 8Z" fill="white" />
                  </svg>
                </InfoBoxItemAction>
                <InfoBoxItemSubtitle>
                  linked with {genres.length} genre
                  {genres.length > 1 ? 's' : ''}
                </InfoBoxItemSubtitle>
              </InfoBoxItemTop>
              <InfoBoxItemGenres>
                {genres.map((genre) => (
                  <InfoBoxItemGenre color={color}>
                    #{genre.toUpperCase()}{' '}
                  </InfoBoxItemGenre>
                ))}
              </InfoBoxItemGenres>
            </InfoBoxItemInfo>
          </InfoBoxItem>
        );
      })}
    </InfoBox>
  );
}

export default HomePage;
