import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GET_SPIN_LISTS } from '../graphql';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.dark};
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #666;
`;

const CreateButton = styled(Link)`
  display: block;
  width: fit-content;
  margin: 0 auto 3rem;
  padding: 12px 24px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const SpinListsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const SpinListCard = styled(Link)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const SpinListTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.dark};
`;

const SpinListAuthor = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
  color: ${props => props.theme.colors.danger};
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_SPIN_LISTS);

  if (loading) return <LoadingMessage>Loading spin lists...</LoadingMessage>;
  if (error) return <ErrorMessage>Error loading spin lists: {error.message}</ErrorMessage>;

  return (
    <HomeContainer>
      <Title>Welcome to Lucky Spin</Title>
      <Description>
        Create your own spin wheel and randomly select names, winners, or anything else!
      </Description>
      
      <CreateButton to="/create">Create New Wheel</CreateButton>
      
      <SpinListsGrid>
        {data.getSpinLists.map(spinList => (
          <SpinListCard key={spinList.id} to={`/spin/${spinList.id}`}>
            <SpinListTitle>{spinList.title}</SpinListTitle>
            <SpinListAuthor>Created by: {spinList.user.username}</SpinListAuthor>
          </SpinListCard>
        ))}
      </SpinListsGrid>
    </HomeContainer>
  );
};

export default Home;