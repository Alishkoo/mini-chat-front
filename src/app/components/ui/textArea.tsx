import React, { ChangeEvent } from 'react';
import { Socket } from 'socket.io-client';

type TextareaProps = {
  setText: (text: string) => void;
  text: string;
  placeholder: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onTyping?: () => void;
};

const Textarea: React.FC<TextareaProps> = ({
  setText,
  placeholder,
  className = '',
  text,
  onChange,
  onFocus,
  onBlur, 
  onTyping

}) => {

  onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTyping && onTyping();
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onFocus && onFocus();
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onBlur && onBlur();
  }

  const baseStyles = 'resize-none border-none focus:ring-0';
  return (
    <textarea
      placeholder={placeholder}
      className={`${baseStyles} ${className}`}
      value={text}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}

    ></textarea>
  );
};

export default Textarea;

