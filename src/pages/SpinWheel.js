import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { Wheel } from 'react-custom-roulette';
import { GET_NAMES, ADD_NAME, CLEAR_NAMES } from '../graphql';

const SpinWheelContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WheelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Update the WheelContainer to position the button
const WheelContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NamesSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const NamesList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
`;

const NameItem = styled.div`
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const NameValue = styled.span`
  font-size: 1rem;
`;

const AddNameForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const NameInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const AddButton = styled.button`
  padding: 0 20px;
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  background-color: #d0021b;
  color: white;
  font-weight: 600;
  align-self: flex-start;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

// Add modal components before the SpinWheel component
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease-out forwards;
  
  @keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #4a90e2;
  margin-bottom: 1rem;
`;

const ModalMessage = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const ModalButton = styled.button`
  padding: 10px 25px;
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
  border-radius: 5px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #3a80d2;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const RemoveButton = styled(ModalButton)`
  background-color: #d0021b;
  
  &:hover {
    background-color: #b0011b;
  }
`;

// Add a centered spin button
const CenteredSpinButton = styled.button`
  position: absolute;
  z-index: 10;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background-color: rgba(245, 166, 35, 0.9);
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(224, 150, 18, 0.95);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Array of colors for the wheel slices
const COLORS = [
  '#4a90e2', '#50e3c2', '#b8e986', '#f8e71c', 
  '#f5a623', '#e35b5b', '#bd10e0', '#9013fe'
];

const SpinWheel = () => {
  // Get spinListId from params, but make it optional
  const { spinListId } = useParams();
  
  const [nameInput, setNameInput] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [temporaryNames, setTemporaryNames] = useState([]);
  const [temporaryWinner, setTemporaryWinner] = useState(null);
  
  // Destructure only what you need from useQuery
  const { data, refetch } = useQuery(GET_NAMES, {
    variables: { spinListId: spinListId || 'temporary' },
    fetchPolicy: 'network-only',
    skip: !spinListId // Skip the query if no spinListId
  });
  
  const [addName] = useMutation(ADD_NAME);
  const [clearNames] = useMutation(CLEAR_NAMES);
  // Remove spinTemporaryNames if not used
  
  const handleAddName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    
    if (spinListId) {
      // If we have a spinListId, use the server
      try {
        await addName({ 
          variables: { spinListId, value: nameInput.trim() }
        });
        setNameInput('');
        refetch();
      } catch (err) {
        console.error('Error adding name:', err);
      }
    } else {
      // Otherwise, use local state
      setTemporaryNames([...temporaryNames, { 
        id: Date.now().toString(), 
        value: nameInput.trim() 
      }]);
      setNameInput('');
    }
  };
  
  const handleClearNames = async () => {
    if (window.confirm('Are you sure you want to clear all names?')) {
      if (spinListId) {
        try {
          await clearNames({ variables: { spinListId } });
          refetch();
          setWinnerIndex(null);
        } catch (err) {
          console.error('Error clearing names:', err);
        }
      } else {
        setTemporaryNames([]);
        setTemporaryWinner(null);
      }
    }
  };
  
  const handleSortNames = async () => {
    if (spinListId && data?.getNames?.length) {
      // Create a sorted copy of the names
      const sortedNames = [...data.getNames].sort((a, b) => 
        a.value.localeCompare(b.value)
      );
      
      // Clear existing names
      await clearNames({ variables: { spinListId } });
      
      // Add names back in sorted order
      for (const name of sortedNames) {
        await addName({ 
          variables: { spinListId, value: name.value }
        });
      }
      
      refetch();
      setWinnerIndex(null);
    } else if (temporaryNames.length) {
      // Sort temporary names
      const sortedNames = [...temporaryNames].sort((a, b) => 
        a.value.localeCompare(b.value)
      );
      setTemporaryNames(sortedNames);
      setTemporaryWinner(null);
    }
  };
  
  const handleShuffleNames = async () => {
    if (spinListId && data?.getNames?.length) {
      // Create a shuffled copy of the names
      const shuffledNames = [...data.getNames];
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffledNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
      }
      
      // Clear existing names
      await clearNames({ variables: { spinListId } });
      
      // Add names back in shuffled order
      for (const name of shuffledNames) {
        await addName({ 
          variables: { spinListId, value: name.value }
        });
      }
      
      refetch();
      setWinnerIndex(null);
    } else if (temporaryNames.length) {
      // Shuffle temporary names
      const shuffledNames = [...temporaryNames];
      for (let i = shuffledNames.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
      }
      setTemporaryNames(shuffledNames);
      setTemporaryWinner(null);
    }
  };
  
  const handleRemoveWinner = async () => {
    if (spinListId && winnerIndex !== null && data?.getNames) {
      // Fix the undefined winnerId variable
      const winnerId = data.getNames[winnerIndex].id;
      
      // Create a new array without the winner
      const updatedNames = data.getNames.filter(name => name.id !== winnerId);
      
      // Clear all names
      await clearNames({ variables: { spinListId } });
      
      // Add back all names except the winner
      for (const name of updatedNames) {
        await addName({ 
          variables: { spinListId, value: name.value }
        });
      }
      
      // Close modal and refresh data
      setShowModal(false);
      setWinnerIndex(null);
      refetch();
    } else if (temporaryWinner !== null) {
      // Remove winner from temporary names
      setTemporaryNames(temporaryNames.filter(name => name.id !== temporaryWinner.id));
      setTemporaryWinner(null);
      setShowModal(false);
    }
  };
  
  const handleSpin = async () => {
    if (isSpinning) return;
    
    if (spinListId && data?.getNames?.length) {
      // Use server-side data
      const randomIndex = Math.floor(Math.random() * data.getNames.length);
      setWinnerIndex(randomIndex);
      setIsSpinning(true);
    } else if (temporaryNames.length) {
      // Use client-side data
      try {
        setIsSpinning(true);
        // Generate a random index directly
        const randomIndex = Math.floor(Math.random() * temporaryNames.length);
        const winnerObject = temporaryNames[randomIndex];
        
        setWinnerIndex(randomIndex);
        setTemporaryWinner(winnerObject);
      } catch (err) {
        console.error('Error spinning temporary names:', err);
        setIsSpinning(false);
      }
    }
  };
  
  // Get the appropriate names array
  const namesArray = spinListId ? data?.getNames || [] : temporaryNames;
  
  // Create default data for empty wheel
  const defaultWheelData = [
    { option: 'Add names to spin!', style: { backgroundColor: '#cccccc', textColor: 'white' } }
  ];
  
  // Format data for the wheel, use default if empty
  const wheelData = namesArray.length > 0 
    ? namesArray.map((name, index) => ({
        option: name.value,
        style: { backgroundColor: COLORS[index % COLORS.length], textColor: 'white' }
      })) 
    : defaultWheelData;
  
  return (
    <SpinWheelContainer>
      <WheelSection>
        <SectionTitle>Spin the Wheel</SectionTitle>
        
        <WheelContainer>
          <Wheel
            mustStartSpinning={isSpinning}
            prizeNumber={winnerIndex !== null ? winnerIndex : 0}
            data={wheelData}
            backgroundColors={COLORS}
            textColors={['#ffffff']}
            fontSize={16}
            outerBorderColor="#f5a623"
            outerBorderWidth={3}
            innerBorderColor="#ffffff"
            innerBorderWidth={5}
            radiusLineColor="#ffffff"
            radiusLineWidth={1}
            perpendicularText={true}
            textDistance={60}
            onStopSpinning={() => {
              console.log("Wheel stopped spinning");
              console.log("Winner index:", winnerIndex);
              console.log("Temporary winner:", temporaryWinner);
              console.log("Names array:", namesArray);
              
              setIsSpinning(false);
              
              // Always show modal if we have a valid winner
              if (spinListId && winnerIndex !== null && data?.getNames?.length > 0) {
                console.log("Showing modal for server data");
                setShowModal(true);
              } else if (!spinListId && temporaryNames.length > 0 && winnerIndex !== null) {
                console.log("Showing modal for temporary data");
                setShowModal(true);
              }
            }}
          />
          
          <CenteredSpinButton 
            onClick={handleSpin} 
            disabled={isSpinning || namesArray.length === 0}
          >
            {isSpinning ? '...' : 'SPIN'}
          </CenteredSpinButton>
        </WheelContainer>
      </WheelSection>
      
      <NamesSection>
        <SectionTitle>Names List</SectionTitle>
        
        <AddNameForm onSubmit={handleAddName}>
          <NameInput
            type="text"
            placeholder="Add a name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <AddButton type="submit">Add</AddButton>
        </AddNameForm>
        
        {namesArray.length > 0 && (
          <ButtonGroup>
            <ActionButton onClick={handleSortNames}>
              Sort A-Z
            </ActionButton>
            <ActionButton onClick={handleShuffleNames}>
              Shuffle
            </ActionButton>
            {/* <ClearButton onClick={handleClearNames}>
              Clear All
            </ClearButton> */}
          </ButtonGroup>
        )}
        
        <NamesList>
          {namesArray.length > 0 ? (
            namesArray.map(name => (
              <NameItem key={name.id}>
                <NameValue>{name.value}</NameValue>
              </NameItem>
            ))
          ) : (
            <p>No names added yet. Add some names to spin the wheel!</p>
          )}
        </NamesList>
        
        {namesArray.length > 0 && (
          <ClearButton onClick={handleClearNames}>
            Clear All Names
          </ClearButton>
        )}
      </NamesSection>
      
      {/* Congratulatory Modal */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Congratulations!</ModalTitle>
            <ModalMessage>
              The wheel has selected: <strong>
                {spinListId && data?.getNames && winnerIndex !== null
                  ? data.getNames[winnerIndex]?.value 
                  : temporaryWinner?.value}
              </strong>
            </ModalMessage>
            <ModalButtonGroup>
              <ModalButton onClick={() => setShowModal(false)}>
                Close
              </ModalButton>
              <RemoveButton onClick={handleRemoveWinner}>
                Remove Name
              </RemoveButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </SpinWheelContainer>
  );
};

export default SpinWheel;