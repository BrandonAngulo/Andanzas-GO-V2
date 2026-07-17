import React, { useEffect, useMemo, useState } from 'react';
import { AllianceRequest, AllianceStatus } from '../../../types';
import { alliancesService } from '../../../services/alliances.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Handshake, Mail, Phone, Building2, Search, Save, RefreshCcw, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

type AllianceWithProfile = AllianceRequest & { profile?: { full_name?: string; avatar_url?: string; email?: string } };

const STATUS: Record<AllianceStatus, string> = {
    new: 'Nueva', in_review: 'En revisión', contacted: 'Contactada', accepted: 'Aceptada', declined: 'Descartada', archived: 'Archivada'
};
const statusTone: Record<AllianceStatus, string> = {
    new: 'bg-amber-100 text-amber-800', in_review: 'bg-blue-100 text-blue-800', contacted: 'bg-violet-100 text-violet-800',
    accepted: 'bg-emerald-100 text-emerald-800', declined: 'bg-red-100 text-red-800', archived: 'bg-slate-200 text-slate-700'
};
const TYPE_LABEL: Record<string, string> = {
    colaboracion: 'Colaborar', institucional: 'Instituciones', creacion: 'Creación', investigacion: 'Investigación', otra: 'Otra'
};

export const AdminAlianzas: React.FC = () => {
    const [requests, setRequests] = useState<AllianceWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | AllianceStatus>('all');
    const [search, setSearch] = useState('');
    const [drafts, setDrafts] = useState<Record<string, { status?: AllianceStatus; internal_notes?: string }>>({});
    const [saving, setSaving] = useState<string | null>(null);

    const load = async () => { setLoading(true); setRequests(await alliancesService.getAllAdmin()); setLoading(false); };
    useEffect(() => { load(); }, []);

    const patch = (id: string, key: 'status' | 'internal_notes', value: any) =>
        setDrafts(old => ({ ...old, [id]: { ...old[id], [key]: value } }));
    const val = (req: AllianceWithProfile, key: 'status' | 'internal_notes') => (drafts[req.id]?.[key] ?? req[key] ?? '') as any;

    const save = async (req: AllianceWithProfile) => {
        const updates = drafts[req.id];
        if (!updates) return;
        setSaving(req.id);
        try {
            await alliancesService.updateManagement(req.id, updates);
            toast.success('Solicitud actualizada');
            setDrafts(old => { const next = { ...old }; delete next[req.id]; return next; });
            await load();
        } catch { toast.error('No fue posible guardar los cambios'); }
        finally { setSaving(null); }
    };

    const remove = async (req: AllianceWithProfile) => {
        toast('¿Eliminar esta solicitud de alianza?', {
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    const ok = await alliancesService.remove(req.id);
                    if (ok) { toast.success('Solicitud eliminada'); setRequests(prev => prev.filter(r => r.id !== req.id)); }
                    else toast.error('No fue posible eliminar');
                }
            }
        });
    };

    const visible = useMemo(() => requests.filter(r => {
        const text = `${r.contact_name} ${r.organization ?? ''} ${r.contact_email} ${r.contact_phone ?? ''} ${TYPE_LABEL[r.alliance_type] ?? ''} ${r.message}`.toLowerCase();
        return (filter === 'all' || r.status === filter) && text.includes(search.toLowerCase());
    }), [requests, filter, search]);

    return (
        <div className="space-y-6 pb-24 min-h-[85vh]">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><Handshake className="w-6 h-6 text-primary" />Solicitudes de alianzas</h3>
                    <p className="text-sm text-muted-foreground">Contactos que quieren colaborar, aportar o construir con Andanzas GO.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-9 sm:w-72" placeholder="Contacto, organización o tema…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select value={filter} onValueChange={v => setFilter(v as any)}>
                        <SelectTrigger className="sm:w-52"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            {(Object.entries(STATUS) as [AllianceStatus, string][]).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={load}><RefreshCcw className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['new', 'in_review', 'contacted', 'accepted'] as AllianceStatus[]).map(key => (
                    <Card key={key}><CardContent className="p-4"><p className="text-xs text-muted-foreground">{STATUS[key]}</p><p className="text-2xl font-black">{requests.filter(r => r.status === key).length}</p></CardContent></Card>
                ))}
            </div>

            {loading ? (
                <div className="py-12 text-center animate-pulse">Cargando solicitudes…</div>
            ) : visible.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed rounded-2xl text-muted-foreground">No hay solicitudes con estos filtros.</div>
            ) : (
                <div className="grid xl:grid-cols-2 gap-5">
                    {visible.map(req => (
                        <Card key={req.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-4 border-b bg-muted/30 flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold truncate">{req.contact_name}</h4>
                                            <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">{TYPE_LABEL[req.alliance_type] ?? req.alliance_type}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                                            <span className="flex gap-1 items-center"><Mail className="w-3 h-3" />{req.contact_email}</span>
                                            {req.contact_phone && <span className="flex gap-1 items-center"><Phone className="w-3 h-3" />{req.contact_phone}</span>}
                                            {req.organization && <span className="flex gap-1 items-center"><Building2 className="w-3 h-3" />{req.organization}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={`inline-block px-2 py-1 rounded-full text-[11px] font-bold ${statusTone[req.status]}`}>{STATUS[req.status]}</span>
                                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(req.created_at).toLocaleDateString('es-CO')}</p>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="text-sm">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><MessageSquare className="w-3 h-3" />Propuesta</p>
                                        <p className="whitespace-pre-wrap">{req.message}</p>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-3 border-t pt-4">
                                        <div>
                                            <label className="text-xs font-semibold">Estado</label>
                                            <Select value={String(val(req, 'status'))} onValueChange={v => patch(req.id, 'status', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{(Object.entries(STATUS) as [AllianceStatus, string][]).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="text-xs font-semibold">Notas internas</label>
                                            <Textarea value={String(val(req, 'internal_notes'))} onChange={e => patch(req.id, 'internal_notes', e.target.value)} placeholder="Seguimiento, responsable, próximos pasos…" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button className="flex-1" disabled={!drafts[req.id] || saving === req.id} onClick={() => save(req)}>
                                            <Save className="w-4 h-4 mr-2" />{saving === req.id ? 'Guardando…' : 'Guardar gestión'}
                                        </Button>
                                        <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(req)} title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminAlianzas;
