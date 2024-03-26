import * as React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        // This is the parent component that will render the child components based on the URL.
        // Only one child component will be rendered at a time.
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;