import useGlobalState from '../hooks/useGlobalState';
import styled from 'styled-components';
import chroma from 'chroma-js';

const InfoBoxContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  bottom: ${({playerActive}) => (playerActive ? '120px' : '40px')};
  width: 485px;
  z-index: 1;
  background: ${({accentColor}) => chroma(accentColor).brighten(0.25)};
  overflow-y: auto;
  color: #fff;
  display: grid;
  grid-template-rows: auto;
  grid-gap: 1px;
  align-content: start;
`;

const InfoBoxHeader = styled.div`
  padding: 25px 70px 25px 40px;
  width: 100%;
  height: 90px;
  background: green;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const InfoBoxImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  filter: ${({rotate}) => `hue-rotate(${rotate}deg) blur(1px)`};
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
  display: grid;
  grid-gap: 1px;
  grid-template-columns: 1fr;
  align-self: start;
  position: ${({isActive}) => (isActive ? 'sticky' : 'relative')};
  top: ${({isActive}) => (isActive ? '90px' : 'initial')};
  bottom: ${({isActive}) => (isActive ? '0' : 'initial')};
  z-index: ${({isActive}) => (isActive ? '1' : 'initial')};
  border-top: ${({isActive, color}) =>
    isActive ? `1px solid ${chroma(color).darken(1)}` : `1px solid ${color}`};
  border-bottom: ${({isActive, color}) =>
    isActive ? `1px solid ${chroma(color).darken(1)}` : `1px solid ${color}`};
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

const play = (
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
);

const pause = (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="15" cy="15" r="14.5" stroke="white" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13 22H9V8H13V22ZM17 22V8H21V22H17Z"
      fill="white"
    />
  </svg>
);

function InfoBox() {
  const {
    infoBoxItems,
    selectedInfoBoxItem,
    filters,
    accentColor,
    actions,
    playerItem,
    isPlaying
  } = useGlobalState();

  if (selectedInfoBoxItem) {
    return (
      <InfoBoxContainer
        playerActive={Boolean(playerItem)}
        color={selectedInfoBoxItem.properties.color}
        accentColor={accentColor}
      >
        <InfoBoxItem>
          {selectedInfoBoxItem.properties.name} -{' '}
          {selectedInfoBoxItem.properties.genre}
        </InfoBoxItem>
      </InfoBoxContainer>
    );
  }

  if (!infoBoxItems) {
    return null;
  }

  return (
    <InfoBoxContainer
      accentColor={accentColor}
      playerActive={Boolean(playerItem)}
    >
      <InfoBoxHeader>
        <InfoBoxImage
          rotate={chroma(accentColor).hsl()[0]}
          accentColor={accentColor}
          src="https://www.verbraucherzentrale.de/sites/default/files/styles/article_full_image_desktop/public/2018-07/Festival-Fotolia_142515887_M-melinda-nagy.jpg?itok=awxjNvOV&h=a22c0743"
        />
        <InfoBoxTitle>
          {filters &&
            filters.map((filter) => <span>{filter.label.toUpperCase()} </span>)}
        </InfoBoxTitle>
        <InfoBoxSubtitle>{infoBoxItems.length} entries</InfoBoxSubtitle>
      </InfoBoxHeader>
      {infoBoxItems.map((item) => {
        const {
          properties: {color, name, genres, id}
        } = item;
        const itemGenres =
          typeof genres === 'string' ? JSON.parse(genres) : genres;

        return (
          <InfoBoxItem
            key={name}
            isActive={playerItem?.properties?.id === id}
            color={color}
          >
            {/* <InfoBoxItemImage
              loading="lazy"
              src="https://placekitten.com/200/301"
            /> */}
            <InfoBoxItemInfo color={color}>
              <InfoBoxItemTop>
                <InfoBoxItemTitle> {name}</InfoBoxItemTitle>
                <InfoBoxItemAction
                  onClick={() =>
                    playerItem?.properties?.id === id
                      ? isPlaying
                        ? actions.setIsPlaying(false)
                        : actions.setIsPlaying(true)
                      : actions.setPlayerItem(item)
                  }
                >
                  {playerItem?.properties?.id === id
                    ? isPlaying
                      ? pause
                      : play
                    : play}
                </InfoBoxItemAction>
                <InfoBoxItemSubtitle>
                  linked with {itemGenres.length} genre
                  {itemGenres.length > 1 ? 's' : ''}
                </InfoBoxItemSubtitle>
              </InfoBoxItemTop>
              <InfoBoxItemGenres>
                {itemGenres.map((genre) => (
                  <InfoBoxItemGenre color={color}>
                    #{genre.toUpperCase()}{' '}
                  </InfoBoxItemGenre>
                ))}
              </InfoBoxItemGenres>
            </InfoBoxItemInfo>
          </InfoBoxItem>
        );
      })}
    </InfoBoxContainer>
  );
}

export default InfoBox;
