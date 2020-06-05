import useGlobalState from '../hooks/useGlobalState';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: absolute;
  height: ${({visible}) => (visible ? '225px' : '0')};
  width: 400px;
  bottom: 40px;
  left: 40px;
  z-index: 300;
`;

function Player() {
  const {playerItem, isPlaying, actions, infoBoxItems} = useGlobalState();

  if (!playerItem) {
    return null;
  }

  const url = playerItem?.properties?.mediaLink;

  return (
    <PlayerContainer visible={Boolean(playerItem)}>
      <ReactPlayer
        url={url}
        playing={isPlaying}
        width="100%"
        height="100%"
        controls={true}
        onEnded={() => {
          actions.setPlayerItem(
            infoBoxItems[
              Math.floor(Math.random() * (infoBoxItems.length - 0) + 0)
            ]
          );
        }}
        onPause={() => actions.setIsPlaying(false)}
        onPlay={() => actions.setIsPlaying(true)}
      />
    </PlayerContainer>
  );
}

export default Player;
