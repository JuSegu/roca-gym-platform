# ROCA GYM — Guía del Cliente 🏋️

**Bienvenido a tu plataforma digital.**
Este documento explica todo lo que tu aplicación web hace y cómo usarla, sin tecnicismos.

---

## ¿Qué es ROCA GYM Platform?

Es una **aplicación web completa para administrar tu gimnasio**, que tus clientes pueden abrir desde el celular o computador sin descargar nada.

Incluye:
- 🌐 **Página web pública** para atraer nuevos clientes
- 👤 **Portal de miembros** para los inscritos
- 🛒 **Tienda online** de suplementos y ropa
- 🏋️ **Sistema de entrenamiento** guiado con fases
- ⚙️ **Panel de Administración** para el dueño del gym

---

## 📱 ¿Cómo la abren tus clientes?

**Desde cualquier celular o computador:**
1. Abrir el navegador (Chrome, Safari, Firefox)
2. Ir a tu URL de Vercel: `https://roca-gym-platform.vercel.app`
3. ¡Listo! No necesitan descargar ninguna app.

**Para instalarla como app en el iPhone (gratis, sin App Store):**
1. Abrir Safari en el iPhone
2. Ir a la URL del gym
3. Tocar el ícono de compartir (□↑)
4. Seleccionar **"Añadir a pantalla de inicio"**
5. El ícono de ROCA GYM aparece en el iPhone como si fuera una app nativa

---

## 🖥️ Secciones de la Página Web

### 1. Hero — Recorrido Virtual del Gym
Al entrar, el cliente ve un **slideshow cinematográfico** del gym con:
- Fotos de las zonas: pesos libres, máquinas, cardio, ambiente
- Horarios de atención visibles de inmediato
- Botón para ver los planes y la ubicación

### 2. Nosotros
Historia y misión de ROCA GYM. Genera confianza con clientes nuevos.

### 3. Instalaciones
**Tarjetas interactivas** de cada zona del gym con fotos que cambian solas. El cliente puede pasar las fotos tocando las flechas o esperando.

### 4. Planes y Precios
Los planes con sus precios en COP:
- Plan Mensual
- Plan 3 Meses
- Plan 4 Meses (promo 8 meses)
- Plan Anual

### 5. Horarios & Sede
- Mapa visual de la ubicación
- Botones directos a **Google Maps** y **Waze**
- Horarios completos de Lunes a Domingo
- Cómo llegar (bus, metro, carro)

### 6. Tienda Oficial
Los clientes pueden comprar suplementos y ropa directamente desde la web:
- Proteína Whey Isolate
- Creatina Monohidratada
- Pre-Workout
- Camiseta ROCA BEAST
- Cinturón de Cuero
- Shaker + Straps

**Métodos de pago aceptados:**
- 💳 Nequi / Daviplata
- 🏦 PSE / Bancolombia
- 💰 Efectivo o datáfono en recepción
- 💳 Tarjeta de Crédito / Débito

Los miembros activos reciben **5% de descuento automático** en todos los productos.

---

## 👤 Portal del Miembro (Después de Iniciar Sesión)

Cuando un cliente se registra o inicia sesión, accede a su **dashboard personal**:

### Mi Perfil
- Nombre, email, plan activo
- Estado de membresía (Al día / Pendiente / Inactivo)
- **QR personal** para hacer check-in en recepción
- Días restantes de membresía

### Mis Entrenamientos — Symmetry Pro 🔥
El sistema más avanzado de la plataforma. Al iniciar una sesión de entrenamiento:

**Fase 1 — Calentamiento (8-10 min)**
- Temporizador de cuenta regresiva
- Mapa de músculos a trabajar
- Ejercicios de movilidad articular guiados

**Fase 2 — Series de Fuerza**
- Registro de peso (kg) y repeticiones por serie
- Temporizador de descanso entre series
- ¡Detección automática de Récord Personal (PR)! 🏆

**Fase 3 — Cardio Finisher**
- Recomendación de máquina específica de ROCA GYM
- Caminadora inclinada 12% a 5.0 km/h
- Estimado de calorías extra quemadas

**Fase 4 — Evaluación Symmetry AI**
- Puntuación de Simetría: 0–100
- Rango: Titán Simétrico 🔥 / Diamante / Platino
- Recompensa de XP (puntos de experiencia)

### Mis Compras
Historial de pedidos con código de recogida en recepción.

---

## 🛒 Compra sin Registro (Clientes Invitados)

Si alguien quiere comprar sin registrarse, solo necesita:
1. Seleccionar productos en la tienda
2. Al hacer checkout, ingresar su **nombre** y **número de WhatsApp**
3. Elegir método de pago
4. Recibir un **código de recogida** (ej: `REC-205`)
5. Presentar el código en recepción

El administrador verá el nombre y teléfono del cliente en el panel de admin.

---

## ⚙️ Panel de Administración

**Acceso:** Iniciar sesión con `admin@rocagym.com`

### Qué puede hacer el Admin:
| Función | Descripción |
|---|---|
| **Ver todos los miembros** | Lista completa con estado, plan, XP |
| **Gestionar pedidos** | Marcar como entregado, ver nombre y teléfono del cliente |
| **Estadísticas** | Total de miembros, ingresos, asistencias |
| **Aforo en vivo** | Capacidad actual del gym en tiempo real |
| **Crear miembros** | Registrar nuevos clientes directamente desde el panel |

---

## 🎵 Radio del Gym (Automática)

Cuando alguien entra a la web, **la música empieza automáticamente**:
- Beats de gym phonk estilo beast mode
- Suena 3 minutos → pausa 3 minutos → vuelve a sonar (ciclo automático)
- El cliente puede cambiar el volumen, la canción o el tempo (BPM)
- Se puede apagar si el cliente no la quiere

---

## 🎬 Screensaver Cinematográfico

Si la web queda abierta sin uso por **10 minutos**, aparece automáticamente una pantalla completa al estilo cinematográfico con:
- Fotos del gym rotando en el fondo
- El logo **ROCA GYM** que se revela gradualmente (estilo película)
- Tagline de la sede
- Desaparece con cualquier toque o tecla

Perfecto para tablets o pantallas en recepción del gym.

---

## 🔐 Seguridad

- Contraseñas cifradas por Firebase (Google)
- Solo el administrador puede ver todos los datos
- Cada miembro solo ve su propia información
- Clientes con membresía vencida no pueden hacer check-in QR
- Compras de invitados requieren nombre + teléfono (sin compras anónimas)

---

## 📊 Resumen de lo que incluye la plataforma

| Funcionalidad | ¿Incluida? |
|---|---|
| Página web pública | ✅ |
| Tienda online con carrito | ✅ |
| Portal de miembros con login | ✅ |
| QR de acceso personalizado | ✅ |
| Sistema de entrenamiento Symmetry Pro | ✅ |
| Música automática de gym | ✅ |
| Panel de administración | ✅ |
| Diseño responsive móvil/desktop | ✅ |
| Instalable como app en iPhone | ✅ |
| Screensaver cinematográfico | ✅ |
| Soporte para pagos colombianos (Nequi, PSE) | ✅ |
| Descuento automático 5% para miembros | ✅ |

---

## 💬 Soporte

Para actualizaciones, nuevas funcionalidades o soporte técnico, contactar al desarrollador con acceso al repositorio en GitHub:

**Repositorio:** `https://github.com/JuSegu/roca-gym-platform`
**Deploy:** `https://roca-gym-platform.vercel.app`

---

*ROCA GYM Platform — Construido con ❤️ para transformar tu gym en una experiencia digital premium.*
