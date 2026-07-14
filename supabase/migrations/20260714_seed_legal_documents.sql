-- =========================================================================
-- LEGAL DOCUMENTS — SEED (contenido definitivo)
-- Corrige la ausencia de documentos legales: la tabla legal_documents
-- existia en el codigo pero su contenido no estaba cargado en la BD.
-- Seed idempotente (WHERE NOT EXISTS por document_type + version).
-- Generado desde los .md fuente; verificado byte a byte por md5.
-- =========================================================================

-- accessibility_statement v1.0  (md5 a7837a1acba2288f5cb5ae87e70e98e1)
INSERT INTO public.legal_documents
  (document_type, title, version, content_markdown, language, status, effective_date, published_at, requires_acceptance, requires_reacceptance)
SELECT 'accessibility_statement', 'Declaración de Accesibilidad — Andanzas GO', '1.0', $legal$# Declaración de Accesibilidad — Andanzas GO

## Nuestro compromiso

En Andanzas GO creemos que la ciudad es de todas y todos, y que descubrirla no debería depender de las capacidades de cada quien. Trabajamos para que la App sea usable por el mayor número de personas posible, incluidas quienes tienen discapacidad visual, auditiva, motriz o cognitiva, o quienes tienen poca familiaridad con la tecnología.

Buscamos acercarnos a las buenas prácticas internacionales de accesibilidad web y móvil (pautas WCAG). No declaramos una certificación de cumplimiento total: es un camino en el que avanzamos de forma continua.

## Qué hemos implementado

- Un **menú de accesibilidad** dentro de la App para ajustar la experiencia de lectura y navegación. *[Confirmar/ajustar según las opciones reales: p. ej., tamaño de texto, alto contraste, reducción de movimiento.]*
- **Información de accesibilidad de cada sitio** cuando está disponible (por ejemplo, si un lugar es accesible en silla de ruedas), para que planees tu recorrido con antelación.
- App disponible en **español e inglés**.
- Un diseño que busca ser **claro y sencillo de usar**, con textos legibles y acciones principales fáciles de encontrar.

## Limitaciones que reconocemos

Somos honestos sobre lo que falta:

- La accesibilidad es un trabajo **en desarrollo**; puede haber pantallas o funciones que aún no cumplan del todo.
- Algunas funciones dependen de **servicios de terceros** (como los mapas de Google), cuya accesibilidad no controlamos por completo.
- La información de accesibilidad de los sitios se irá **completando de forma progresiva** a medida que verificamos cada lugar.

## Si encontrás una barrera

Tu experiencia nos ayuda a mejorar. Si tenés dificultades para usar alguna parte de la App, o si necesitás la información en otro formato, escribinos: haremos lo posible por ayudarte y por corregirlo en las próximas versiones.

**Contacto:** andanzascentrocultural@gmail.com o la sección "Soporte" de la App.

## Mejora continua

Revisamos y mejoramos la accesibilidad de forma progresiva, y la tenemos presente al diseñar cada nueva función.$legal$, 'es', 'published', timezone('utc'::text, now()), timezone('utc'::text, now()), false, false
WHERE NOT EXISTS (SELECT 1 FROM public.legal_documents WHERE document_type='accessibility_statement' AND version='1.0');

-- community_guidelines v1.0  (md5 245faba06500cb6f1b9614f6a46699dd)
INSERT INTO public.legal_documents
  (document_type, title, version, content_markdown, language, status, effective_date, published_at, requires_acceptance, requires_reacceptance)
SELECT 'community_guidelines', 'Normas de Comunidad — Andanzas GO', '1.0', $legal$# Normas de Comunidad — Andanzas GO

## El espíritu de Andanzas

Andanzas GO nació para vivir y compartir la ciudad con cariño y respeto. Cuando publicás una reseña, una foto o una ruta, le estás contando la ciudad a alguien más. Estas normas existen para que ese espacio siga siendo un lugar de descubrimiento, memoria y comunidad — no de agresión ni de ruido. Son un complemento de nuestros Términos de Servicio.

## Lo que sí queremos ver

- **Reseñas honestas y útiles**, basadas en experiencias reales, que le sirvan a quien viene detrás.
- **Fotos propias** de los lugares, la comida, los recorridos.
- **Respeto** por los demás usuarios, por los lugares y por la gente que los habita y trabaja en ellos.
- **Curiosidad y buena onda**: esto es un espacio para andar y aprender la ciudad, no para competir ni pelear.

## Lo que no se permite

No se admite contenido que:

- Sea **ofensivo, difamatorio, discriminatorio o de odio** (por raza, etnia, género, orientación, religión, origen, discapacidad, etc.).
- Sea **ilegal**, promueva actividades ilegales o ponga en riesgo a otras personas.
- **Estigmatice o denigre barrios, territorios o comunidades.** Podés contar tu experiencia con honestidad —incluida una mala experiencia— sin señalar zonas o grupos como "peligrosos" o "indeseables". En Andanzas los territorios se cuentan con dignidad.
- Contenga **datos personales de terceros** (direcciones, teléfonos, identificaciones) o **fotos de personas sin su consentimiento**, en especial de menores.
- Sea **sexual, violento o gráfico**, o inapropiado para un espacio abierto a adolescentes desde los 14 años.
- Sea **spam, publicidad no autorizada, reseñas falsas o pagadas**, o manipule las valoraciones.
- **Suplante** a otra persona, institución o al propio equipo de Andanzas.
- Vulnere **derechos de autor** o de propiedad intelectual de terceros.

## Reseñas con integridad

Las reseñas deben reflejar experiencias reales. No publiques reseñas falsas, ni a cambio de pago, ni para perjudicar a un lugar por motivos ajenos a tu visita. Si tenés un vínculo comercial con un sitio, no lo reseñes como si fueras un visitante cualquiera.

## Territorios y comunidades

Buena parte de la ciudad que Andanzas celebra son territorios de memoria, saberes afro e indígenas y trabajo comunitario. Al hablar de ellos, hacelo desde el reconocimiento, no desde el prejuicio. Si vas a recorrer y contar la ladera, el oriente o cualquier barrio popular, hacelo como quien es recibido, no como quien juzga.

## Moderación y consecuencias

Para cuidar el espacio, podemos **retirar contenido**, ocultar reseñas, o **suspender o eliminar cuentas** que incumplan estas normas o los Términos de Servicio. Según la gravedad, las consecuencias van desde retirar una publicación hasta cerrar la cuenta de forma definitiva.

## Cómo reportar y cómo apelar

- **Reportar:** si ves contenido que incumple estas normas, usá la opción de reporte en la App o escribí a soporte.
- **Apelar:** si consideramos que incumpliste y no estás de acuerdo, podés escribirnos para explicar tu caso; revisaremos la decisión de buena fe.

## Menores de edad

Andanzas GO tiene una edad mínima de uso de **14 años**. El contenido publicado debe ser apropiado para una comunidad que incluye adolescentes.

## Contacto

Dudas, reportes o apelaciones: **andanzascentrocultural@gmail.com** o la sección "Soporte" de la App.$legal$, 'es', 'published', timezone('utc'::text, now()), timezone('utc'::text, now()), true, true
WHERE NOT EXISTS (SELECT 1 FROM public.legal_documents WHERE document_type='community_guidelines' AND version='1.0');

-- terms_of_service v2.0  (md5 b0faeb896007bbb20ca24f68d5f9cd1a)
INSERT INTO public.legal_documents
  (document_type, title, version, content_markdown, language, status, effective_date, published_at, requires_acceptance, requires_reacceptance)
SELECT 'terms_of_service', 'Términos de Servicio — Andanzas GO', '2.0', $legal$# Términos de Servicio — Andanzas GO

## 1. Aceptación de los términos

Andanzas GO ("la App", "la Plataforma") es un proyecto de **Andanzas Centro Cultural**, operado por **[Nombre legal completo]** (persona natural), con sede en Santiago de Cali, Colombia. Al acceder y utilizar la App, usted acepta estos Términos de Servicio. Si no está de acuerdo con alguna parte, no debe utilizar la App.

## 2. Descripción del servicio

Andanzas GO es una plataforma cultural para descubrir y **vivir** la ciudad a través de un mapa de sitios, rutas gamificadas (con retos, check-ins e insignias), contenido pedagógico ("Pa' que sepás"), eventos y reseñas. La App entrega información cultural con fines de exploración; **no es un servicio de guía turística profesional ni de transporte**.

## 3. Requisitos de uso y cuentas

- La **edad mínima de uso es 14 años**. La App no está dirigida a menores de 14 años y no se permite su registro. Los usuarios entre **14 y 17 años** declaran, al registrarse, contar con la autorización de sus padres o representantes legales. El uso pleno corresponde a los **mayores de 18 años**. Nos reservamos el derecho de suspender o eliminar cuentas de menores de 14 años.
- Para acceder a ciertas funciones debe crear una cuenta. Usted es responsable de la confidencialidad de sus credenciales y de toda actividad realizada bajo su cuenta.
- Debe proporcionar información veraz y mantenerla actualizada.

## 4. Uso aceptable y conducta

Usted se compromete a usar la App solo con fines lícitos. En particular, **no debe:**

- Publicar contenido ofensivo, difamatorio, discriminatorio, ilegal o que infrinja derechos de terceros.
- Publicar fotografías de otras personas sin su consentimiento, ni contenido sobre el que no tenga derechos.
- Suplantar a otras personas o entidades.
- Vulnerar la seguridad de la App, acceder a cuentas ajenas, ni extraer datos de forma automatizada (scraping) o masiva.
- Usar la App para fines comerciales no autorizados.

Podemos **moderar, retirar contenido y suspender o cancelar cuentas** que incumplan estas reglas. Usted puede reportar contenido inapropiado desde la App o escribiendo a soporte.

## 5. Contenido generado por el usuario

Al publicar reseñas, fotografías o rutas, usted declara que posee los derechos necesarios sobre ese contenido y otorga a Andanzas GO una licencia **no exclusiva, gratuita y mundial** para usar, mostrar, reproducir y distribuir dicho contenido en relación con el servicio y su promoción. Usted conserva la titularidad de su contenido y puede eliminarlo; podremos retirarlo si incumple estos Términos.

## 6. Propiedad intelectual de Andanzas GO

Los textos de las fichas, las rutas, las entradas de "Pa' que sepás", las insignias, la marca "Andanzas GO", los logos y el diseño de la App son propiedad de Andanzas Centro Cultural o de sus autores y están protegidos por la ley. Usted no puede copiarlos, reproducirlos ni explotarlos sin autorización escrita.

## 7. Gamificación

Los puntos, niveles, insignias y "pasaportes" son elementos lúdicos **sin valor monetario**, no son canjeables por dinero ni transferibles, y no constituyen un derecho adquirido. Podemos ajustar, reiniciar o modificar el sistema de gamificación para mejorar la experiencia.

## 8. Exactitud de la información

La App se ofrece **"tal cual"**. La información sobre sitios, horarios, tarifas, rutas y mapas puede cambiar o contener errores; le recomendamos verificarla antes de desplazarse. No garantizamos que esté siempre exacta, completa o disponible sin interrupciones.

## 9. Seguridad durante los recorridos

Andanzas GO ofrece información y sugerencias para disfrutar la ciudad, pero **usted recorre bajo su propia responsabilidad**. Cada persona es responsable de su seguridad, de su condición física para caminar o desplazarse, del cuidado de sus pertenencias y del cumplimiento de las normas locales. Las recomendaciones de la App (mejores horas, transporte, etc.) son generales y orientativas. **No nos hacemos responsables** de incidentes, accidentes, pérdidas o daños ocurridos durante los recorridos.

## 10. Servicios pagos (a futuro)

Actualmente la App es de uso gratuito. Si en el futuro se ofrecen funciones o experiencias pagas (por ejemplo, rutas guiadas o servicios de aliados), estas se regirán por **términos adicionales** —incluidas condiciones de pago, cancelación y reembolso— que se pondrán a su disposición antes de cualquier cobro.

## 11. Limitación de responsabilidad

En la máxima medida permitida por la ley, Andanzas GO no será responsable por daños indirectos, incidentales o consecuenciales derivados del uso o la imposibilidad de uso de la App, ni por la conducta de terceros (otros usuarios, aliados o proveedores).

## 12. Suspensión y terminación

Podemos suspender o cancelar su acceso si incumple estos Términos. Usted puede dejar de usar la App y eliminar su cuenta en cualquier momento desde "Gestión de Cuenta".

## 13. Modificaciones

Podemos modificar estos Términos. Le notificaremos los cambios significativos a través de la App; el uso continuado implica la aceptación de la versión vigente.

## 14. Ley aplicable y jurisdicción

Estos Términos se rigen por las **leyes de la República de Colombia**. Cualquier controversia se someterá a los jueces y tribunales competentes de **Santiago de Cali (Valle del Cauca)**, sin perjuicio de los derechos que la ley reconozca a los consumidores.

## 15. Contacto

Dudas o solicitudes: **andanzascentrocultural@gmail.com** o la sección "Soporte" de la App.$legal$, 'es', 'published', timezone('utc'::text, now()), timezone('utc'::text, now()), true, true
WHERE NOT EXISTS (SELECT 1 FROM public.legal_documents WHERE document_type='terms_of_service' AND version='2.0');

-- privacy_policy v2.0  (md5 d50552d8d5f5d7952dc83c2a78981fab)
INSERT INTO public.legal_documents
  (document_type, title, version, content_markdown, language, status, effective_date, published_at, requires_acceptance, requires_reacceptance)
SELECT 'privacy_policy', 'Política de Privacidad y Tratamiento de Datos Personales — Andanzas GO', '2.0', $legal$# Política de Privacidad y Tratamiento de Datos Personales — Andanzas GO

## 1. Introducción y responsable del tratamiento

Bienvenido a Andanzas GO ("la Plataforma", "la App"). Su privacidad y la seguridad de sus datos son nuestra prioridad. Esta Política explica de forma clara y transparente cómo recopilamos, usamos, almacenamos, transferimos y protegemos su información personal, en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas colombianas de protección de datos (Habeas Data).

**Responsable del tratamiento:** Andanzas GO es un proyecto de **Andanzas Centro Cultural**, operado por **[Nombre legal completo del responsable]**, quien actúa como persona natural responsable del tratamiento de los datos.
**Canal de contacto:** andanzascentrocultural@gmail.com (y la sección "Soporte" dentro de la App).
**Ubicación:** Santiago de Cali, Valle del Cauca, Colombia.

Al registrarse o utilizar la App, usted autoriza de manera libre, previa, expresa e informada el tratamiento de sus datos personales en los términos de esta Política.

## 2. Datos que recopilamos

- **Datos de identificación:** nombre, correo electrónico, avatar y credenciales de autenticación (gestionadas de forma segura por proveedores externos de autenticación).
- **Confirmación de edad:** al registrarse le solicitamos su fecha de nacimiento con el único fin de verificar que cumple la edad mínima de uso (14 años). Cuando es técnicamente posible, conservamos únicamente la confirmación de que supera ese umbral y no la fecha exacta, para recolectar el mínimo de datos necesario.
- **Datos de geolocalización:** su ubicación precisa en tiempo real, para habilitar la navegación, las recomendaciones cercanas y la validación de retos por proximidad (check-in).
- **Datos de uso y actividad:** insignias ganadas, rutas iniciadas y completadas, check-ins validados, sitios favoritos, reseñas, estilo de viaje, ciudad de origen y ciudades recorridas, y necesidades de accesibilidad configuradas en su perfil.
- **Contenido que usted publica:** reseñas, calificaciones y fotografías.
- **Datos técnicos:** dirección IP, tipo de dispositivo, sistema operativo e identificadores del dispositivo, con fines de seguridad y mejora del servicio.

## 3. Finalidad del tratamiento

- **Prestar el servicio:** mostrar mapas, sitios, rutas y contenido cultural, y permitir la navegación.
- **Gamificación:** gestionar su progreso, puntos, niveles, insignias y su "pasaporte" de rutas y ciudades. Para ello, **sí registramos, asociadas a su cuenta, las rutas que completa y los check-ins que valida** (es decir, parte de su actividad de recorrido queda vinculada a su perfil mientras su cuenta esté activa).
- **Personalización:** adaptar recomendaciones según sus intereses, estilo de viaje y necesidades de accesibilidad.
- **Mejora continua:** analizar tendencias de uso de forma **agregada y anónima** para optimizar la App.
- **Seguridad:** detectar y prevenir fraudes, abusos e incidentes.
- **Comunicaciones:** enviarle notificaciones propias del servicio (por ejemplo, el dato diario de "Pa' que sepás" o el estado de una ruta). Usted puede desactivarlas desde la configuración.

## 4. Tratamiento de datos de menores de edad

La **edad mínima para tener una cuenta en Andanzas GO es de 14 años.** La App no está dirigida a menores de 14 años y no permitimos su registro.

- **Menores de 14 años:** no pueden crear cuenta ni usar la App. Si detectamos una cuenta perteneciente a un menor de 14 años, la suprimiremos junto con sus datos. Si usted es padre, madre o acudiente y advierte que un menor a su cargo se registró, escríbanos y procederemos a eliminarla.
- **Usuarios entre 14 y 17 años:** al registrarse, declaran contar con el conocimiento y la autorización de sus padres o representantes legales, quienes son responsables de supervisar dicho uso. La ley colombiana otorga protección reforzada a los datos de niñas, niños y adolescentes; los tratamos con especial cuidado y recolectando el mínimo necesario.
- **Mayores de 18 años:** uso pleno.

Para verificar la edad solicitamos la fecha de nacimiento al momento del registro. Se trata de una **declaración de buena fe**: no exigimos documentos de identidad, por lo que esta barrera busca impedir el registro de menores de 14 años, no verificar la identidad de cada usuario. La responsabilidad por datos de edad falsos recae en quien los suministra o en sus representantes legales.

## 5. Protección, almacenamiento y retención

Aplicamos medidas técnicas, administrativas y físicas razonables para proteger su información:

- **Cifrado en tránsito:** los datos se transmiten mediante protocolos seguros (HTTPS/TLS).
- **Base de datos segura:** usamos infraestructura de nube (Supabase/PostgreSQL) con controles de acceso estrictos (Row Level Security).
- **Retención:** conservamos sus datos personales mientras su cuenta esté activa o mientras sea necesario para cumplir obligaciones legales. Si usted elimina su cuenta, sus datos personales identificables serán eliminados o anonimizados de forma irreversible, salvo aquello que la ley obligue a conservar.

Ninguna medida de seguridad es infalible; en caso de un incidente que afecte sus datos, actuaremos conforme a la ley y le informaremos cuando corresponda.

## 6. Transferencia y transmisión internacional de datos

Para operar, la App se apoya en proveedores de tecnología cuya infraestructura puede estar **ubicada fuera de Colombia** (por ejemplo, Supabase para base de datos y autenticación, y Google Maps para mapas). Esto implica que sus datos pueden ser almacenados o procesados en servidores en el exterior. Al usar la App, usted **autoriza esta transferencia y transmisión internacional**, entendiendo que dichos proveedores actúan bajo estándares de seguridad y solo tratan los datos conforme a nuestras instrucciones y a la finalidad aquí descrita.

## 7. Compartir información con terceros

**No vendemos ni comercializamos sus datos personales.** Solo compartimos información en estos casos:

- **Proveedores de servicios:** mapas (Google Maps), autenticación y alojamiento en la nube, que actúan bajo nuestras instrucciones.
- **Requerimiento legal:** cuando lo soliciten autoridades competentes conforme a la ley.
- **Aliados (a futuro):** si en el futuro se ofrecen rutas o experiencias en colaboración con aliados, cualquier dato que llegue a compartirse será únicamente **agregado y anónimo** (por ejemplo, cuántas personas completaron una ruta), nunca su información personal identificable, salvo que usted lo autorice expresamente.

## 8. Sus derechos (Habeas Data)

Como titular, usted puede: **conocer, actualizar y rectificar** sus datos; solicitar prueba de la autorización; ser informado del uso dado a sus datos; presentar quejas ante la Superintendencia de Industria y Comercio (SIC); **revocar** la autorización y **solicitar la supresión** ("derecho al olvido") cuando proceda; y acceder gratuitamente a sus datos.

**Cómo ejercerlos:**
- Acceso y rectificación: desde la configuración de su perfil, en cualquier momento.
- Supresión de la cuenta: desde la sección "Gestión de Cuenta".
- Oposición a la geolocalización: revocando el permiso en su dispositivo (esto limitará funciones como la navegación y los check-ins).
- Otras solicitudes: escribiendo a andanzascentrocultural@gmail.com.

**Tiempos de respuesta:** procuramos responder en **3 a 5 días hábiles**. En todo caso, respetamos los plazos máximos de ley: **consultas**, hasta diez (10) días hábiles; **reclamos**, hasta quince (15) días hábiles, prorrogables en los términos legales.

## 9. Cookies y almacenamiento local

Usamos almacenamiento local y cookies técnicas estrictamente necesarias para mantener su sesión activa y recordar sus preferencias (tema, idioma) y los datos que permiten el funcionamiento sin conexión. **No usamos cookies de rastreo publicitario de terceros.**

## 10. Cambios en esta política

Podemos actualizar esta Política para reflejar nuevas funciones o cambios legales. Le informaremos de cambios significativos a través de la App. El uso continuado tras la notificación implica la aceptación de la versión vigente.

## 11. Contacto

Para ejercer sus derechos o resolver dudas: **andanzascentrocultural@gmail.com** o la sección "Soporte" de la App.$legal$, 'es', 'published', timezone('utc'::text, now()), timezone('utc'::text, now()), true, true
WHERE NOT EXISTS (SELECT 1 FROM public.legal_documents WHERE document_type='privacy_policy' AND version='2.0');

