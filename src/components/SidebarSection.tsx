import React, { ReactNode } from 'react';

interface SidebarSectionProps {
  id: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ id, title, action, children }) => {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-3 p-4 bg-surface dark:bg-dark-surface border-2 border-text-primary dark:border-dark-text-primary brutal-shadow"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id={id} className="text-sm font-extrabold uppercase tracking-wide text-text-primary dark:text-dark-text-primary">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
};

export default SidebarSection;
