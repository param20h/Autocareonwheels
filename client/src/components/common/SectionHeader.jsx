import React from 'react';

const SectionHeader = ({ eyebrow, title, subtitle, align = 'left' }) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignment} gap-2`}>
      {eyebrow ? (
        <span className="inline-flex rounded-full bg-accent/10 text-accent border border-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-2xl md:text-3xl font-extrabold text-primary">{title}</h2>
      {subtitle ? <p className="text-gray-500 max-w-2xl">{subtitle}</p> : null}
    </div>
  );
};

export default SectionHeader;
