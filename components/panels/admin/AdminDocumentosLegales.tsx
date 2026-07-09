import React, { useState, useEffect } from 'react';
import { legalService, LegalDocument } from '../../../services/legal.service';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit, Eye, ShieldAlert } from 'lucide-react';

export function AdminDocumentosLegales() {
    const [documents, setDocuments] = useState<LegalDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<Partial<LegalDocument>>({});

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const docs = await legalService.getAllDocumentsAdmin();
            setDocuments(docs);
        } catch (e) {
            toast.error("Error al cargar documentos legales");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentDoc.title || !currentDoc.content_markdown || !currentDoc.version) {
            toast.error("Faltan campos obligatorios");
            return;
        }

        try {
            if (currentDoc.id) {
                await legalService.updateDocument(currentDoc.id, currentDoc);
                toast.success("Documento actualizado");
            } else {
                await legalService.createDocument(currentDoc);
                toast.success("Documento creado");
            }
            setIsEditing(false);
            loadDocuments();
        } catch (e) {
            toast.error("Error al guardar el documento");
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                        Documentos Legales y Políticas
                    </h3>
                    <p className="text-sm text-muted-foreground">Gestiona términos, políticas y normas de comunidad.</p>
                </div>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setCurrentDoc({ document_type: 'other', language: 'es', status: 'draft', requires_acceptance: false, requires_reacceptance: false })}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Documento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{currentDoc.id ? 'Editar Documento' : 'Nuevo Documento'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Título</label>
                                    <Input value={currentDoc.title || ''} onChange={e => setCurrentDoc({ ...currentDoc, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo</label>
                                    <Select value={currentDoc.document_type || 'other'} onValueChange={v => setCurrentDoc({ ...currentDoc, document_type: v as any })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="terms_of_service">Términos de Servicio</SelectItem>
                                            <SelectItem value="privacy_policy">Política de Privacidad</SelectItem>
                                            <SelectItem value="community_guidelines">Normas de Comunidad</SelectItem>
                                            <SelectItem value="accessibility_statement">Accesibilidad</SelectItem>
                                            <SelectItem value="consent_text">Texto de Consentimiento</SelectItem>
                                            <SelectItem value="other">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Versión</label>
                                    <Input value={currentDoc.version || ''} onChange={e => setCurrentDoc({ ...currentDoc, version: e.target.value })} placeholder="Ej: 1.0, 2.1" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Estado</label>
                                    <Select value={currentDoc.status || 'draft'} onValueChange={v => setCurrentDoc({ ...currentDoc, status: v as any })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Borrador</SelectItem>
                                            <SelectItem value="review">En Revisión</SelectItem>
                                            <SelectItem value="published">Publicado</SelectItem>
                                            <SelectItem value="archived">Archivado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 py-2">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="checkbox" checked={currentDoc.requires_acceptance || false} onChange={e => setCurrentDoc({ ...currentDoc, requires_acceptance: e.target.checked })} className="rounded text-primary focus:ring-primary h-4 w-4" />
                                    Requiere Aceptación Inicial
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer text-orange-600 font-medium">
                                    <input type="checkbox" checked={currentDoc.requires_reacceptance || false} onChange={e => setCurrentDoc({ ...currentDoc, requires_reacceptance: e.target.checked })} className="rounded text-orange-600 focus:ring-orange-600 h-4 w-4" />
                                    Forzar Re-aceptación a TODOS
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex justify-between">
                                    Contenido (Markdown)
                                    <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Guía Markdown</a>
                                </label>
                                <Textarea 
                                    className="min-h-[300px] font-mono text-sm" 
                                    value={currentDoc.content_markdown || ''} 
                                    onChange={e => setCurrentDoc({ ...currentDoc, content_markdown: e.target.value })} 
                                />
                            </div>
                            
                            <Button onClick={handleSave} className="w-full">Guardar Documento</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>
            ) : (
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="p-4 font-medium">Tipo</th>
                                <th className="p-4 font-medium">Título</th>
                                <th className="p-4 font-medium">Versión</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-muted/50">
                                    <td className="p-4 font-medium text-xs uppercase tracking-wider">{doc.document_type.replace(/_/g, ' ')}</td>
                                    <td className="p-4">{doc.title}</td>
                                    <td className="p-4">{doc.version}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            doc.status === 'published' ? 'bg-green-100 text-green-800' : 
                                            doc.status === 'draft' ? 'bg-slate-100 text-slate-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            setCurrentDoc(doc);
                                            setIsEditing(true);
                                        }}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
