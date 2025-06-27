import React from 'react';
import styles from './keypad.module.css';

interface KeypadProps {
  onKeyPress: (value: string | number) => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
  // Define key values and their display labels
  const keyRows = [
    [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' }
    ],
    [
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 0, label: '0' },
      { value: 'Backspace', label: '⌫' },
      { value: 'Enter', label: '↵' }
    ]
  ];

  return (
    <div
      className={styles.container}
      onMouseDown={event => {
        // Prevent default behavior to avoid text input blurring
        event.preventDefault();
      }}
    >
      {keyRows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map(({ value, label }) => (
            <button
              className={styles.button}
              onClick={() => onKeyPress(value)}
              key={value}
            >
              {label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keypad;
