import React, { useEffect, useState } from 'react';
import { CustomRouteRequest } from '../../../types';
import { customRoutesService } from '../../../services/customRoutes.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Map, Mail, Users, Clock, Save, FileText, Search, Phone, Building2, Accessibility, CalendarClock, RefreshCcw } from 'lucide-react';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { toast } from 'sonner';

type RequestWithProfile = CustomRouteRequest & { profile?: { full_name?: string; avatar_url?: string; email?: string } };
const STATUS = {
    requested: 'Solicitada', under_review: 'En revisión', accepted: 'Aceptada', rejected: 'Rechazada',
    quote_sent: 'Cotización enviada', design_sent: 'Diseño enviado', client_approved: 'Aprobada por cliente',
    scheduled: 'Citada / programada', completed: 'Realizada', canceled: 'Cancelada', rescheduled: 'Movida / reprogramada'
} as const;
const statusTone: Record<string,string> = { requested:'bg-amber-100 text-amber-800',under_review:'bg-blue-100 text-blue-800',accepted:'bg-emerald-100 text-emerald-800',rejected:'bg-red-100 text-red-800',quote_sent:'bg-violet-100 text-violet-800',design_sent:'bg-indigo-100 text-indigo-800',client_approved:'bg-teal-100 text-teal-800',scheduled:'bg-sky-100 text-sky-800',completed:'bg-green-100 text-green-800',canceled:'bg-slate-200 text-slate-700',rescheduled:'bg-orange-100 text-orange-800' };

export const AdminRutasPersonalizadas: React.FC = () => {
    const [requests,setRequests] = useState<RequestWithProfile[]>([]);
    const [loading,setLoading] = useState(true);
    const [filter,setFilter] = useState('all');
    const [search,setSearch] = useState('');
    const [drafts,setDrafts] = useState<Record<string,Partial<CustomRouteRequest>>>({});
    const [saving,setSaving] = useState<string|null>(null);
    const load = async () => { setLoading(true); setRequests(await customRoutesService.getAllAdmin() as RequestWithProfile[]); setLoading(false); };
    useEffect(() => { load(); }, []);
    const patchDraft = (id:string,key:keyof CustomRouteRequest,value:any) => setDrafts(old => ({...old,[id]:{...old[id],[key]:value}}));
    const value = <K extends keyof CustomRouteRequest>(request:RequestWithProfile,key:K) => (drafts[request.id]?.[key] ?? request[key]) as CustomRouteRequest[K];
    const save = async (request:RequestWithProfile) => { const updates=drafts[request.id]; if(!updates)return; setSaving(request.id); try{await customRoutesService.updateManagement(request.id,updates); toast.success('Gestión actualizada'); setDrafts(old=>{const next={...old};delete next[request.id];return next}); await load();}catch{toast.error('No fue posible guardar los cambios');}finally{setSaving(null);} };
    const visible=requests.filter(r=>{const text=`${r.contact_name} ${r.contact_email} ${r.contact_phone} ${r.institution_name} ${r.category} ${r.group_type}`.toLowerCase();return(filter==='all'||r.status===filter)&&text.includes(search.toLowerCase())});

    return <div className="space-y-6 pb-24 min-h-[85vh]">
        <div className="flex flex-col lg:flex-row justify-between gap-4"><div><h3 className="text-xl font-bold flex items-center gap-2"><Map className="w-6 h-6 text-primary" />Operación de rutas personalizadas</h3><p className="text-sm text-muted-foreground">Seguimiento desde la solicitud hasta la realización, cancelación o reprogramación.</p></div><div className="flex flex-col sm:flex-row gap-2"><div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground"/><Input className="pl-9 sm:w-72" placeholder="Contacto, institución o ruta…" value={search} onChange={e=>setSearch(e.target.value)}/></div><Select value={filter} onValueChange={setFilter}><SelectTrigger className="sm:w-52"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Todos los estados</SelectItem>{Object.entries(STATUS).map(([key,label])=><SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select><Button variant="outline" onClick={load}><RefreshCcw className="w-4 h-4"/></Button></div></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{['requested','under_review','quote_sent','scheduled'].map(key=><Card key={key}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{STATUS[key as keyof typeof STATUS]}</p><p className="text-2xl font-black">{requests.filter(r=>r.status===key).length}</p></CardContent></Card>)}</div>
        {loading?<div className="py-12 text-center animate-pulse">Cargando solicitudes…</div>:visible.length===0?<div className="py-12 text-center border-2 border-dashed rounded-2xl text-muted-foreground">No hay solicitudes con estos filtros.</div>:<div className="grid xl:grid-cols-2 gap-5">{visible.map(req=><Card key={req.id} className="overflow-hidden"><CardContent className="p-0">
            <div className="p-4 border-b bg-muted/30 flex justify-between gap-3"><div><h4 className="font-bold">{req.contact_name||req.profile?.full_name||'Sin nombre'}</h4><div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-1"><span className="flex gap-1"><Mail className="w-3 h-3"/>{req.contact_email||req.profile?.email}</span><span className="flex gap-1"><Phone className="w-3 h-3"/>{req.contact_phone||'Sin teléfono'}</span></div></div><div className="text-right"><span className={`inline-block px-2 py-1 rounded-full text-[11px] font-bold ${statusTone[req.status]}`}>{STATUS[req.status]}</span><p className="text-[10px] text-muted-foreground mt-1">{new Date(req.created_at).toLocaleDateString('es-CO')}</p></div></div>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-muted-foreground">Grupo</p><p className="font-medium flex gap-1"><Users className="w-4 h-4"/>{req.group_type} · {req.group_size}</p></div><div><p className="text-xs text-muted-foreground">Institución</p><p className="font-medium flex gap-1"><Building2 className="w-4 h-4"/>{req.institution_name||'No aplica'}</p></div><div><p className="text-xs text-muted-foreground">Ruta</p><p className="font-medium">{req.category} · {req.difficulty||'Sin dificultad'}</p></div><div><p className="text-xs text-muted-foreground">Duración y edades</p><p className="font-medium"><Clock className="inline w-4 h-4 mr-1"/>{req.duration_minutes?`${req.duration_minutes/60} h`:'—'} · {req.age_range||'—'}</p></div><div><p className="text-xs text-muted-foreground">Fecha solicitada</p><p className="font-medium flex gap-1"><CalendarClock className="w-4 h-4"/>{req.preferred_date?new Date(`${req.preferred_date}T12:00:00`).toLocaleDateString('es-CO'):'Flexible'} {req.preferred_start_time?.slice(0,5)}</p></div><div><p className="text-xs text-muted-foreground">Encuentro</p><p className="font-medium">{req.meeting_area||'Por sugerir desde Andanzas'}</p></div></div>
                {(req.mobility_needs||req.accessibility_needs)&&<div className="rounded-xl bg-sky-500/10 p-3 text-sm"><p className="font-semibold flex gap-1"><Accessibility className="w-4 h-4"/>Movilidad y accesibilidad</p><p className="text-xs mt-1">{[req.mobility_needs,req.accessibility_needs].filter(Boolean).join(' · ')}</p></div>}
                {req.additional_notes&&<div className="text-sm"><p className="text-xs text-muted-foreground">Detalles solicitados</p><p>{req.additional_notes}</p></div>}
                <div className="grid sm:grid-cols-2 gap-3 border-t pt-4"><div><label className="text-xs font-semibold">Estado operativo</label><Select value={String(value(req,'status'))} onValueChange={v=>patchDraft(req.id,'status',v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Object.entries(STATUS).map(([key,label])=><SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select></div><div><label className="text-xs font-semibold">Valor cotizado (COP)</label><Input type="number" min="0" value={String(value(req,'quote_amount')||'')} onChange={e=>patchDraft(req.id,'quote_amount',e.target.value?Number(e.target.value):undefined)}/></div><div className="sm:col-span-2"><label className="text-xs font-semibold">Fecha y hora acordadas</label><Input type="datetime-local" value={value(req,'scheduled_at')?String(value(req,'scheduled_at')).slice(0,16):''} onChange={e=>patchDraft(req.id,'scheduled_at',e.target.value?new Date(e.target.value).toISOString():undefined)}/></div><div className="sm:col-span-2"><label className="text-xs font-semibold flex gap-1"><FileText className="w-3 h-3"/>Notas internas y próximos pasos</label><Textarea value={String(value(req,'internal_notes')||'')} onChange={e=>patchDraft(req.id,'internal_notes',e.target.value)} placeholder="Contacto, condiciones, cambios, responsables…"/></div>{value(req,'status')==='rejected'&&<div className="sm:col-span-2"><label className="text-xs font-semibold">Motivo de rechazo</label><Textarea value={String(value(req,'rejection_reason')||'')} onChange={e=>patchDraft(req.id,'rejection_reason',e.target.value)}/></div>}</div>
                <Button className="w-full" disabled={!drafts[req.id]||saving===req.id} onClick={()=>save(req)}><Save className="w-4 h-4 mr-2"/>{saving===req.id?'Guardando…':'Guardar gestión'}</Button>
            </div>
        </CardContent></Card>)}</div>}
    </div>;
};
