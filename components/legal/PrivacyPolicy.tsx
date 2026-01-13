import React from 'react';
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Shield } from "lucide-react";

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
                            <CardTitle className="text-2xl">Política de Privacidad</CardTitle>
                        </div>
                        <p className="text-muted-foreground text-sm">Última actualización: {new Date().toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <ScrollArea className="h-[70vh] pr-4">
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">1. Introducción</h3>
                                    <p className="text-muted-foreground">
                                        Bienvenido a Andanzas GO ("nosotros", "nuestro"). Respetamos su privacidad y nos comprometemos a proteger su información personal.
                                        Esta Política de Privacidad explica cómo recopilamos, usamos y compartimos su información cuando utiliza nuestra aplicación.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">2. Información que Recopilamos</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong>Información de Cuenta:</strong> Cuando se registra o inicia sesión con Google, recopilamos su nombre, dirección de correo electrónico y foto de perfil.</li>
                                        <li><strong>Datos de Ubicación:</strong> Utilizamos su ubicación para mostrarle rutas y puntos de interés cercanos. Estos datos se utilizan en tiempo real y no se almacenan permanentemente sin su acción explícita.</li>
                                        <li><strong>Contenido de Usuario:</strong> Recopilamos las rutas que crea, las reseñas que escribe y las fotos que sube.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">3. Cómo Usamos su Información</h3>
                                    <p className="text-muted-foreground">Utilizamos su información para:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li>Crear y gestionar su cuenta de usuario.</li>
                                        <li>Proporcionar y mejorar las funcionalidades del mapa y las rutas.</li>
                                        <li>Personalizar su experiencia y otorgar insignias (gamificación).</li>
                                        <li>Comunicarnos con usted sobre actualizaciones o soporte.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">4. Compartir Información</h3>
                                    <p className="text-muted-foreground">
                                        No vendemos su información personal a terceros. Podemos compartir información genérica y agregada que no lo identifique personalmente para análisis de uso.
                                        Solo compartimos datos personales cuando es legalmente requerido o necesario para proteger nuestros derechos.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">5. Seguridad de Datos</h3>
                                    <p className="text-muted-foreground">
                                        Implementamos medidas de seguridad razonables para proteger su información. Utilizamos servicios de autenticación seguros (como Google OAuth y Supabase) para gestionar sus credenciales.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">6. Sus Derechos</h3>
                                    <p className="text-muted-foreground">
                                        Tiene derecho a acceder, corregir o eliminar su información personal. Puede gestionar sus datos desde su perfil o contactarnos para solicitar la eliminación completa de su cuenta.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">7. Contacto</h3>
                                    <p className="text-muted-foreground">
                                        Si tiene preguntas sobre esta política, contáctenos a través de nuestro soporte integrado en la aplicación o al correo de administración.
                                    </p>
                                </section>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
