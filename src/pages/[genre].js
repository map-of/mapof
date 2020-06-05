import useGlobalState from '../hooks/useGlobalState';

function Genre({genre}) {
  return null;
}

export default Genre;

Genre.getInitialProps = async ({query}) => {
  return {genre: query.genre};
};
