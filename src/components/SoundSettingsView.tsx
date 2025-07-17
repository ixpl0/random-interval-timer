import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { playSound } from '@/utils/audioUtils';
import type { SoundSettingsViewProps, SoundType } from '@/types';

interface SoundSettingsContainerProps {
  $isVisible: boolean;
}

const SoundSettingsContainer = styled.div<SoundSettingsContainerProps>`
  font-size: ${theme.typography.fontSize.small};
  display: ${(props) => props.$isVisible ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SoundButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${theme.sizes.gapSmall};
  max-width: 150px;
`;

interface SoundButtonProps {
  $isSelected: boolean;
}

const SoundButton = styled.button<SoundButtonProps>`
  width: 27px;
  height: 27px;
  border: none;
  border-radius: ${theme.sizes.borderRadiusSmall};
  background-color: ${(props) => props.$isSelected ? theme.colors.primary : theme.colors.backgroundSecondary};
  color: ${(props) => props.$isSelected ? theme.colors.textPrimary : theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${theme.animations.transition.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  font-family: ${theme.typography.fontFamily};
  -webkit-app-region: no-drag;

  &:hover {
    background-color: ${(props) => props.$isSelected ? theme.colors.primaryHover : theme.colors.primary};
    color: ${theme.colors.textPrimary};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.textPrimary};
  }
`;

const soundIcons: Record<SoundType, string> = {
  random: '🎲',
  beep: '📢',
  chime: '🔔',
  alert: '🚨',
  ding: '🔊',
  whistle: '🎵',
  chirp: '🐦',
  pulse: '⚡',
  bass: '🔉',
  drum: '🥁',
};

const soundLabels: Record<SoundType, string> = {
  random: 'Random',
  beep: 'Beep',
  chime: 'Chime',
  alert: 'Alert',
  ding: 'Ding',
  whistle: 'Whistle',
  chirp: 'Chirp',
  pulse: 'Pulse',
  bass: 'Bass',
  drum: 'Drum',
};

export const SoundSettingsView: React.FC<SoundSettingsViewProps> = ({
  isVisible,
  tempSoundSettings,
  updateTempSoundSetting,
}) => {
  const soundTypes: SoundType[] = ['random', 'beep', 'chime', 'alert', 'ding', 'whistle', 'chirp', 'pulse', 'bass', 'drum'];

  const handleSoundSelect = (soundType: SoundType): void => {
    updateTempSoundSetting(soundType);
    playSound(soundType);
  };

  return (
    <SoundSettingsContainer $isVisible={isVisible}>
      <SoundButtonsGrid>
        {soundTypes.map((soundType) => (
          <SoundButton
            key={soundType}
            $isSelected={tempSoundSettings.selectedSound === soundType}
            onClick={() => handleSoundSelect(soundType)}
            title={soundLabels[soundType]}
          >
            {soundIcons[soundType]}
          </SoundButton>
        ))}
      </SoundButtonsGrid>
    </SoundSettingsContainer>
  );
};
