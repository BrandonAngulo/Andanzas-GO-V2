import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { customRoutesService } from '../../services/customRoutes.service';
import { Compass, CheckCircle2, AlertCircle, CalendarClock, Contact, Users, Accessibility, ShieldCheck } from 'lucide-react';

interface Props { open: boolean; onOpenChange: (open: boolean) => void }
const MIN_NOTICE_DAYS = 7;
const initialForm = {
    contact_name: '', contact_email: '', contact_phone: '', preferred_contact_method: 'whatsapp',
    route_category: '', cultural_approach: '', group_type: '', institution_name: '', group_size: '', age_range: '',
    difficulty: '', duration_minutes: '', mobility_needs: '', accessibility_needs: '', preferred_date: '',
    preferred_start_time: '', date_flexibility: '', meeting_area: '', budget_range: '', additional_notes: '', rules_accepted: false
};

export const RequestCustomRouteModal: React.FC<Props> = ({ open, onOpenChange }) => {
    const { user } = useAuth();
    const [form, setForm] = useState({ ...initialForm, contact_name: user?.user_metadata?.full_name || '', contact_email: user?.email || '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const set = (key: keyof typeof form, value: string | boolean) => setForm(previous => ({ ...previous, [key]: value }));
    const requiresInstitution = ['Institucional', 'Colegio'].includes(form.group_type);
    const minDate = new Date(Date.now() + MIN_NOTICE_DAYS * 86400000).toISOString().slice(0, 10);

    const close = (next: boolean) => {
        if (!next) setTimeout(() => { setForm({ ...initialForm, contact_name: user?.user_metadata?.full_name || '', contact_email: user?.email || '' }); setSuccess(false); setError(''); }, 250);
        onOpenChange(next);
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) { setError('Debes iniciar sesión para solicitar una ruta.'); return; }
        if (![form.contact_name,form.contact_email,form.contact_phone,form.route_category,form.cultural_approach,form.group_type,form.group_size,form.age_range,form.difficulty,form.duration_minutes,form.preferred_date].every(Boolean)) { setError('Completa todos los campos marcados como obligatorios.'); return; }
        if (!form.rules_accepted) { setError('Debes aceptar las reglas básicas de participación.'); return; }
        setSubmitting(true); setError('');
        try {
            await customRoutesService.createRequest({
                user_id: user.id, category: form.route_category, themes: [], cultural_approach: [form.cultural_approach],
                group_type: form.group_type, group_size: Number(form.group_size), contact_name: form.contact_name,
                contact_email: form.contact_email, contact_phone: form.contact_phone, preferred_contact_method: form.preferred_contact_method,
                institution_name: requiresInstitution ? form.institution_name : null, age_range: form.age_range,
                difficulty: form.difficulty, duration_minutes: Number(form.duration_minutes), mobility_needs: form.mobility_needs || null,
                accessibility_needs: form.accessibility_needs || null, preferred_date: form.preferred_date || null,
                preferred_start_time: form.preferred_start_time || null, date_flexibility: form.date_flexibility || null,
                meeting_area: form.meeting_area || null, budget_range: form.budget_range || null,
                additional_notes: form.additional_notes || null, rules_accepted_at: new Date().toISOString(), status: 'requested'
            });
            setSuccess(true);
        } catch (reason: any) {
            const message = String(reason?.message || '');
            setError(message.includes('MIN_NOTICE') ? 'La fecha debe tener al menos 7 días de anticipación.' : 'No fue posible enviar la solicitud. Revisa los datos e inténtalo nuevamente.');
        } finally { setSubmitting(false); }
    };

    return <Dialog open={open} onOpenChange={close}><DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><div className="mx-auto w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-2"><Compass className="w-7 h-7 text-emerald-600" /></div><DialogTitle className="text-center text-2xl">Solicita una ruta diseñada para tu grupo</DialogTitle><DialogDescription className="text-center">Cuéntanos lo necesario para evaluar disponibilidad, accesibilidad, diseño y cotización.</DialogDescription></DialogHeader>
        {success ? <div className="py-10 text-center space-y-4"><CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" /><h3 className="text-xl font-bold">Solicitud recibida</h3><p className="text-sm text-muted-foreground max-w-md mx-auto">Revisaremos viabilidad y disponibilidad. El siguiente paso será contactarte y, si procede, enviar cotización y propuesta de diseño.</p><Button onClick={() => close(false)}>Entendido</Button></div> :
        <form onSubmit={submit} className="space-y-6 mt-4">
            {error && <div role="alert" className="p-3 bg-red-500/10 text-red-700 rounded-xl flex gap-2 text-sm"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
            <div className="rounded-2xl border bg-amber-500/5 border-amber-500/20 p-4 flex gap-3"><CalendarClock className="w-5 h-5 text-amber-600 shrink-0" /><div><p className="font-semibold text-sm">Anticipación mínima: {MIN_NOTICE_DAYS} días</p><p className="text-xs text-muted-foreground">La solicitud no garantiza disponibilidad. Para grupos grandes, instituciones o necesidades especiales recomendamos más anticipación.</p></div></div>

            <fieldset className="space-y-3"><legend className="font-bold flex items-center gap-2"><Contact className="w-4 h-4 text-primary" />Datos de contacto</legend><div className="grid sm:grid-cols-2 gap-3">
                <Input required placeholder="Nombre de quien solicita" value={form.contact_name} onChange={e => set('contact_name',e.target.value)} />
                <Input required type="email" placeholder="Correo de contacto" value={form.contact_email} onChange={e => set('contact_email',e.target.value)} />
                <Input required type="tel" minLength={7} placeholder="Número de contacto / WhatsApp" value={form.contact_phone} onChange={e => set('contact_phone',e.target.value)} />
                <Select value={form.preferred_contact_method} onValueChange={v => set('preferred_contact_method',v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="whatsapp">Prefiero WhatsApp</SelectItem><SelectItem value="call">Prefiero llamada</SelectItem><SelectItem value="email">Prefiero correo</SelectItem></SelectContent></Select>
            </div></fieldset>

            <fieldset className="space-y-3"><legend className="font-bold flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Grupo y propósito</legend><div className="grid sm:grid-cols-2 gap-3">
                <Select value={form.group_type} onValueChange={v => set('group_type',v)}><SelectTrigger><SelectValue placeholder="Tipo de grupo *" /></SelectTrigger><SelectContent><SelectItem value="Parejas">Pareja</SelectItem><SelectItem value="Familia">Familia</SelectItem><SelectItem value="Amigos">Amigos</SelectItem><SelectItem value="Institucional">Empresa / Institución</SelectItem><SelectItem value="Colegio">Colegio / Universidad</SelectItem><SelectItem value="Turistas">Grupo de turistas</SelectItem><SelectItem value="Solo">Individual</SelectItem></SelectContent></Select>
                <Input required type="number" min="1" max="500" placeholder="Número de participantes *" value={form.group_size} onChange={e => set('group_size',e.target.value)} />
                {requiresInstitution && <Input required className="sm:col-span-2" placeholder="Nombre de la empresa, colegio o universidad *" value={form.institution_name} onChange={e => set('institution_name',e.target.value)} />}
                <Select value={form.age_range} onValueChange={v => set('age_range',v)}><SelectTrigger><SelectValue placeholder="Rango de edades *" /></SelectTrigger><SelectContent><SelectItem value="children">Principalmente niños</SelectItem><SelectItem value="teens">Adolescentes</SelectItem><SelectItem value="adults">Adultos</SelectItem><SelectItem value="seniors">Adultos mayores</SelectItem><SelectItem value="mixed">Edades mixtas</SelectItem></SelectContent></Select>
                <Select value={form.budget_range} onValueChange={v => set('budget_range',v)}><SelectTrigger><SelectValue placeholder="Presupuesto orientativo" /></SelectTrigger><SelectContent><SelectItem value="open">Quiero recibir propuesta</SelectItem><SelectItem value="basic">Hasta $500.000</SelectItem><SelectItem value="standard">$500.000–$1.500.000</SelectItem><SelectItem value="premium">Más de $1.500.000</SelectItem></SelectContent></Select>
            </div></fieldset>

            <fieldset className="space-y-3"><legend className="font-bold flex items-center gap-2"><Compass className="w-4 h-4 text-primary" />Características de la ruta</legend><div className="grid sm:grid-cols-2 gap-3">
                <Select value={form.route_category} onValueChange={v => set('route_category',v)}><SelectTrigger><SelectValue placeholder="Tema principal *" /></SelectTrigger><SelectContent>{['Histórica','Naturaleza y Ecología','Gastronomía','Mitos y Leyendas','Arte y Arquitectura','Vida Nocturna','Multitemática'].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                <Select value={form.cultural_approach} onValueChange={v => set('cultural_approach',v)}><SelectTrigger><SelectValue placeholder="Enfoque cultural *" /></SelectTrigger><SelectContent>{['Música y Danza','Literatura y Poesía','Arte Urbano','Arquitectura','Religioso / Espiritual','General'].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                <Select value={form.difficulty} onValueChange={v => set('difficulty',v)}><SelectTrigger><SelectValue placeholder="Dificultad esperada *" /></SelectTrigger><SelectContent><SelectItem value="low">Suave, pocas pendientes</SelectItem><SelectItem value="medium">Moderada</SelectItem><SelectItem value="high">Exigente</SelectItem><SelectItem value="adapted">Debe ser adaptada</SelectItem></SelectContent></Select>
                <Select value={form.duration_minutes} onValueChange={v => set('duration_minutes',v)}><SelectTrigger><SelectValue placeholder="Duración aproximada *" /></SelectTrigger><SelectContent><SelectItem value="120">2 horas</SelectItem><SelectItem value="180">3 horas</SelectItem><SelectItem value="240">4 horas</SelectItem><SelectItem value="360">6 horas</SelectItem><SelectItem value="480">Jornada completa</SelectItem></SelectContent></Select>
                <Input placeholder="Zona de encuentro o sectores preferidos" value={form.meeting_area} onChange={e => set('meeting_area',e.target.value)} />
                <Select value={form.date_flexibility} onValueChange={v => set('date_flexibility',v)}><SelectTrigger><SelectValue placeholder="Flexibilidad de fecha" /></SelectTrigger><SelectContent><SelectItem value="fixed">Fecha indispensable</SelectItem><SelectItem value="plus_minus_3">± 3 días</SelectItem><SelectItem value="same_month">Cualquier fecha del mes</SelectItem></SelectContent></Select>
                <label className="text-xs font-medium">Fecha propuesta *<Input className="mt-1" type="date" min={minDate} value={form.preferred_date} onChange={e => set('preferred_date',e.target.value)} /></label>
                <label className="text-xs font-medium">Hora preferida<Input className="mt-1" type="time" value={form.preferred_start_time} onChange={e => set('preferred_start_time',e.target.value)} /></label>
            </div></fieldset>

            <fieldset className="space-y-3"><legend className="font-bold flex items-center gap-2"><Accessibility className="w-4 h-4 text-primary" />Movilidad y accesibilidad</legend><Textarea placeholder="¿Alguien usa silla de ruedas, bastón, coche para bebé o requiere transporte adaptado?" value={form.mobility_needs} onChange={e => set('mobility_needs',e.target.value)} /><Textarea placeholder="Ritmo, pausas, alimentación, interpretación, necesidades sensoriales u otros apoyos" value={form.accessibility_needs} onChange={e => set('accessibility_needs',e.target.value)} /><Textarea placeholder="Otros objetivos, lugares deseados o aspectos que debamos evitar" value={form.additional_notes} onChange={e => set('additional_notes',e.target.value)} /></fieldset>

            <label className="flex items-start gap-3 rounded-2xl border p-4 cursor-pointer"><input type="checkbox" className="mt-1" checked={form.rules_accepted} onChange={e => set('rules_accepted',e.target.checked)} /><span><strong className="text-sm flex items-center gap-1"><ShieldCheck className="w-4 h-4" />Acepto las reglas básicas de la experiencia</strong><span className="block text-xs text-muted-foreground mt-1">El grupo seguirá indicaciones del guía, respetará horarios, comunidad, patrimonio y normas de seguridad; informará condiciones relevantes y mantendrá supervisión de menores. La ruta puede ajustarse por clima, seguridad o fuerza mayor.</span></span></label>
            <DialogFooter><Button type="button" variant="outline" onClick={() => close(false)}>Cancelar</Button><Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>{submitting ? 'Enviando…' : 'Enviar solicitud de cotización'}</Button></DialogFooter>
        </form>}
    </DialogContent></Dialog>;
};
