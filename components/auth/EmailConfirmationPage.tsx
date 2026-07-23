import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, MailCheck } from 'lucide-react';
import { Button } from '../ui/button';
import Logo from '../layout/Logo';

const readConfirmationError = () => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const query = new URLSearchParams(window.location.search);
    return hash.get('error_description') || query.get('error_description');
};

export function EmailConfirmationPage() {
    const [error] = useState(readConfirmationError);

    useEffect(() => {
        window.history.replaceState({}, '', '/auth/confirmed');
    }, []);

    const goToApp = () => window.location.replace('/');

    return (
        <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#f7f7f3] px-5 py-10">
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
            <div className="absolute -bottom-32 -right-28 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

            <section className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-2xl">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#073c43] via-[#08705d] to-[#18a86b] px-7 py-6 text-white">
                    <div className="inline-flex rounded-xl bg-white px-3 py-2 shadow-lg">
                        <Logo />
                    </div>
                    <div className="mt-5 max-w-[78%]">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Tu cuenta está lista</p>
                        <h1 className="mt-2 text-2xl font-black leading-tight">{error ? 'Revisemos el enlace' : 'Tu correo está confirmado'}</h1>
                    </div>
                    <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full border-[26px] border-white/10" />
                </div>

                <div className="p-7 sm:p-8">
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${error ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {error ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                    </div>
                    <h2 className="text-xl font-black text-emerald-950">
                        {error ? 'No pudimos validar este enlace' : 'Todo quedó listo'}
                    </h2>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                        {error
                            ? 'El enlace puede haber vencido o haber sido utilizado antes. Vuelve a la app e inicia sesión; si tu correo aún está pendiente, solicita un nuevo mensaje.'
                            : 'Ya puedes ingresar, guardar tus rutas, registrar tus descubrimientos y comenzar a explorar Andanzas GO.'}
                    </p>
                    <Button onClick={goToApp} className="mt-6 h-12 w-full rounded-xl font-black shadow-lg shadow-primary/20">
                        {error ? <MailCheck className="mr-2 h-5 w-5" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                        {error ? 'Volver a Andanzas GO' : 'Entrar a Andanzas GO'}
                    </Button>
                </div>
            </section>
        </main>
    );
}
