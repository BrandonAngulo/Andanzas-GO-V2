import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { legalService, LegalDocument } from '../../services/legal.service';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function LegalAcceptanceModal() {
    const { user } = useAuth();
    const [pendingDocs, setPendingDocs] = useState<LegalDocument[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        if (!user) return;

        const checkPending = async () => {
            const docs = await legalService.checkPendingMandatoryAcceptances(user.id);
            if (docs && docs.length > 0) {
                setPendingDocs(docs);
                setIsOpen(true);
            }
        };

        checkPending();
    }, [user]);

    const handleAccept = async () => {
        if (!user) return;
        setIsAccepting(true);
        const currentDoc = pendingDocs[currentIndex];
        
        try {
            const success = await legalService.acceptDocument(
                user.id,
                currentDoc.id,
                currentDoc.document_type,
                currentDoc.version
            );

            if (success) {
                toast.success("Documento aceptado");
                if (currentIndex < pendingDocs.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    setIsOpen(false);
                }
            } else {
                toast.error("Hubo un error al registrar tu aceptación. Intenta de nuevo.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Ocurrió un error.");
        } finally {
            setIsAccepting(false);
        }
    };

    if (pendingDocs.length === 0) return null;

    const currentDoc = pendingDocs[currentIndex];

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            {/* onOpenChange empty prevents clicking outside to close */}
            <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] flex flex-col p-6" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-2xl text-primary">Actualización de {currentDoc.title}</DialogTitle>
                    <DialogDescription>
                        Hemos actualizado nuestras políticas (Versión {currentDoc.version}). Es necesario que las leas y aceptes para continuar usando Andanzas GO.
                        {pendingDocs.length > 1 && (
                            <span className="block mt-1 font-semibold">Documento {currentIndex + 1} de {pendingDocs.length}</span>
                        )}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden rounded-md border p-4 bg-muted/30">
                    <ScrollArea className="h-full pr-4">
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {currentDoc.content_markdown}
                            </ReactMarkdown>
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
                    <div className="text-xs text-muted-foreground mr-auto max-w-xs">
                        Al hacer clic en "Aceptar", confirmas que has leído y estás de acuerdo con el documento presentado.
                    </div>
                    <Button onClick={handleAccept} disabled={isAccepting} className="w-full sm:w-auto">
                        {isAccepting ? "Guardando..." : "Aceptar y continuar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
