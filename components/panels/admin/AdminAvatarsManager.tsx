import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/user.service';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Plus, Edit, Trash2, RefreshCcw, Smile, Megaphone, Upload, ImageOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { BroadcastModal } from './BroadcastModal';
import { Checkbox } from '../../ui/checkbox';
import { useBulkSelection } from '../../../hooks/useBulkSelection';
import { BulkActionsBar } from './BulkActionsBar';

interface AvatarPreset {
    id: string; name: string; type: 'human' | 'animal' | 'object'; image_url: string;
    personality_title: string; phrase: string; active: boolean; order_index: number;
}

const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

export const AdminAvatarsManager: React.FC = () => {
    const [avatars, setAvatars] = useState<AvatarPreset[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState<AvatarPreset | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [broadcastOpen, setBroadcastOpen] = useState(false);

    const loadAvatars = async () => {
        setLoading(true);
        const data = await userService.getAllAvatarPresetsAdmin();
        setAvatars(data);
        setLoading(false);
    };

    useEffect(() => {
        loadAvatars();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentAvatar) return;
        try {
            if (!currentAvatar.image_url) { toast.error('Selecciona una imagen o escribe una URL válida.'); return; }
            const payload = { ...currentAvatar, id: slugify(currentAvatar.id || currentAvatar.name) };
            if (!payload.id) { toast.error('El avatar necesita un identificador válido.'); return; }
            if (!isCreating) {
                await userService.updateAvatarPreset(currentAvatar.id, payload);
            } else {
                await userService.createAvatarPreset(payload);
            }
            setIsEditing(false);
            toast.success(isCreating ? 'Avatar creado y disponible en el perfil.' : 'Avatar actualizado.');
            await loadAvatars();
        } catch (err) {
            console.error("Error saving avatar:", err);
            toast.error("Error al guardar el avatar. Verifica que el ID sea único.");
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            await userService.deleteAvatarPreset(deleteId);
            loadAvatars();
            setDeleteId(null);
        }
    };

    const toggleActive = async (avatar: any) => {
        await userService.updateAvatarPreset(avatar.id, { active: !avatar.active });
        loadAvatars();
    };

    const sel = useBulkSelection(avatars as { id: string }[]);
    const [bulkBusy, setBulkBusy] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const runBulk = async (fn: (id: string) => Promise<any>) => {
        setBulkBusy(true);
        try { await Promise.all(sel.selectedIds.map(fn)); await loadAvatars(); sel.clear(); }
        finally { setBulkBusy(false); }
    };
    const bulkActivate = () => runBulk(id => userService.updateAvatarPreset(id, { active: true }));
    const bulkDeactivate = () => runBulk(id => userService.updateAvatarPreset(id, { active: false }));
    const confirmBulkDelete = async () => { await runBulk(id => userService.deleteAvatarPreset(id)); setBulkDeleteOpen(false); };

    const openCreate = () => {
        setIsCreating(true);
        setImageFailed(false);
        setCurrentAvatar({
            id: '',
            name: '',
            type: 'human',
            image_url: '',
            personality_title: '',
            phrase: '',
            active: true,
            order_index: 0
        });
        setIsEditing(true);
    };

    const openEdit = (avatar: any) => {
        setIsCreating(false);
        setImageFailed(false);
        setCurrentAvatar({ ...avatar });
        setIsEditing(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { toast.error('La imagen no puede superar 5 MB.'); return; }
            setUploadingImage(true);
            
            const fileExt = file.name.split('.').pop();
            const baseName = slugify(currentAvatar?.id || currentAvatar?.name || 'avatar');
            const fileName = `presets/${baseName}_${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file);
                
            if (uploadError) {
                console.error("Upload error:", uploadError);
                toast.error(`Error subiendo imagen: ${uploadError.message}. Asegúrate de que el bucket 'avatars' exista y sea público.`);
                setUploadingImage(false);
                return;
            }
            
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
                
            setCurrentAvatar(current => current ? { ...current, image_url: publicUrl } : current);
            setImageFailed(false);
            toast.success('Imagen cargada. Guarda el avatar para terminar.');
            setUploadingImage(false);
        } catch (err: any) {
            toast.error("Error de subida: " + err.message);
            setUploadingImage(false);
        }
    };

    return (
        <div className="space-y-6 pb-24 min-h-[85vh]">
            <ConfirmDialog 
                open={!!deleteId} 
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Seguro que deseas eliminar este avatar?"
                description="Esto podría afectar a los usuarios que ya lo tienen seleccionado."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <ConfirmDialog
                open={bulkDeleteOpen}
                onOpenChange={(open) => !open && setBulkDeleteOpen(false)}
                title={`¿Eliminar ${sel.count} avatar${sel.count === 1 ? '' : 'es'}?`}
                description="Esto podría afectar a los usuarios que ya los tienen seleccionados."
                onConfirm={confirmBulkDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Smile className="w-6 h-6 text-primary" /> Gestión de Avatares
                    </h3>
                    <p className="text-muted-foreground text-sm">Añade o edita los avatares disponibles para los usuarios.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setBroadcastOpen(true)} className="shrink-0 text-blue-600 hover:text-blue-700">
                        <Megaphone className="w-4 h-4 mr-2" /> Notificar
                    </Button>
                    <Button variant="outline" onClick={loadAvatars}><RefreshCcw className="w-4 h-4 mr-2" /> Actualizar</Button>
                    <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nuevo Avatar</Button>
                </div>
            </div>

            {!loading && avatars.length > 0 && (
                <BulkActionsBar count={sel.count} allSelected={sel.allSelected} onToggleAll={sel.toggleAll} onClear={sel.clear} busy={bulkBusy} onActivate={bulkActivate} onDeactivate={bulkDeactivate} activateLabel="Activar" deactivateLabel="Desactivar" onDelete={() => setBulkDeleteOpen(true)} />
            )}

            {loading ? (
                <div className="text-center py-10 animate-pulse">Cargando avatares...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {avatars.map(avatar => (
                        <Card key={avatar.id} className={`overflow-hidden transition-all ${!avatar.active ? 'opacity-70 grayscale-[50%]' : ''}`}>
                            <CardContent className="p-5 flex flex-col items-center text-center relative">
                                <div className="absolute top-4 left-4">
                                    <Checkbox checked={sel.isSelected(avatar.id)} onChange={() => sel.toggle(avatar.id)} aria-label={`Seleccionar ${avatar.name}`} />
                                </div>
                                <div className="absolute top-4 right-4 flex gap-1">
                                    <Switch 
                                        checked={avatar.active} 
                                        onClick={() => toggleActive(avatar)} 
                                        className="scale-75"
                                    />
                                </div>
                                
                                <div className="w-24 h-24 rounded-full border-4 border-muted overflow-hidden mb-3 bg-card shadow-sm">
                                    <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover" onError={(event) => { event.currentTarget.src = '/images/avatars/exploradora.png'; }} />
                                </div>
                                <h4 className="font-bold text-lg">{avatar.name}</h4>
                                <p className="text-xs text-primary font-medium mb-1">{avatar.personality_title || avatar.type}</p>
                                <p className="text-[10px] text-muted-foreground italic mb-4 line-clamp-2 px-2">"{avatar.phrase}"</p>
                                
                                <div className="flex gap-2 w-full mt-auto pt-4 border-t">
                                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(avatar)}>
                                        <Edit className="w-3.5 h-3.5 mr-1" /> Editar
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(avatar.id)}>
                                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Eliminar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isCreating ? 'Crear nuevo avatar' : 'Editar avatar'}</DialogTitle>
                    </DialogHeader>
                    {currentAvatar && (
                        <form onSubmit={handleSave} className="space-y-4 py-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">ID Único (slug, ej: gata_callejera)</label>
                                <Input 
                                    value={currentAvatar.id} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, id: e.target.value})} 
                                    required 
                                    disabled={!isCreating}
                                    placeholder="Se genera desde el nombre"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Nombre Público</label>
                                <Input 
                                    value={currentAvatar.name} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, name: e.target.value, id: isCreating ? slugify(e.target.value) : currentAvatar.id})}
                                    required 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Título de Personalidad (opcional)</label>
                                <Input 
                                    value={currentAvatar.personality_title} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, personality_title: e.target.value})} 
                                    placeholder="Ej: Independiente e intuitiva"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Frase Corta (opcional)</label>
                                <Input 
                                    value={currentAvatar.phrase} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, phrase: e.target.value})} 
                                    placeholder="Ej: Por aquí hay algo que no sale en los mapas."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Tipo</label>
                                <Select value={currentAvatar.type} onValueChange={(v) => setCurrentAvatar({...currentAvatar, type: v as AvatarPreset['type']})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="human">Humano</SelectItem>
                                        <SelectItem value="animal">Animal</SelectItem>
                                        <SelectItem value="object">Objeto / Símbolo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Imagen del avatar</label>
                                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-muted bg-muted grid place-items-center">
                                    {currentAvatar.image_url && !imageFailed ? <img src={currentAvatar.image_url} alt="Vista previa" className="w-full h-full object-cover" onError={() => setImageFailed(true)} /> : <ImageOff className="w-8 h-8 text-muted-foreground" />}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-medium flex items-center gap-1"><Upload className="w-3 h-3" />Subir archivo recomendado</span>
                                    <Input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageUpload} 
                                        disabled={uploadingImage}
                                    />
                                    <Input 
                                        value={currentAvatar.image_url} 
                                        onChange={e => setCurrentAvatar({...currentAvatar, image_url: e.target.value})} 
                                        required 
                                        placeholder="/images/avatars/ejemplo.png o URL externa"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Puedes subir una imagen directamente o pegar una URL. La imagen subida se guardará en la nube.
                                    {uploadingImage && <span className="text-primary ml-2 font-bold animate-pulse">Subiendo...</span>}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Orden de Aparición</label>
                                <Input 
                                    type="number"
                                    value={currentAvatar.order_index} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, order_index: parseInt(e.target.value) || 0})} 
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch 
                                    id="active-status"
                                    checked={currentAvatar.active}
                                    onChange={(e) => setCurrentAvatar({...currentAvatar, active: e.target.checked})}
                                />
                                <label htmlFor="active-status" className="text-sm font-medium">Avatar Activo (Visible)</label>
                            </div>
                            
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                <Button type="submit" disabled={uploadingImage}>{isCreating ? 'Crear avatar' : 'Guardar cambios'}</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <BroadcastModal open={broadcastOpen} onOpenChange={setBroadcastOpen} />
        </div>
    );
};
