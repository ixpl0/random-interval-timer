import React from 'react';
import styled from 'styled-components';

const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const TimeInput = styled.input`
  background-color: #2c3845;
  border: 1px solid #4a5f7a;
  border-radius: 6px;
  color: white;
  font-family: 'bitdust1', monospace;
  font-size: 16px;
  height: 24px;
  width: 32px;
  text-align: center;
  user-select: auto;
  -webkit-app-region: no-drag;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const MiniSeparator = styled.span`
  color: #bdc3c7;
  font-size: 16px;
  font-weight: bold;
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
