import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/constants/theme';
import type { MainButtonProps } from '@/types';

const fadeBoxShadow = keyframes`
  from {
    box-shadow: 0 0 0 2px ${theme.colors.textPrimary};
  }
  to {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0);
  }
`;

interface StyledMainButtonProps {
  $isActiveTimer: boolean;
  $isBeeping: boolean;
}

const StyledMainButton = styled.button<StyledMainButtonProps>`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: ${theme.sizes.borderRadiusMedium};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.medium};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  box-shadow: none;
  transition: background-color ${theme.animations.transition.fast};
  outline: none;
  -webkit-app-region: no-drag;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.textPrimary};
    animation: ${fadeBoxShadow} ${theme.animations.transition.medium} forwards;
  }

  ${(props) => props.$isActiveTimer && `
    background-color: ${theme.colors.danger};

    &:hover {
      background-color: ${theme.colors.dangerHover};
    }
  `}

  ${(props) => props.$isBeeping && `
    outline: 3px solid ${theme.colors.danger};
  `}
`;

export const MainButton: React.FC<MainButtonProps> = ({
  isRunning,
  isBeeping,
  mainButtonText,
  onClick,
}) => {
  return (
    <StyledMainButton
      $isActiveTimer={isRunning}
      $isBeeping={isBeeping}
      onClick={onClick}
    >
      {mainButtonText}
    </StyledMainButton>
  );
};
