import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Handshake, Building2, Palette, FlaskConical, Sparkles, ArrowLeft, Send, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { alliancesService } from '../../services/alliances.service';
import { AllianceType } from '../../types';

interface AlliancesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ALLIANCE_TYPES: { id: AllianceType; label: string; description: string; icon: React.ElementType; tone: string }[] = [
    { id: 'colaboracion', label: 'Colaborar', description: 'Proyectos, actividades o contenidos conjuntos con organizaciones, marcas y personas.', icon: Handshake, tone: 'text-emerald-600 bg-emerald-500/10' },
    { id: 'institucional', label: 'Instituciones', description: 'Convenios con colegios, universidades y entidades públicas o culturales.', icon: Building2, tone: 'text-blue-600 bg-blue-500/10' },
    { id: 'creacion', label: 'Creación', description: 'Artistas, gestores y creadores que quieran aportar experiencias y contenido.', icon: Palette, tone: 'text-fuchsia-600 bg-fuchsia-500/10' },
    { id: 'investigacion', label: 'Investigación', description: 'Estudios, datos y proyectos académicos sobre ciudad, cultura y territorio.', icon: FlaskConical, tone: 'text-amber-600 bg-amber-500/10' },
    { id: 'otra', label: 'Otra posibilidad', description: 'Cuéntanos qué tipo de alianza tienes en mente para Andanzas GO.', icon: Sparkles, tone: 'text-purple-600 bg-purple-500/10' },
];

export function AlliancesModal({ isOpen, onClose }: AlliancesModalProps) {
    const [selectedType, setSelectedType] = useState<AllianceType | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [form, setForm] = useState({ contact_name: '', organization: '', contact_email: '', contact_phone: '', message: '' });

    const reset = () => { setSelectedType(null); setDone(false); setForm({ contact_name: '', organization: '', contact_email: '', contact_phone: '', message: '' }); };
    const handleClose = () => { onClose(); setTimeout(reset, 200); };

    const activeType = ALLIANCE_TYPES.find(t => t.id === selectedType);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedType) return;
        if (!form.contact_name.trim() || !form.contact_email.trim() || !form.message.trim()) {
            toast.error('Completa tu nombre, correo y mensaje.');
            return;
        }
        setSubmitting(true);
        try {
            await alliancesService.createRequest({
                alliance_type: selectedType,
                contact_name: form.contact_name.trim(),
                organization: form.organization.trim() || undefined,
                contact_email: form.contact_email.trim(),
                contact_phone: form.contact_phone.trim() || undefined,
                message: form.message.trim(),
            });
            setDone(true);
        } catch (err) {
            toast.error('No fue posible enviar tu solicitud. Intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="flex max-h-[90vh] max-w-lg flex-col overflow-hidden rounded-3xl border-0 p-0 shadow-2xl">
                <div className="relative h-24 shrink-0 overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
                    <div className="absolute inset-0 bg-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
                    <div className="relative flex h-full items-center gap-3 px-6 text-white">
                        <div className="rounded-2xl bg-white/20 p-2.5 backdrop-blur-sm"><Handshake className="h-6 w-6" /></div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">Alianzas Andanzas GO</DialogTitle>
                            <DialogDescription className="text-sm text-white/85">Construyamos ciudad juntos.</DialogDescription>
                        </div>
                    </div>
                </div>

                {done ? (
                    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                        <div className="rounded-full bg-emerald-500/10 p-4"><CheckCircle2 className="h-10 w-10 text-emerald-500" /></div>
                        <h3 className="text-lg font-bold">¡Solicitud enviada!</h3>
                        <p className="max-w-sm text-sm text-muted-foreground">Gracias por tu interés. El equipo de Andanzas revisará tu propuesta y te contactará por el medio que dejaste.</p>
                        <Button className="mt-2 rounded-full" onClick={handleClose}>Listo</Button>
                    </div>
                ) : !selectedType ? (
                    <ScrollArea className="flex-1 px-6 py-5">
                        <p className="mb-4 text-sm text-muted-foreground">Elige el tipo de alianza que quieres proponer y déjanos tus datos para conversar.</p>
                        <div className="space-y-2.5">
                            {ALLIANCE_TYPES.map(type => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setSelectedType(type.id)}
                                        className="group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <span className={`rounded-xl p-2.5 ${type.tone}`}><Icon className="h-5 w-5" /></span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-semibold">{type.label}</span>
                                            <span className="block text-xs leading-snug text-muted-foreground">{type.description}</span>
                                        </span>
                                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <ScrollArea className="flex-1 px-6 py-5">
                        <button type="button" onClick={() => setSelectedType(null)} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" /> Cambiar tipo
                        </button>
                        {activeType && (
                            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-muted/40 p-3">
                                <span className={`rounded-xl p-2 ${activeType.tone}`}><activeType.icon className="h-5 w-5" /></span>
                                <div>
                                    <p className="text-sm font-semibold">Alianza: {activeType.label}</p>
                                    <p className="text-xs text-muted-foreground">{activeType.description}</p>
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Nombre de contacto <span className="text-destructive">*</span></label>
                                <Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} placeholder="Tu nombre" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Organización / Colectivo</label>
                                <Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="Opcional" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Correo <span className="text-destructive">*</span></label>
                                    <Input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="hola@ejemplo.com" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Teléfono / WhatsApp</label>
                                    <Input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} placeholder="Opcional" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Cuéntanos tu propuesta <span className="text-destructive">*</span></label>
                                <Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="¿Qué te gustaría construir con Andanzas GO?" rows={4} required />
                            </div>
                            <Button type="submit" className="w-full rounded-xl" disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                {submitting ? 'Enviando…' : 'Enviar solicitud'}
                            </Button>
                            <p className="text-center text-[11px] text-muted-foreground">Usaremos tus datos solo para responder a esta solicitud de alianza.</p>
                        </form>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default AlliancesModal;
