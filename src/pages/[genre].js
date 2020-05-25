import useGlobalState from '../hooks/useGlobalState';

function Genre({genre}) {
  return <div style={{background: 'white'}}>{genre}</div>;
}

export default Genre;

Genre.getInitialProps = async (ctx) => {
  return {genre: ctx.query.genre};
};
