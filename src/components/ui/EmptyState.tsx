
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
      <h3 className="text-base font-medium mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="rounded-full bg-lavanda hover:bg-lavanda-dark text-white font-medium flex items-center"
          size="sm"
        >
          {actionLabel}
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
