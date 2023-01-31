import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//custom imports
import GetData from './components/getData/GetData';
import NotFound from './components/notFound/NotFound';

/**
 * The function will handle all the routes to the client
 * @route / To the main app
 * @route * Invalid route to not found page 
 * @returns 
 */
const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<GetData />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;