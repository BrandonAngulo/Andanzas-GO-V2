import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../../types';
import { userService } from '../../../services/user.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Search, ShieldAlert, ShieldCheck, User, MoreVertical, MessageSquareWarning, Ban } from 'lucide-react';
import { UserReviewsModal } from './UserReviewsModal';

export const AdminUsuarios = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [reviewModalUser, setReviewModalUser] = useState<UserProfile | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        const data = await userService.getAllProfilesAdmin();
        setUsers(data);
        setLoading(false);
    };

    const handleRoleChange = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : (currentRole === 'editor' ? 'admin' : 'editor');
        if (window.confirm(`¿Cambiar rol a ${newRole}?`)) {
            await userService.updateRole(userId, newRole);
            loadUsers();
        }
        setActiveDropdown(null);
    };

    const handleBanUser = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        if (window.confirm(`¿${newStatus === 'banned' ? 'Banear' : 'Desbanear'} a este usuario? ${newStatus === 'banned' ? 'No podrá usar la app.' : ''}`)) {
            await userService.updateUserStatus(userId, newStatus as 'active' | 'banned');
            loadUsers();
        }
        setActiveDropdown(null);
    };

    const filteredUsers = users.filter(u => 
        (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
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
                                        
                                        <div className="relative">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </Button>
                                            
                                            {activeDropdown === user.id && (
                                                <div className="absolute right-0 top-10 w-48 bg-background border border-border shadow-xl rounded-lg py-1 z-50">
                                                    <button 
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                                                        onClick={() => handleRoleChange(user.id, user.role || 'user')}
                                                    >
                                                        <ShieldAlert className="w-4 h-4 mr-2" />
                                                        Cambiar Rol
                                                    </button>
                                                    <button 
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                                                        onClick={() => { setReviewModalUser(user); setActiveDropdown(null); }}
                                                    >
                                                        <MessageSquareWarning className="w-4 h-4 mr-2" />
                                                        Moderar Reseñas
                                                    </button>
                                                    <button 
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center"
                                                        onClick={() => handleBanUser(user.id, user.status || 'active')}
                                                    >
                                                        <Ban className="w-4 h-4 mr-2" />
                                                        {user.status === 'banned' ? 'Quitar Baneo' : 'Banear Usuario'}
                                                    </button>
                                                </div>
                                            )}
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
