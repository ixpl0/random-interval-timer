import React from 'react';
import styled from 'styled-components';
import { theme } from '@/constants/theme';
import type { TimeInputProps } from '@/types';

const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.sizes.gapSmall};
`;

interface TimeInputFieldProps {
  $isInvalid: boolean;
}

const TimeInputField = styled.input<TimeInputFieldProps>`
  background-color: ${theme.colors.backgroundSecondary};
  border: 1px solid ${(props) => (props.$isInvalid ? theme.colors.danger : theme.colors.borderPrimary)};
  border-radius: ${theme.sizes.borderRadiusSmall};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.small};
  height: ${theme.sizes.inputHeight};
  width: ${theme.sizes.inputWidth};
  text-align: center;
  user-select: auto;
  -webkit-app-region: no-drag;
  transition: border-color ${theme.animations.transition.fast};

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$isInvalid ? theme.colors.danger : theme.colors.borderFocus)};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const TimeSeparator = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.bold};
  height: 20px;
`;

export const TimeInput: React.FC<TimeInputProps> = ({
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  isInvalid,
}) => {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onHoursChange(parseInt(e.target.value, 10) || 0);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onMinutesChange(parseInt(e.target.value, 10) || 0);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSecondsChange(parseInt(e.target.value, 10) || 0);
  };

  return (
    <TimeInputContainer>
      <TimeInputField
        type="number"
        value={hours}
        onChange={handleHoursChange}
        min="0"
        max="99"
        $isInvalid={isInvalid}
      />
      <TimeSeparator>:</TimeSeparator>
      <TimeInputField
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        min="0"
        max="59"
        $isInvalid={isInvalid}
      />
      <TimeSeparator>:</TimeSeparator>
      <TimeInputField
        type="number"
        value={seconds}
        onChange={handleSecondsChange}
        min="0"
        max="59"
        $isInvalid={isInvalid}
      />
    </TimeInputContainer>
  );
};
