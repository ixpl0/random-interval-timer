import React from 'react';
import styled from 'styled-components';
import { theme } from '../constants/theme';

const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.sizes.gapSmall};
`;

const TimeInput = styled.input`
  background-color: ${theme.colors.backgroundSecondary};
  border: 1px solid ${theme.colors.borderPrimary};
  border-radius: ${theme.sizes.borderRadiusSmall};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize.small};
  height: ${theme.sizes.inputHeight};
  width: ${theme.sizes.inputWidth};
  text-align: center;
  user-select: auto;
  -webkit-app-region: no-drag;

  &:focus {
    outline: none;
    border-color: ${theme.colors.borderFocus};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const MiniSeparator = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.small};
  font-weight: ${theme.typography.fontWeight.bold};
  height: 20px;
`;

export const TimeInputComponent = ({
                                     hours,
                                     minutes,
                                     seconds,
                                     onHoursChange,
                                     onMinutesChange,
                                     onSecondsChange,
                                   }) => {
  return (
    <TimeInputContainer>
      <TimeInput
        type="number"
        value={hours}
        onChange={(e) => onHoursChange(Number(e.target.value))}
        min="0"
        max="99"
      />
      <MiniSeparator>:</MiniSeparator>
      <TimeInput
        type="number"
        value={minutes}
        onChange={(e) => onMinutesChange(Number(e.target.value))}
        min="0"
        max="59"
      />
      <MiniSeparator>:</MiniSeparator>
      <TimeInput
        type="number"
        value={seconds}
        onChange={(e) => onSecondsChange(Number(e.target.value))}
        min="0"
        max="59"
      />
    </TimeInputContainer>
  );
};
