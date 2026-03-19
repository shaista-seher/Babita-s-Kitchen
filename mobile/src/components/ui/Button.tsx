import React, { FC } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export function Button({ title, className = '', ...props }: ButtonProps) {
  return (
    <TouchableOpacity 
      className={`bg-amber-500 p-4 rounded-xl items-center my-4 ${className}`}
      {...props}
    >
      <Text className="text-white font-semibold text-lg">{title}</Text>
    </TouchableOpacity>
  );
}

