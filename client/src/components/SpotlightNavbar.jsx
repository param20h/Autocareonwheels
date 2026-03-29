import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SpotlightNavbar({
  items = [
    { label: 'Services', href: '/#services' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'Reviews', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ],
  actions,
  className,
  onItemClick,
  defaultActiveIndex = 0,
}) {
  const navRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [hoverX, setHoverX] = useState(null);

  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty('--spotlight-x', `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: 'spring',
          stiffness: 200,
          damping: 20,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty('--spotlight-x', `${v}px`);
          },
        });
      }
    };

    nav.addEventListener('mousemove', handleMouseMove);
    nav.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      nav.removeEventListener('mousemove', handleMouseMove);
      nav.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeIndex]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      animate(ambienceX.current, targetX, {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty('--ambience-x', `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (item, index) => {
    setActiveIndex(index);
    onItemClick?.(item, index);
  };

  return (
    <div className={cn('relative flex justify-center', className)}>
      <nav
        ref={navRef}
        className="spotlight-nav spotlight-nav-bg glass-border spotlight-nav-shadow relative h-11 rounded-full transition-all duration-300 overflow-hidden"
      >
        {/* Nav Items */}
        <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
          {items.map((item, idx) => (
            <li key={idx} className="relative h-full flex items-center justify-center">
              <a
                href={item.href}
                data-index={idx}
                onClick={(e) => {
                  handleItemClick(item, idx);
                }}
                className={cn(
                  'px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-full',
                  activeIndex === idx
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white'
                )}
              >
                {item.label}
              </a>
            </li>
          ))}

          {/* Divider + action buttons */}
          {actions && (
            <li className="relative h-full flex items-center">
              <span className="w-px h-5 bg-white/20 mx-2" />
              {actions}
            </li>
          )}
        </ul>

        {/* Spotlight glow following mouse */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0,
            background: `radial-gradient(120px circle at var(--spotlight-x) 100%, rgba(192,57,43,0.25) 0%, transparent 50%)`,
          }}
        />

        {/* Active item ambience line */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
          style={{
            background: `radial-gradient(60px circle at var(--ambience-x) 0%, rgba(192,57,43,1) 0%, transparent 100%)`,
          }}
        />

        {/* Subtle bottom border track */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 z-0" />
      </nav>
    </div>
  );
}

export default SpotlightNavbar;
