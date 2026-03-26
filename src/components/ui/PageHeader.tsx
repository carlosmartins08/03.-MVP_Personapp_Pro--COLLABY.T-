
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  rightContent,
}) => {
  return (
    <div className="flex flex-col gap-2 py-4 mb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};

export default PageHeader;
