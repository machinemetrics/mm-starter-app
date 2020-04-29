import React from 'react';
import { NavLink } from 'react-router-dom';
import { removeAccessToken, removeJwt } from '../utils/request';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const Header = styled.div`
  border-bottom: solid 1px #eee;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  display: flex;
  color: #555;
  padding: 10px;
  border-radius: 5px;
  border: solid 1px transparent;

  &.active {
    border: solid 1px #ddd;
  }

  &:hover {
    color: #000;
    background-color: #eee;
  }
`;

const StyledNavText = styled.div`
  display: flex;
  padding: 10px;
  margin: 1px;
  color: #555;
`;

const LeftNav = styled.div`
  display: flex;
  flex-direction: row;

  ${StyledNavLink} {
    margin-right: 10px;
  }
`;

const RightNav = styled.div`
  display: flex;
  flex-direction: row;

  ${StyledNavLink} {
    margin-left: 10px;
  }
`;

const NavBar = () => {
  const query = gql`
  query {
    Company {
      name
    }
  }
  `;

  const { data } = useQuery(query);

  const logout = () => {
    removeAccessToken();
    removeJwt();
  };

  return (
    <Header>
      <LeftNav>
        <StyledNavLink exact to="/">Home</StyledNavLink>
        <StyledNavLink to="/machines">Machines</StyledNavLink>
        <StyledNavLink to="/production">Production</StyledNavLink>
        <StyledNavLink to="/downtime">Downtime</StyledNavLink>
        <StyledNavLink to="/console">GraphiQL</StyledNavLink>
      </LeftNav>
      <RightNav>
        <StyledNavText>{data && data.Company[0].name}</StyledNavText>
        <StyledNavLink to="/login" onClick={logout}>Log Out</StyledNavLink>
      </RightNav>
    </Header>
  );
};

export default NavBar;
