import useGlobalState from '../hooks/useGlobalState';

function Genre({genre}) {
  return null;
}

export default Genre;

Genre.getInitialProps = async (ctx) => {
  return {genre: ctx.query.genre};
};
