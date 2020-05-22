import {useEffect} from 'react';
import useGlobalState from '../hooks/useGlobalState';
import fetch from 'node-fetch';
import styled from 'styled-components';
import Link from 'next/link';

const Home = styled.div`
  background-color: ${({theme}) => theme.colors.primary};
`;

function HomePage() {
  return (
    <Home>
      <Link href="/[genre]/[region]" as="/rap/berlin">
        <a>cooooolio</a>
      </Link>
    </Home>
  );
}

// HomePage.getInitialProps = async () => {
//   console.log("hooome");
//   const lol = await fetch("https://jsonplaceholder.typicode.com/todos/1");
//   const lol2 = (await lol.json()).title;

//   return { stars: lol2 };
// };

export default HomePage;
