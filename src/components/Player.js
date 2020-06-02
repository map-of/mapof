import useGlobalState from '../hooks/useGlobalState';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: absolute;
  height: ${({visible}) => (visible ? '80px' : '0')};
  width: 485px;
  bottom: 40px;
  right: 40px;
  z-index: 300;
`;

function Player() {
  const {playerItem, isPlaying} = useGlobalState();

  const url = playerItem?.properties?.mediaLink;

  return (
    <PlayerContainer visible={Boolean(playerItem)}>
      <ReactPlayer
        url={url}
        playing={isPlaying}
        width="100%"
        height="100%"
        controls={false}
      />
    </PlayerContainer>
  );
}

export default Player;
