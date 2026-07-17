import React, { useEffect, useState } from 'react';
import { BarChart2, BookOpen, Gamepad2, Map, ShieldCheck, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';

interface AdminIntroModalProps {
    isOpen: boolean;
    isAdmin: boolean;
    onClose: () => void;
    onComplete: () => Promise<void>;
}

const steps = [
    {
        icon: ShieldCheck,
        title: 'Bienvenido al panel de gestión',
        description: 'Aquí puedes administrar el contenido y la operación cotidiana de Andanzas GO sin modificar el código.',
        allows: 'Consultar el estado general de la app y entrar a cada área de trabajo según tu rol.',
        workflow: 'Revisa primero el estado del contenido. Guarda como borrador, valida y publica solo cuando esté listo para aparecer en la app.',
        caution: 'Los cambios publicados pueden reflejarse inmediatamente o al recargar la vista.'
    },
    {
        icon: BookOpen,
        title: 'Contenido y publicación',
        description: 'Gestiona sitios, eventos, noticias, diccionario, “Pa’ que sepás”, información institucional, banners y textos de ayuda.',
        allows: 'Crear, editar, revisar, activar, desactivar y, cuando la sección lo permita, aplicar acciones por bloque.',
        workflow: 'Completa los datos obligatorios, comprueba imágenes y enlaces, y usa los estados editoriales para separar borradores, revisión y publicación.',
        caution: 'Desactivar conserva la información; eliminar debe reservarse para contenido que realmente no deba recuperarse.'
    },
    {
        icon: Map,
        title: 'Rutas y solicitudes',
        description: 'Administra rutas oficiales, sus sitios, cupos, recompensas y las solicitudes de rutas personalizadas.',
        allows: 'Diseñar recorridos y acompañar una solicitud desde su recepción hasta su realización, cancelación o cambio de fecha.',
        workflow: 'Verifica tiempos, dificultad, accesibilidad, grupo y contacto antes de aceptar o enviar una cotización.',
        caution: 'La zona de encuentro es opcional y puede ser sugerida por Andanzas; no se solicita presupuesto orientativo al usuario.'
    },
    {
        icon: Gamepad2,
        title: 'Juegos y economía',
        description: 'Configura juegos, preguntas, dificultad, aprobación editorial, recompensas, vidas, monedas y gemas.',
        allows: 'Revisar preguntas antes de activarlas y consultar el desempeño real para mejorar el banco de contenido.',
        workflow: 'Mantén separadas la dificultad editorial y la dificultad observada; publica por bloques únicamente después de validar variedad y calidad.',
        caution: 'Los cambios de recompensas y economía afectan la progresión de los usuarios.'
    },
    {
        icon: Users,
        title: 'Comunidad y permisos',
        description: 'Gestiona avatares, documentos legales, moderación y, si eres administrador, usuarios y roles.',
        allows: 'Mantener la identidad visual, atender reglas de comunidad y controlar quién puede administrar la plataforma.',
        workflow: 'Concede solo el permiso necesario: edición para contenido y administración para operaciones sensibles.',
        caution: 'Los editores no deben acceder a cambios de roles o controles reservados para administradores.'
    },
    {
        icon: BarChart2,
        title: 'Métricas, ajustes y ayuda',
        description: 'General reúne indicadores, inventario y analítica de juegos; Ajustes controla reglas operativas y Textos de Ayuda administra explicaciones visibles en la app.',
        allows: 'Tomar decisiones con datos reales y mantener reglas configurables sin cambios manuales de código.',
        workflow: 'Comprueba el efecto de una actualización en las métricas y documenta cualquier regla que los usuarios necesiten comprender.',
        caution: 'Puedes volver a abrir esta guía en cualquier momento desde “Ver tutorial”, en la cabecera del panel.'
    }
] as const;

export function AdminIntroModal({ isOpen, isAdmin, onClose, onComplete }: AdminIntroModalProps) {
    const [stepIndex, setStepIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) setStepIndex(0);
    }, [isOpen]);

    const step = steps[stepIndex];
    const Icon = step.icon;
    const isLastStep = stepIndex === steps.length - 1;

    const finish = async () => {
        setIsSaving(true);
        try {
            await onComplete();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSaving) onClose(); }}>
            <DialogContent className="max-w-2xl overflow-hidden p-0">
                <DialogHeader className="border-b bg-muted/30 p-6 pr-12">
                    <div className="mb-3 flex items-center justify-between gap-4 text-sm text-muted-foreground">
                        <span>Paso {stepIndex + 1} de {steps.length}</span>
                        <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                        <div className="h-full bg-primary transition-all" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
                    </div>
                    <DialogTitle className="mt-5 flex items-center gap-3 text-2xl">
                        <span className="rounded-xl bg-primary/10 p-2 text-primary"><Icon className="h-6 w-6" /></span>
                        {step.title}
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-base">{step.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 p-6" aria-live="polite">
                    <GuideItem title="Qué te permite hacer" text={step.allows} />
                    <GuideItem title="Cómo funciona" text={step.workflow} />
                    <GuideItem title="Ten en cuenta" text={step.caution} emphasized />
                    {stepIndex === 4 && !isAdmin && (
                        <p className="rounded-lg border p-3 text-sm text-muted-foreground">Tu perfil es editor: verás las herramientas de contenido, pero no la gestión de usuarios y roles.</p>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t bg-muted/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" onClick={finish} disabled={isSaving}>Omitir tutorial</Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStepIndex((current) => current - 1)} disabled={stepIndex === 0 || isSaving}>Anterior</Button>
                        {isLastStep ? (
                            <Button onClick={finish} disabled={isSaving}>{isSaving ? 'Guardando…' : 'Empezar a gestionar'}</Button>
                        ) : (
                            <Button onClick={() => setStepIndex((current) => current + 1)}>Siguiente</Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function GuideItem({ title, text, emphasized = false }: { title: string; text: string; emphasized?: boolean }) {
    return (
        <section className={emphasized ? 'rounded-xl border border-primary/20 bg-primary/5 p-4' : 'rounded-xl border p-4'}>
            <h3 className="mb-1 font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
        </section>
    );
}
