function Genre({ genre }) {
  return <div>{genre}</div>;
}

export default Genre;

Genre.getInitialProps = async ctx => {
  return { genre: ctx.query.genre };
};
