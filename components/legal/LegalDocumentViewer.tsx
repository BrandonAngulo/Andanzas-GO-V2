import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { legalService, LegalDocument } from '../../services/legal.service';
import { ScrollArea } from '../ui/scroll-area';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface LegalDocumentViewerProps {
    documentType: string;
    fallbackContent?: React.ReactNode;
}

export function LegalDocumentViewer({ documentType, fallbackContent }: LegalDocumentViewerProps) {
    const [document, setDocument] = useState<LegalDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDoc = async () => {
            try {
                const doc = await legalService.getPublishedDocument(documentType);
                if (doc) {
                    setDocument(doc);
                }
            } catch (e) {
                console.error("Failed to load legal document:", e);
            } finally {
                setLoading(false);
            }
        };
        loadDoc();
    }, [documentType]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!document) {
        return <>{fallbackContent}</>;
    }

    return (
        <div className="legal-document-viewer bg-white rounded-xl shadow-sm p-6 border border-border">
            <div className="mb-6 pb-4 border-b border-border">
                <h1 className="text-2xl font-bold text-slate-800">{document.title}</h1>
                <div className="flex gap-4 mt-2 text-sm text-slate-500">
                    <p>Versión: <span className="font-medium text-slate-700">{document.version}</span></p>
                    {document.effective_date && (
                        <p>Vigente desde: <span className="font-medium text-slate-700">
                            {format(new Date(document.effective_date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </span></p>
                    )}
                </div>
            </div>
            <ScrollArea className="h-[60vh] md:h-[70vh] pr-4 prose prose-sm md:prose-base prose-slate max-w-none prose-headings:font-bold prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {document.content_markdown}
                </ReactMarkdown>
            </ScrollArea>
        </div>
    );
}
