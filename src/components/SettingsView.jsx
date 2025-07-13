import React from 'react';
import styled from 'styled-components';
import { theme } from '../constants/theme';
import { TimeInputComponent } from './TimeInput';

const SettingsContainer = styled.div`
  font-size: ${theme.typography.fontSize.small};
  display: flex;
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

export const SettingsView = ({
                               tempSettings,
                               updateTempSetting,
                             }) => {
  return (
    <SettingsContainer>
      <SettingsRow>
        <SettingsLabel>MIN</SettingsLabel>
        <TimeInputComponent
          hours={tempSettings.minHours}
          minutes={tempSettings.minMinutes}
          seconds={tempSettings.minSeconds}
          onHoursChange={(value) => updateTempSetting('minHours', value)}
          onMinutesChange={(value) => updateTempSetting('minMinutes', value)}
          onSecondsChange={(value) => updateTempSetting('minSeconds', value)}
        />
      </SettingsRow>

      <SettingsRow>
        <SettingsLabel>MAX</SettingsLabel>
        <TimeInputComponent
          hours={tempSettings.maxHours}
          minutes={tempSettings.maxMinutes}
          seconds={tempSettings.maxSeconds}
          onHoursChange={(value) => updateTempSetting('maxHours', value)}
          onMinutesChange={(value) => updateTempSetting('maxMinutes', value)}
          onSecondsChange={(value) => updateTempSetting('maxSeconds', value)}
        />
      </SettingsRow>
    </SettingsContainer>
  );
};
