import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 rounded-sm';
    
    const variants = {
      primary: 'bg-[var(--color-primary-red)] text-white hover:bg-[var(--color-primary-red-dark)] hover:shadow-lg',
      outline: 'border-2 border-[var(--color-primary-red)] text-[var(--color-primary-red)] hover:bg-[var(--color-primary-red)] hover:text-white',
      dark: 'bg-[var(--color-primary-black)] text-white hover:bg-black hover:shadow-lg',
      ghost: 'bg-transparent text-[var(--color-body-text)] hover:text-[var(--color-primary-red)]',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
    
    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
