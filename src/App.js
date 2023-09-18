import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Switch } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import Routes from './store/AppRoutes';

function App() {
  const [theme, setTheme] = useState(false);

  const blackShades = {
    50: '#121212',
    100: '#0d0d0d',
    200: '#000',
    // Add more shades as needed
  };

  // Create the custom dark theme
  const darkTheme = createTheme({
    palette: {
      mode: theme ? 'dark' : 'dark',
         // primary: {
      //   main: whiteShades[200], // Use your desired shade as the primary color
      // },
     
      // background: {
      //   paper: theme ? '#222327' : '#efefef',
      // },
    },
  });

  const handleChange = (event) => {
    setTheme(event.target.checked);
  };

  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <label>Dark Mode</label>
          <Switch
            checked={theme}
            color="success"
            onChange={handleChange}
          />
          <style>
            {`
              body {
                background-color: ${darkTheme.palette.mode === 'dark'
                  ? blackShades[200] // Use the dark shade for the body background
                  : 'inherit'};
              }
            `}
          </style>
          <Routes />
        </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
