import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, X } from 'lucide-react';

interface Props {
    eyebrow: string;
    title: string;
    subtitle: string;
    onClose: () => void;
    children: React.ReactNode;
}

export const ModeLobbyShell: React.FC<Props> = ({ eyebrow, title, subtitle, onClose, children }) => {
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previous; };
    }, []);

    return createPortal(<div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#edf8f2] text-[#073c43] isolation-isolate">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(245,178,50,0.18),transparent_25%),radial-gradient(circle_at_90%_80%,rgba(16,154,119,0.18),transparent_28%)]" />
        <header className="sticky top-0 z-30 border-b border-[#073c43]/10 bg-[#edf8f2]/90 px-3 py-2 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#073c43]/10 bg-white shadow" aria-label="Volver"><ArrowLeft className="h-4 w-4" /></button>
                <div className="text-center"><p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-700">{eyebrow}</p><h1 className="text-sm font-black sm:text-base">{title}</h1></div>
                <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#073c43]/10 bg-white shadow" aria-label="Cerrar"><X className="h-4 w-4" /></button>
            </div>
        </header>
        <main className="relative z-10 mx-auto max-w-6xl p-3 pb-12 sm:p-5">
            <div className="mb-4 max-w-2xl"><p className="text-sm font-medium text-slate-600">{subtitle}</p></div>
            {children}
        </main>
    </div>, document.body);
};
