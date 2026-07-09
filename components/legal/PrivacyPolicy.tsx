import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { LegalDocumentViewer } from "./LegalDocumentViewer";

export default function PrivacyPolicy() {
    const goBack = () => {
        window.history.pushState({}, '', '/');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={goBack} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a la aplicación
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Política de Privacidad y Protección de Datos</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <LegalDocumentViewer 
                            documentType="privacy_policy" 
                            fallbackContent={
                                <div className="p-6 text-center text-muted-foreground">
                                    No se pudo cargar la política de privacidad. Por favor, intenta de nuevo más tarde.
                                </div>
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
