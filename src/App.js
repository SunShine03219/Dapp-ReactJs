import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useEffect } from 'react';

import { NotificationContainer } from 'react-notifications';

import { Home } from './pages/home/home';
import { Pool } from './pages/pool/pool';
import { CreatePool } from "./pages/pool_create/create_pool";
import { CreateFarm } from "./pages/farm_create/create_farm";
import { Nav } from './components/nav';
import { Footer } from './components/footer';
import { Web3ContextProvider } from "./components/web3Context";
import Moralis from 'moralis';

async function moralis_start() {
  await Moralis.start({
    apiKey: "epT1hDYq9X9bHqceWqkeVNowMjrS79w9TQLxFstYrok4lbkt2XibAGK4hvChS0Td",
  });
}

moralis_start();

function App() {

  return (
    <Web3ContextProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Pool />} />
          <Route path="/farm" element={<Home />} />
          <Route path="/pool" element={<Pool />} />
          <Route path="/single" element={<CreatePool />} />
          <Route path="/lp" element={<CreateFarm />} />
        </Routes>
        <NotificationContainer />
        <Footer />
      </Router>
    </Web3ContextProvider>
  );
}

export default App;
