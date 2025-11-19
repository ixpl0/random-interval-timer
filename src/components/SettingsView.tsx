import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { TimeSettingsRow } from '@/components/TimeSettingsRow';
import type { SettingsViewProps } from '@/types';

const SettingsContainer = styled.div`
  font-size: ${theme.typography.fontSize.small};
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const SettingsView: React.FC<SettingsViewProps> = ({
  tempSettings,
  updateTempSetting,
}) => {
  return (
    <SettingsContainer>
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
