import React from 'react';
import styled from 'styled-components';
import { TimeInputComponent } from './TimeInput';

const SettingsContainer = styled.div`
  font-size: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const SettingsLabel = styled.div`
  color: #bdc3c7;
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
