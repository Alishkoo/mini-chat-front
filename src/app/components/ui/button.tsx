import React, { ReactNode } from 'react';

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'icon';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const baseStyles = 'rounded-lg focus:outline-none focus:ring-2';
  const variantStyles = {
    default: 'bg-blue-600 text-white',
    ghost: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50'
  };
  const sizeStyles = {
    default: 'px-6 py-3',
    icon: 'p-2'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
