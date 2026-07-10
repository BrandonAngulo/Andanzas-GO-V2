import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/user.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Plus, Edit, Trash2, CheckCircle, RefreshCcw, Smile } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { ConfirmDialog } from '../../ui/confirm-dialog';

export const AdminAvatarsManager: React.FC = () => {
    const [avatars, setAvatars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

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
        try {
            if (currentAvatar.id && avatars.find(a => a.id === currentAvatar.id)) {
                await userService.updateAvatarPreset(currentAvatar.id, currentAvatar);
            } else {
                await userService.createAvatarPreset(currentAvatar);
            }
            setIsEditing(false);
            loadAvatars();
        } catch (err) {
            console.error("Error saving avatar:", err);
            alert("Error al guardar el avatar. Verifica que el ID sea único.");
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

    const openCreate = () => {
        setCurrentAvatar({
            id: '',
            name: '',
            type: 'human',
            image_url: '/images/avatars/',
            personality_title: '',
            phrase: '',
            active: true,
            order_index: 0
        });
        setIsEditing(true);
    };

    const openEdit = (avatar: any) => {
        setCurrentAvatar({ ...avatar });
        setIsEditing(true);
    };

    return (
        <div className="space-y-6">
            <ConfirmDialog 
                open={!!deleteId} 
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Seguro que deseas eliminar este avatar?"
                description="Esto podría afectar a los usuarios que ya lo tienen seleccionado."
                onConfirm={confirmDelete}
                destructive={true}
                confirmText="Eliminar"
            />
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Smile className="w-6 h-6 text-primary" /> Gestión de Avatares
                    </h3>
                    <p className="text-muted-foreground text-sm">Añade o edita los avatares disponibles para los usuarios.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadAvatars}><RefreshCcw className="w-4 h-4 mr-2" /> Actualizar</Button>
                    <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nuevo Avatar</Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 animate-pulse">Cargando avatares...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {avatars.map(avatar => (
                        <Card key={avatar.id} className={`overflow-hidden transition-all ${!avatar.active ? 'opacity-70 grayscale-[50%]' : ''}`}>
                            <CardContent className="p-5 flex flex-col items-center text-center relative">
                                <div className="absolute top-4 right-4 flex gap-1">
                                    <Switch 
                                        checked={avatar.active} 
                                        onChange={() => toggleActive(avatar)} 
                                        className="scale-75"
                                    />
                                </div>
                                
                                <div className="w-24 h-24 rounded-full border-4 border-muted overflow-hidden mb-3 bg-card shadow-sm">
                                    <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover" />
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
                        <DialogTitle>{currentAvatar?.id && avatars.find(a => a.id === currentAvatar.id) ? 'Editar Avatar' : 'Nuevo Avatar'}</DialogTitle>
                    </DialogHeader>
                    {currentAvatar && (
                        <form onSubmit={handleSave} className="space-y-4 py-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">ID Único (slug, ej: gata_callejera)</label>
                                <Input 
                                    value={currentAvatar.id} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, id: e.target.value})} 
                                    required 
                                    disabled={!!avatars.find(a => a.id === currentAvatar.id)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Nombre Público</label>
                                <Input 
                                    value={currentAvatar.name} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, name: e.target.value})} 
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
                                <Select value={currentAvatar.type} onValueChange={(v) => setCurrentAvatar({...currentAvatar, type: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="human">Humano</SelectItem>
                                        <SelectItem value="animal">Animal</SelectItem>
                                        <SelectItem value="object">Objeto / Símbolo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">URL de Imagen</label>
                                <Input 
                                    value={currentAvatar.image_url} 
                                    onChange={e => setCurrentAvatar({...currentAvatar, image_url: e.target.value})} 
                                    required 
                                    placeholder="/images/avatars/ejemplo.png"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Debes subir la imagen a la carpeta <code className="bg-muted px-1 rounded">public/images/avatars/</code> en tu repositorio.
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
                            
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                <Button type="submit">Guardar Avatar</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
