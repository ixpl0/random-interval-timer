import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeBoxShadow = keyframes`
  from {
    box-shadow: 0 0 0 2px #fff;
  }
  to {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0);
  }
`;

const MainButtonContainer = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  background-color: #3498db;
  color: white;
  font-family: 'bitdust1', monospace;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: none;
  transition: background-color 0.2s;
  outline: none;
  -webkit-app-region: no-drag;

  &:hover {
    background-color: #2980b9;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px #fff;
    animation: ${fadeBoxShadow} 0.5s forwards;
  }

  ${props => props.$isActiveTimer && `
    background-color: #e74c3c;
    
    &:hover {
      background-color: #c0392b;
    }
  `}

  ${props => props.$isBeeping && `
    outline: 2px solid #e74c3c;
  `}
`;

export const MainButton = ({
                             isRunning,
                             isBeeping,
                             mainButtonText,
                             onClick,
                           }) => {
  return (
    <MainButtonContainer
      $isActiveTimer={isRunning}
      $isBeeping={isBeeping}
      onClick={onClick}
    >
      {mainButtonText}
    </MainButtonContainer>
  );
};
