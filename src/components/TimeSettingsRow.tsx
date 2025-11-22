import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import { TimeInput } from '@/components/TimeInput';
import type { TimeSettingsRowProps } from '@/types';

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.sizes.gapSmall};
`;

const SettingsLabel = styled.div`
  color: ${theme.colors.textSecondary};
  width: 40px;
`;

export const TimeSettingsRow: React.FC<TimeSettingsRowProps> = ({
  type,
  tempSettings,
  updateTempSetting,
  isInvalid,
}) => {
  const label = type === 'min' ? 'Min' : 'Max';
  const hours = type === 'min' ? tempSettings.minHours : tempSettings.maxHours;
  const minutes = type === 'min' ? tempSettings.minMinutes : tempSettings.maxMinutes;
  const seconds = type === 'min' ? tempSettings.minSeconds : tempSettings.maxSeconds;

  return (
    <SettingsRow>
      <SettingsLabel>{label}:</SettingsLabel>
      <TimeInput
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onHoursChange={(value: number) => updateTempSetting(`${type}Hours`, value)}
        onMinutesChange={(value: number) => updateTempSetting(`${type}Minutes`, value)}
        onSecondsChange={(value: number) => updateTempSetting(`${type}Seconds`, value)}
        isInvalid={isInvalid}
      />
    </SettingsRow>
  );
};
