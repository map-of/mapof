import {useEffect} from 'react';
import useGlobalState from '../hooks/useGlobalState';
import fetch from 'node-fetch';
import styled from 'styled-components';
import Link from 'next/link';

const Home = styled.div`
  background-color: ${({theme}) => theme.colors.primary};
`;

function HomePage() {
  // const {data} = useGlobalState();

  return (
    <Home>
      {/* <Link href="/[genre]/[region]" as="/rap/berlin">
        <a>cooooolio</a>
      </Link> */}
    </Home>
  );
}

export default HomePage;
