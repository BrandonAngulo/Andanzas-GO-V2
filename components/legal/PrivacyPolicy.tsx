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
                            <CardTitle className="text-2xl">Política de Privacidad y Protección de Datos</CardTitle>
                        </div>
                        <p className="text-muted-foreground text-sm">Última actualización: {new Date().toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <ScrollArea className="h-[70vh] pr-4">
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">1. Introducción y Compromiso</h3>
                                    <p className="text-muted-foreground">
                                        Bienvenido a Andanzas GO ("nosotros", "nuestro", "la Plataforma"). Su privacidad y la seguridad de sus datos son nuestra prioridad.
                                        Esta <strong>Política de Privacidad y Protección de Datos</strong> tiene como objetivo informarle de manera clara y transparente sobre cómo recopilamos, utilizamos, almacenamos y protegemos su información personal, cumpliendo con las normativas de protección de datos aplicables.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">2. Datos que Recopilamos</h3>
                                    <p className="text-muted-foreground mb-2">Para ofrecerle la mejor experiencia turística y de exploración, recopilamos los siguientes tipos de datos:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong>Datos de Identificación:</strong> Nombre, dirección de correo electrónico, avatar y credenciales de autenticación (gestionadas de forma segura a través de proveedores externos).</li>
                                        <li><strong>Datos de Geolocalización:</strong> Utilizamos su ubicación precisa en tiempo real para habilitar funciones de navegación, recomendaciones cercanas y gamificación por proximidad. Estos datos no se almacenan en nuestros servidores de forma permanente vinculada a su identidad, salvo para estadísticas anónimas o si usted guarda explícitamente una ruta.</li>
                                        <li><strong>Datos de Uso y Preferencias:</strong> Insignias ganadas, rutas completadas, sitios favoritos, reseñas, estilo de viaje y necesidades de accesibilidad configuradas en su perfil.</li>
                                        <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de dispositivo, sistema operativo e identificadores únicos de dispositivo para fines de seguridad y mejora del servicio.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">3. Finalidad del Tratamiento</h3>
                                    <p className="text-muted-foreground">Sus datos personales son tratados con las siguientes finalidades:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong>Prestación del Servicio:</strong> Permitirle navegar mapas, crear rutas personalizadas y acceder a contenido turístico.</li>
                                        <li><strong>Personalización:</strong> Adaptar las recomendaciones según sus intereses, estilo de viaje y necesidades de accesibilidad.</li>
                                        <li><strong>Gamificación:</strong> Gestionar su progreso, puntos, niveles y desbloqueo de insignias digitales.</li>
                                        <li><strong>Mejora Continua:</strong> Analizar tendencias de uso de forma agregada y anónima para optimizar la aplicación.</li>
                                        <li><strong>Seguridad:</strong> Detectar y prevenir fraudes, abusos o incidentes de seguridad.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">4. Protección, Almacenamiento y Retención</h3>
                                    <p className="text-muted-foreground mb-2">
                                        Implementamos medidas técnicas, administrativas y físicas robustas para proteger su información contra acceso no autorizado, pérdida o alteración.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong>Cifrado:</strong> Los datos sensibles se transmiten mediante protocolos seguros (HTTPS/TLS).</li>
                                        <li><strong>Base de Datos Segura:</strong> Utilizamos infraestructura de nube certificada (Supabase/PostgreSQL) con controles de acceso estrictos (Row Level Security).</li>
                                        <li><strong>Retención:</strong> Conservamos sus datos personales solo mientras su cuenta esté activa o sea necesario para cumplir con obligaciones legales. Si decide eliminar su cuenta, sus datos personales identificables serán eliminados o anonimizados de forma irreversible.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">5. Compartir Información con Terceros</h3>
                                    <p className="text-muted-foreground">
                                        <strong>No vendemos ni comercializamos sus datos personales.</strong> Solo compartimos información en los siguientes casos:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong>Proveedores de Servicios:</strong> Servicios de mapas (Google Maps), autenticación y alojamiento en la nube, quienes actúan bajo nuestras instrucciones y estándares de seguridad.</li>
                                        <li><strong>Requerimiento Legal:</strong> Cuando sea solicitado por autoridades competentes en cumplimiento de la ley.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">6. Sus Derechos (Habeas Data)</h3>
                                    <p className="text-muted-foreground">Como titular de sus datos, usted cuenta con los siguientes derechos:</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong>Acceso y Rectificación:</strong> Puede consultar y actualizar su perfil en cualquier momento desde la configuración de la App.</li>
                                        <li><strong>Supresión (Derecho al Olvido):</strong> Puede solicitar la eliminación definitiva de su cuenta y sus datos asociados directamente desde la sección "Gestión de Cuenta".</li>
                                        <li><strong>Portabilidad:</strong> Tiene derecho a solicitar una copia de sus datos personales.</li>
                                        <li><strong>Oposición:</strong> Puede oponerse al tratamiento de datos específicos (como la geolocalización) revocando los permisos en su dispositivo, aunque esto limitará la funcionalidad de la App.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">7. Cookies y Tecnologías Similares</h3>
                                    <p className="text-muted-foreground">
                                        Utilizamos almacenamiento local y cookies técnicas estrictamente necesarias para mantener su sesión activa y recordar sus preferencias de configuración (tema, idioma). No utilizamos cookies de rastreo publicitario de terceros.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">8. Contacto y Responsable</h3>
                                    <p className="text-muted-foreground">
                                        Para ejercer sus derechos o resolver dudas sobre esta política, puede contactar a nuestro equipo de protección de datos a través de la sección de Soporte en la aplicación o escribiendo al correo electrónico oficial de contacto de Andanzas GO.
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
