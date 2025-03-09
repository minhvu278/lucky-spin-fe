import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #f8f9fa;
    color: #333;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-weight: 600;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 0.9;
    }
  }

  input, textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: #4a90e2;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyles;

export const theme = {
  colors: {
    primary: '#4a90e2',
    secondary: '#f5a623',
    success: '#7ed321',
    danger: '#d0021b',
    light: '#f8f9fa',
    dark: '#333',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
  }
};