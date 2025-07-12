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

const HeaderContainer = styled.div`
  background-color: #2c3e50;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const HeaderButton = styled.button`
  width: 13px;
  height: 13px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: none;
  outline: none;
  transition: background-color 0.2s;
  -webkit-app-region: no-drag;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px #fff;
    animation: ${fadeBoxShadow} 0.5s forwards;
  }
`;

const SettingsButton = styled(HeaderButton)`
  background-color: #27ae60;

  &:hover {
    background-color: #219150;
  }
`;

const MinimizeButton = styled(HeaderButton)`
  background-color: #f1c40f;

  &:hover {
    background-color: #bfa100;
  }
`;

const CloseButton = styled(HeaderButton)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

export const Header = ({
                         isSettingsVisible,
                         showSettings,
                         hideSettings,
                         applySettings,
                       }) => {
  const handleSettingsClick = () => {
    if (isSettingsVisible) {
      applySettings();
    } else {
      showSettings();
    }
  };

  const handleCloseClick = () => {
    if (isSettingsVisible) {
      hideSettings();
    } else {
      window.electronAPI?.close();
    }
  };

  const handleMinimizeClick = () => {
    window.electronAPI?.minimize();
  };

  const settingsButtonTitle = isSettingsVisible ? 'Apply' : 'Settings';
  const closeButtonTitle = isSettingsVisible ? 'Cancel' : 'Close';

  return (
    <HeaderContainer>
      <HeaderButtons>
        <SettingsButton
          title={settingsButtonTitle}
          onClick={handleSettingsClick}
        />
        <MinimizeButton
          title="Minimize"
          onClick={handleMinimizeClick}
        />
        <CloseButton
          title={closeButtonTitle}
          onClick={handleCloseClick}
        />
      </HeaderButtons>
    </HeaderContainer>
  );
};
