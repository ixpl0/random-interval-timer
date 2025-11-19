import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { SOUND_OPTIONS } from '@/constants';
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
  gap: ${theme.sizes.gapMedium};
`;

const SoundControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.sizes.gapMedium};
`;

const SoundButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

const VolumeSliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 30px;
  height: 60px;
  justify-content: center;
`;

const VolumeSlider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 72px;
  height: 20px;
  outline: none;
  transform: rotate(-90deg) translate(9px, 21px);
  transform-origin: 50% 50%;
  cursor: pointer;
  -webkit-app-region: no-drag;  

  &::-webkit-slider-runnable-track {
    height: 8px;
    background: ${theme.colors.backgroundSecondary};
    border-radius: 4px;
    -webkit-appearance: none;
  }
  
  &::-webkit-slider-container {
    background-color: ${theme.colors.background};
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
    margin-top: -6px;
    transition: background-color ${theme.animations.transition.fast};

    &:hover {
      background-color: ${theme.colors.primaryHover};
    }
  }
`;

export const SoundSettingsView: React.FC<SoundSettingsViewProps> = ({
  isVisible,
  tempSoundSettings,
  updateTempSoundSetting,
  updateTempVolume,
}) => {
  const handleSoundSelect = (soundType: SoundType): void => {
    updateTempSoundSetting(soundType);
    void playSound(soundType, tempSoundSettings.volume);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(event.target.value);

    updateTempVolume(newVolume);
  };

  return (
    <SoundSettingsContainer $isVisible={isVisible}>
      <SoundControlsWrapper>
        <VolumeSliderWrapper>
          <VolumeSlider
            min="0"
            max="1"
            step="0.01"
            value={tempSoundSettings.volume}
            onChange={handleVolumeChange}
            title={`Volume: ${Math.round(tempSoundSettings.volume * 100)}%`}
          />
        </VolumeSliderWrapper>
        <SoundButtonsGrid>
          {SOUND_OPTIONS.map((sound) => (
            <SoundButton
              key={sound.type}
              $isSelected={tempSoundSettings.selectedSound === sound.type}
              onClick={() => handleSoundSelect(sound.type)}
              title={sound.label}
            >
              {sound.icon}
            </SoundButton>
          ))}
        </SoundButtonsGrid>
      </SoundControlsWrapper>
    </SoundSettingsContainer>
  );
};
