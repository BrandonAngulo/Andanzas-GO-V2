import React from 'react';
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfService() {
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
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Términos de Servicio</CardTitle>
                        </div>
                        <p className="text-muted-foreground text-sm">Última actualización: {new Date().toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <ScrollArea className="h-[70vh] pr-4">
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-lg font-semibold mb-2">1. Aceptación de los Términos</h3>
                                    <p className="text-muted-foreground">
                                        Al acceder y utilizar Andanzas GO, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra aplicación.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">2. Uso de la Aplicación</h3>
                                    <p className="text-muted-foreground">
                                        Andanzas GO es una plataforma para explorar rutas turísticas y compartir experiencias. Usted se compromete a utilizar la aplicación solo para fines legales y de acuerdo con estos términos.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground mt-2">
                                        <li>No debe usar la aplicación para publicar contenido ofensivo, ilegal o que infrinja derechos de terceros.</li>
                                        <li>No debe intentar vulnerar la seguridad de la aplicación ni acceder a cuentas de otros usuarios.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">3. Cuentas de Usuario</h3>
                                    <p className="text-muted-foreground">
                                        Para acceder a ciertas funciones, debe crear una cuenta. Usted es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades que ocurran bajo su cuenta.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">4. Contenido Generado por el Usuario</h3>
                                    <p className="text-muted-foreground">
                                        Al publicar reseñas, fotos o rutas, usted otorga a Andanzas GO una licencia no exclusiva para usar, mostrar y distribuir dicho contenido en relación con el servicio. Usted declara que posee los derechos necesarios sobre el contenido que publica.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">5. Limitación de Responsabilidad</h3>
                                    <p className="text-muted-foreground">
                                        Andanzas GO se proporciona "tal cual". No garantizamos que la información de las rutas o mapas sea siempre exacta o esté libre de errores. No nos hacemos responsables de daños directos o indirectos derivados del uso de la aplicación.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">6. Modificaciones</h3>
                                    <p className="text-muted-foreground">
                                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Le notificaremos sobre cambios significativos. El uso continuado de la aplicación implica la aceptación de los nuevos términos.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold mb-2">7. Ley Aplicable</h3>
                                    <p className="text-muted-foreground">
                                        Estos términos se rigen por las leyes vigentes en su jurisdicción local, sin tener en cuenta sus conflictos de principios legales.
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
