import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { TimeSettingsRow } from '@/components/TimeSettingsRow';
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

export const SettingsView: React.FC<SettingsViewProps> = ({
  isVisible,
  tempSettings,
  updateTempSetting,
}) => {
  return (
    <SettingsContainer $isVisible={isVisible}>
      <TimeSettingsRow
        label="Min"
        hours={tempSettings.minHours}
        minutes={tempSettings.minMinutes}
        seconds={tempSettings.minSeconds}
        onHoursChange={(value: number) => updateTempSetting('minHours', value)}
        onMinutesChange={(value: number) => updateTempSetting('minMinutes', value)}
        onSecondsChange={(value: number) => updateTempSetting('minSeconds', value)}
      />
      <TimeSettingsRow
        label="Max"
        hours={tempSettings.maxHours}
        minutes={tempSettings.maxMinutes}
        seconds={tempSettings.maxSeconds}
        onHoursChange={(value: number) => updateTempSetting('maxHours', value)}
        onMinutesChange={(value: number) => updateTempSetting('maxMinutes', value)}
        onSecondsChange={(value: number) => updateTempSetting('maxSeconds', value)}
      />
    </SettingsContainer>
  );
};
