import styled from 'styled-components';
import Link from 'next/link';

const Home = styled.div`
  background-color: ${({theme}) => theme.colors.primary};
`;

function HomePage() {
  return (
    <Home>
      <Link href="/[genre]" as="/rap">
        <a>coolio</a>
      </Link>
    </Home>
  );
}

export default HomePage;
