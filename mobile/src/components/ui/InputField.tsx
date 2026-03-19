import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
  placeholder: string;
}

export function InputField({ placeholder, className = '', ...props }: InputFieldProps) {
  return (
    <TextInput 
      className={`border border-gray-300 p-4 rounded-xl mb-4 bg-white ${className}`}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType="phone-pad"
      {...props}
    />
  );
}

