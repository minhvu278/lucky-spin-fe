import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CREATE_USER, CREATE_SPIN_LIST, GET_USERS } from '../graphql';

const CreateContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.dark};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.dark};
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.danger};
  margin-top: 1rem;
`;

const CreateSpinList = () => {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [showNewUser, setShowNewUser] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const { loading: loadingUsers, data: userData } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [createSpinList] = useMutation(CREATE_SPIN_LIST);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let userId = selectedUserId;
      
      // If creating a new user
      if (showNewUser) {
        if (!username.trim()) {
          setError('Username is required');
          return;
        }
        
        const { data } = await createUser({ 
          variables: { username },
          refetchQueries: [{ query: GET_USERS }]
        });
        userId = data.createUser.id;
      } else if (!userId) {
        setError('Please select a user');
        return;
      }
      
      if (!title.trim()) {
        setError('Title is required');
        return;
      }
      
      const { data } = await createSpinList({ 
        variables: { userId, title }
      });
      
      navigate(`/spin/${data.createSpinList.id}`);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <CreateContainer>
      <Title>Create New Spin Wheel</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>User</Label>
          {!showNewUser ? (
            <>
              <Select 
                value={selectedUserId} 
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loadingUsers}
              >
                <option value="">Select a user</option>
                {userData?.getUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </Select>
              <Button 
                type="button" 
                onClick={() => setShowNewUser(true)}
                style={{ backgroundColor: '#6c757d' }}
              >
                Create New User
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={() => setShowNewUser(false)}
                style={{ backgroundColor: '#6c757d' }}
              >
                Select Existing User
              </Button>
            </>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>Wheel Title</Label>
          <Input
            type="text"
            placeholder="Enter wheel title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        
        <Button type="submit">Create Spin Wheel</Button>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </CreateContainer>
  );
};

export default CreateSpinList;