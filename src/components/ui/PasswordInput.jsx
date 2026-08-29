import React, { useState } from 'react';
import { Input } from './Input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-200 hover:text-neutral-50"
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export { PasswordInput };
