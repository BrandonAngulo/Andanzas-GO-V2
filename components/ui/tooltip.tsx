import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

interface InfoTooltipProps {
  title: string;
  body: string;
  children: React.ReactElement;
  className?: string;
}

/**
 * Leyenda emergente ligera que aparece al pasar el cursor (o enfocar) y también
 * al hacer clic/tocar — pensada para pantallas táctiles sin hover. Se renderiza
 * por portal para no ser recortada por contenedores con overflow-hidden.
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, body, children, className }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);

  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.top, left: r.left + r.width / 2 });
  }, []);

  const show = useCallback(() => { place(); setOpen(true); }, [place]);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => { place(); setOpen(o => !o); }, [place]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => { if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) hide(); };
    const onScroll = () => hide();
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', hide);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', hide);
    };
  }, [open, hide]);

  const childProps = children.props as any;
  const child = React.cloneElement(children as any, {
    ref: (node: HTMLElement) => {
      anchorRef.current = node;
      const r = (children as any).ref;
      if (typeof r === 'function') r(node);
      else if (r) (r as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    onMouseEnter: (e: any) => { show(); childProps.onMouseEnter?.(e); },
    onMouseLeave: (e: any) => { hide(); childProps.onMouseLeave?.(e); },
    onFocus: (e: any) => { show(); childProps.onFocus?.(e); },
    onBlur: (e: any) => { hide(); childProps.onBlur?.(e); },
    onClick: (e: any) => { e.preventDefault(); toggle(); childProps.onClick?.(e); },
  });

  return (
    <>
      {child}
      {open && coords && createPortal(
        <div
          role="tooltip"
          style={{ position: 'fixed', top: coords.top - 10, left: coords.left, transform: 'translate(-50%, -100%)' }}
          className={cn('pointer-events-none z-[1600] w-56 rounded-xl border bg-popover p-3 text-left shadow-xl animate-in fade-in-0 zoom-in-95 duration-150', className)}
        >
          <p className="text-xs font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{body}</p>
          <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r bg-popover" />
        </div>,
        document.body
      )}
    </>
  );
};

export default InfoTooltip;
