import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/constants/theme';
import { closeWindow, minimizeWindow } from '@/utils/electronUtils.ts';
import type { HeaderProps } from '@/types';

const fadeBoxShadow = keyframes`
  from {
    box-shadow: 0 0 0 2px ${theme.colors.textPrimary};
  }
  to {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0);
  }
`;

const HeaderContainer = styled.div`
  background-color: ${theme.colors.background};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: ${theme.sizes.gapMedium};
  align-items: center;
`;

const HeaderButton = styled.button`
  width: ${theme.sizes.headerButtonSize};
  height: ${theme.sizes.headerButtonSize};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: none;
  outline: none;
  transition: background-color ${theme.animations.transition.fast};
  -webkit-app-region: no-drag;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.textPrimary};
    animation: ${fadeBoxShadow} ${theme.animations.transition.medium} forwards;
  }
`;

const SettingsButton = styled(HeaderButton)`
  background-color: ${theme.colors.success};

  &:hover {
    background-color: ${theme.colors.successHover};
  }
`;

const MinimizeButton = styled(HeaderButton)`
  background-color: ${theme.colors.warning};

  &:hover {
    background-color: ${theme.colors.warningHover};
  }
`;

const CloseButton = styled(HeaderButton)`
  background-color: ${theme.colors.danger};

  &:hover {
    background-color: ${theme.colors.dangerHover};
  }
`;

const SoundSettingsButton = styled(HeaderButton)`
  background-color: ${theme.colors.info};

  &:hover {
    background-color: ${theme.colors.infoHover};
  }
`;

export const Header: React.FC<HeaderProps> = ({
  activeView,
  showSettings,
  showSoundSettings,
  applySettings,
  applySoundSettings,
  cancelSettings,
}) => {
  const isSettingsVisible = activeView === 'settings';
  const isSoundSettingsVisible = activeView === 'soundSettings';

  const handleSoundSettingsClick = (): void => {
    if (isSoundSettingsVisible) {
      applySoundSettings();
    } else {
      showSoundSettings();
    }
  };

  const handleSettingsClick = (): void => {
    if (isSettingsVisible) {
      applySettings();
    } else {
      showSettings();
    }
  };

  const handleCloseClick = (): void => {
    if (isSettingsVisible || isSoundSettingsVisible) {
      cancelSettings();
    } else {
      closeWindow();
    }
  };

  const handleMinimizeClick = (): void => {
    minimizeWindow();
  };

  const soundSettingsButtonTitle = isSoundSettingsVisible ? 'Apply' : 'Sound Settings';
  const settingsButtonTitle = isSettingsVisible ? 'Apply' : 'Settings';
  const closeButtonTitle = (isSettingsVisible || isSoundSettingsVisible) ? 'Cancel' : 'Close';

  return (
    <HeaderContainer>
      <HeaderButtons>
        <SoundSettingsButton
          title={soundSettingsButtonTitle}
          onClick={handleSoundSettingsClick}
        />
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
