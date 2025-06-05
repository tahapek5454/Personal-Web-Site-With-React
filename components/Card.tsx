import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'minimal';
  hover3d?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover3d = true,
  padding = 'md',
  rounded = 'lg'
}) => {
  const baseClasses = 'relative bg-white transition-all duration-300 ease-out';
  
  const shadowVariants = {
    default: 'shadow-lg shadow-gray-200/50 border border-gray-100',
    elevated: 'shadow-2xl shadow-gray-300/40 border border-gray-50',
    minimal: 'shadow-md shadow-gray-200/30 border border-gray-200'
  };

  const hoverClasses = hover3d 
    ? 'hover:shadow-2xl hover:shadow-gray-300/60 hover:-translate-y-2 hover:scale-[1.02] hover:rotate-1' 
    : 'hover:shadow-xl hover:shadow-gray-300/50';

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  };

  return (
    <div 
      className={`
        ${baseClasses}
        ${shadowVariants[variant]}
        ${hoverClasses}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D depth effect with pseudo-element */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/20 rounded-inherit pointer-events-none"
        style={{
          transform: 'translateZ(-1px)',
        }}
      />
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Optional: Pre-built card sections for common use cases
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`text-gray-600 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

export default Card;
