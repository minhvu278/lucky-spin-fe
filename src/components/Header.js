import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  font-weight: 500;
  color: ${props => props.theme.colors.dark};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo to="/">Lucky Spin</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/create">Create New Wheel</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;