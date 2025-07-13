import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { TimeInput } from '@/components/TimeInput';
import type { SettingsViewProps } from '@/types';

interface SettingsContainerProps {
  $isVisible: boolean;
}

const SettingsContainer = styled.div<SettingsContainerProps>`
  font-size: ${theme.typography.fontSize.small};
  display: ${(props) => props.$isVisible ? 'flex' : 'none'};
  flex-direction: column;
  gap: 5px;
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.sizes.gapSmall};
`;

const SettingsLabel = styled.div`
  color: ${theme.colors.textSecondary};
  width: 40px;
`;

export const SettingsView: React.FC<SettingsViewProps> = ({
  isVisible,
  tempSettings,
  updateTempSetting,
}) => {
  return (
    <SettingsContainer $isVisible={isVisible}>
      <SettingsRow>
        <SettingsLabel>Min:</SettingsLabel>
        <TimeInput
          hours={tempSettings.minHours}
          minutes={tempSettings.minMinutes}
          seconds={tempSettings.minSeconds}
          onHoursChange={(value: number) => updateTempSetting('minHours', value)}
          onMinutesChange={(value: number) => updateTempSetting('minMinutes', value)}
          onSecondsChange={(value: number) => updateTempSetting('minSeconds', value)}
        />
      </SettingsRow>
      <SettingsRow>
        <SettingsLabel>Max:</SettingsLabel>
        <TimeInput
          hours={tempSettings.maxHours}
          minutes={tempSettings.maxMinutes}
          seconds={tempSettings.maxSeconds}
          onHoursChange={(value: number) => updateTempSetting('maxHours', value)}
          onMinutesChange={(value: number) => updateTempSetting('maxMinutes', value)}
          onSecondsChange={(value: number) => updateTempSetting('maxSeconds', value)}
        />
      </SettingsRow>
    </SettingsContainer>
  );
};
