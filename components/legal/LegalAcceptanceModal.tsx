import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { legalService, LegalDocument } from '../../services/legal.service';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react';

export function LegalAcceptanceModal() {
    const { user } = useAuth();
    const [pendingDocs, setPendingDocs] = useState<LegalDocument[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<LegalDocument | null>(null);

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
        
        try {
            for (const document of pendingDocs) {
                const success = await legalService.acceptDocument(
                    user.id,
                    document.id,
                    document.document_type,
                    document.version
                );
                if (!success) {
                    throw new Error(`No se pudo aceptar ${document.title}`);
                }
            }

            toast.success(pendingDocs.length > 1 ? "Documentos aceptados" : "Documento aceptado");
            setViewingDoc(null);
            setIsOpen(false);
        } catch (e) {
            console.error(e);
            toast.error("No pudimos registrar tu aceptación. Intenta de nuevo.");
        } finally {
            setIsAccepting(false);
        }
    };

    if (pendingDocs.length === 0) return null;

    const documentDescription = (document: LegalDocument) => {
        switch (document.document_type) {
            case 'terms_of_service':
                return 'Condiciones para usar Andanzas GO y participar en sus experiencias.';
            case 'privacy_policy':
                return 'Cómo usamos, protegemos y administramos tu información.';
            case 'community_guidelines':
                return 'Acuerdos para convivir y participar de manera respetuosa.';
            case 'accessibility_statement':
                return 'Compromisos y alcance de accesibilidad de la plataforma.';
            default:
                return 'Información importante sobre el uso de Andanzas GO.';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            {/* onOpenChange empty prevents clicking outside to close */}
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden rounded-[28px] border border-primary/10 bg-background p-0 shadow-2xl sm:max-w-3xl" showCloseButton={false}>
                {viewingDoc ? (
                    <>
                        <div className="border-b bg-muted/30 px-5 py-4 sm:px-7">
                            <button
                                type="button"
                                onClick={() => setViewingDoc(null)}
                                className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver a la aceptación
                            </button>
                            <DialogHeader className="mb-0">
                                <DialogTitle className="text-2xl">{viewingDoc.title}</DialogTitle>
                                <DialogDescription>Versión {viewingDoc.version}</DialogDescription>
                            </DialogHeader>
                        </div>
                        <ScrollArea className="min-h-0 flex-1 px-5 py-5 sm:px-7">
                            <div className="prose prose-sm max-w-none prose-slate prose-headings:font-bold prose-a:text-primary dark:prose-invert md:prose-base">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {viewingDoc.content_markdown}
                                </ReactMarkdown>
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <>
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#075f54] via-[#087a65] to-[#11a66b] px-6 pb-6 pt-7 text-white sm:px-8">
                            <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-amber-300/15 blur-2xl" />
                            <div className="relative flex items-start gap-4">
                                <div className="rounded-2xl bg-white/12 p-3 ring-1 ring-white/20">
                                    <ShieldCheck className="h-7 w-7 text-amber-200" />
                                </div>
                                <DialogHeader className="mb-0 text-left">
                                    <DialogTitle className="text-2xl font-black text-white">Un último paso para continuar</DialogTitle>
                                    <DialogDescription className="max-w-xl text-sm leading-relaxed text-emerald-50">
                                        Reunimos en un solo lugar los documentos que requieren tu aceptación. Puedes abrir cada uno y leerlo con detalle antes de continuar.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-8">
                            <div className="space-y-3">
                                {pendingDocs.map((document) => (
                                    <div key={document.id} className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:flex-row sm:items-center">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                                <FileCheck2 className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-bold">{document.title}</p>
                                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">v{document.version}</span>
                                                </div>
                                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{documentDescription(document)}</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setViewingDoc(document)}
                                            className="shrink-0 rounded-xl"
                                        >
                                            Leer documento
                                            <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                <p className="text-sm leading-relaxed">
                                    Al aceptar confirmas que pudiste consultar los documentos anteriores y que estás de acuerdo con sus condiciones vigentes.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="m-0 flex-col gap-3 border-t bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
                            <p className="mr-auto text-xs text-muted-foreground">
                                Registrarás una sola acción para {pendingDocs.length === 1 ? 'este documento' : `${pendingDocs.length} documentos`}.
                            </p>
                            <Button onClick={handleAccept} disabled={isAccepting} className="w-full rounded-xl sm:w-auto">
                                {isAccepting ? "Guardando..." : "Aceptar y continuar"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
