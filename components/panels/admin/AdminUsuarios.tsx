import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../../types';
import { userService } from '../../../services/user.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Search, ShieldCheck, User, MoreVertical, MessageSquareWarning, Ban, UserCog } from 'lucide-react';
import { UserReviewsModal } from './UserReviewsModal';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../ui/select';

export const AdminUsuarios = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [reviewModalUser, setReviewModalUser] = useState<UserProfile | null>(null);
    const [managementUser, setManagementUser] = useState<UserProfile | null>(null);
    const [selectedRole, setSelectedRole] = useState('user');
    const [actionToConfirm, setActionToConfirm] = useState<{ type: 'role' | 'ban', userId: string, payload: string } | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await userService.getAllProfilesAdmin();
        setUsers(data);
        setLoading(false);
    };

    const openManagement = (user: UserProfile) => {
        setManagementUser(user);
        setSelectedRole(user.role || 'user');
    };

    const handleRoleChange = () => {
        if (!managementUser || selectedRole === managementUser.role) return;
        setActionToConfirm({ type: 'role', userId: managementUser.id, payload: selectedRole });
        setManagementUser(null);
    };

    const handleBanUser = (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        setActionToConfirm({ type: 'ban', userId, payload: newStatus });
        setManagementUser(null);
    };

    const confirmAction = async () => {
        if (!actionToConfirm) return;
        
        if (actionToConfirm.type === 'role') {
            await userService.updateRole(actionToConfirm.userId, actionToConfirm.payload);
        } else if (actionToConfirm.type === 'ban') {
            await userService.updateUserStatus(actionToConfirm.userId, actionToConfirm.payload as 'active' | 'banned');
        }
        
        loadUsers();
        setActionToConfirm(null);
    };

    const filteredUsers = users.filter(u => 
        (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <Dialog open={!!managementUser} onOpenChange={(open) => !open && setManagementUser(null)}>
                <DialogContent className="overflow-visible rounded-3xl border border-primary/10 p-0 shadow-2xl sm:max-w-md">
                    {managementUser && (
                        <>
                            <div className="rounded-t-3xl bg-gradient-to-br from-[#075f54] to-[#11a66b] px-6 py-5 text-white">
                                <DialogHeader className="mb-0 pr-8 text-left">
                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                                        <UserCog className="h-6 w-6 text-amber-200" />
                                    </div>
                                    <DialogTitle className="text-2xl font-black text-white">Gestionar usuario</DialogTitle>
                                    <DialogDescription className="text-emerald-50">
                                        {managementUser.full_name || 'Usuario sin nombre'} · {managementUser.email}
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="space-y-5 px-6 py-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold" htmlFor="admin-user-role">Rol en la plataforma</label>
                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger id="admin-user-role" className="h-12 rounded-xl bg-background">
                                            <span>
                                                {selectedRole === 'admin' ? 'Administrador' : selectedRole === 'editor' ? 'Editor' : 'Usuario'}
                                            </span>
                                        </SelectTrigger>
                                        <SelectContent className="z-[1600] rounded-xl">
                                            <SelectItem value="user">Usuario</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Los editores pueden gestionar contenido. Los administradores también pueden gestionar usuarios y roles.
                                    </p>
                                </div>

                                <div className="grid gap-2 border-t pt-4 sm:grid-cols-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="justify-start rounded-xl"
                                        onClick={() => {
                                            setReviewModalUser(managementUser);
                                            setManagementUser(null);
                                        }}
                                    >
                                        <MessageSquareWarning className="mr-2 h-4 w-4" />
                                        Moderar reseñas
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="justify-start rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={() => handleBanUser(managementUser.id, managementUser.status || 'active')}
                                    >
                                        <Ban className="mr-2 h-4 w-4" />
                                        {managementUser.status === 'banned' ? 'Quitar baneo' : 'Banear usuario'}
                                    </Button>
                                </div>
                            </div>

                            <DialogFooter className="m-0 flex-col gap-2 rounded-b-3xl border-t bg-muted/20 px-6 py-4 sm:flex-row">
                                <Button type="button" variant="ghost" onClick={() => setManagementUser(null)} className="rounded-xl">
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleRoleChange}
                                    disabled={selectedRole === (managementUser.role || 'user')}
                                    className="rounded-xl"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Guardar rol
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog 
                open={!!actionToConfirm} 
                onOpenChange={(open) => !open && setActionToConfirm(null)}
                title={
                    actionToConfirm?.type === 'role' 
                        ? `¿Cambiar rol a ${actionToConfirm.payload}?` 
                        : `¿${actionToConfirm?.payload === 'banned' ? 'Banear' : 'Desbanear'} a este usuario?`
                }
                description={actionToConfirm?.type === 'ban' && actionToConfirm.payload === 'banned' ? 'No podrá usar la app.' : undefined}
                onConfirm={confirmAction}
                destructive={actionToConfirm?.type === 'ban' && actionToConfirm.payload === 'banned'}
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar usuario por nombre o email..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Cargando usuarios...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredUsers.map(user => (
                        <Card key={user.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className={`font-semibold text-base ${user.status === 'banned' ? 'line-through text-muted-foreground' : ''}`}>
                                                    {user.full_name || 'Sin nombre'}
                                                </h4>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                                                    user.role === 'editor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-secondary text-secondary-foreground'
                                                }`}>
                                                    {user.role === 'admin' ? 'Administrador' : user.role === 'editor' ? 'Editor' : 'Usuario'}
                                                </span>
                                                {user.status === 'banned' && (
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center">
                                                        <Ban className="w-3 h-3 mr-1" /> Baneado
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm font-semibold">{user.points} pts</div>
                                            <div className="text-xs text-muted-foreground">Nivel {user.level}</div>
                                        </div>
                                        
                                        <div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                aria-label={`Gestionar a ${user.full_name || user.email || 'usuario'}`}
                                                onClick={() => openManagement(user)}
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                            No se encontraron usuarios.
                        </div>
                    )}
                </div>
            )}
            
            {reviewModalUser && (
                <UserReviewsModal user={reviewModalUser} onClose={() => setReviewModalUser(null)} />
            )}
        </div>
    );
};
