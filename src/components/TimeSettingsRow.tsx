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
  label,
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
}) => {
  return (
    <SettingsRow>
      <SettingsLabel>{label}:</SettingsLabel>
      <TimeInput
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onHoursChange={onHoursChange}
        onMinutesChange={onMinutesChange}
        onSecondsChange={onSecondsChange}
      />
    </SettingsRow>
  );
};
