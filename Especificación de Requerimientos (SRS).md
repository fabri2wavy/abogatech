# **Documento de Especificación de Requerimientos (SRS)**

## **Proyecto: Abogatech (CRM Legal)**

### **1\. Introducción**

**1.1 Propósito** El propósito de este documento es definir los requerimientos para "Abogatech", un sistema CRM (Customer Relationship Management) especializado para el sector legal. El sistema está diseñado para optimizar la gestión de expedientes, el seguimiento de clientes y el control de plazos legales de la firma, centralizando la información y mejorando la eficiencia operativa.

**1.2 Alcance del Sistema** Abogatech gestionará el ciclo de vida completo de los casos legales, desde el registro inicial del cliente hasta el cierre del expediente. Incluye gestión documental, agenda de audiencias/plazos y control de estados de procesos legales.

**1.3 Pila Tecnológica (Stack)**

* **Frontend:** React con Next.js (Arquitectura basada en componentes).  
* **Enfoque de Desarrollo:** Separación estricta entre la capa de presentación (UI/UX) y la lógica de negocio/backend.

### **2\. Descripción General**

**2.1 Perfiles de Usuario (Roles)**

1. **Administrador/Socio:** Acceso total al sistema, reportes de rendimiento, gestión de usuarios y asignación de casos.  
2. **Abogado Titular:** Gestión de sus casos asignados, subida de documentos, actualización de hitos procesales y contacto con clientes.  
3. **Procurador/Pasante:** Permisos limitados para actualizar estados de trámites en juzgados y subir notificaciones.  
4. **Cliente (Portal de visualización):** Acceso de solo lectura para revisar el estado actual de su caso y descargar documentos compartidos.

### **3\. Requerimientos Funcionales (Core)**

**Módulo 1: Gestión de Clientes (Directorio)**

* **RF-1.1:** El sistema debe permitir el registro, edición y eliminación (CRUD) de perfiles de clientes (personas naturales y jurídicas).  
* **RF-1.2:** Cada perfil de cliente debe mostrar un historial de todos los casos/expedientes asociados a él.

**Módulo 2: Gestión de Expedientes (Casos)**

* **RF-2.1:** El sistema debe permitir la creación de un nuevo caso, asignándole un código único, materia legal (Penal, Civil, Laboral, etc.) y un abogado responsable.  
* **RF-2.2:** El caso debe tener estados dinámicos (Ej: En revisión, En litigio, Conciliación, Cerrado).  
* **RF-2.3:** Integración de una bitácora o "Timeline" donde los abogados y procuradores registren actualizaciones y avances del caso con fecha y hora.

**Módulo 3: Gestión Documental**

* **RF-3.1:** El sistema debe permitir subir, clasificar y descargar archivos (PDF, DOCX) dentro de cada expediente.  
* **RF-3.2:** Clasificación de documentos por tipo (Demandas, Memoriales, Pruebas, Sentencias).

**Módulo 4: Calendario y Plazos Legales**

* **RF-4.1:** El sistema debe contar con un calendario integrado para registrar audiencias, vencimientos de plazos y reuniones.  
* **RF-4.2:** Generación de alertas o notificaciones visuales en el dashboard cuando un plazo legal esté próximo a vencer (Ej: 48 horas antes).

### **4\. Requerimientos No Funcionales**

* **RNF-1 (UI/UX):** La interfaz debe ser moderna, limpia y estrictamente construida en React/Next.js. Debe aplicar diseño responsivo (Mobile First) para que los abogados puedan revisar casos desde sus teléfonos en el juzgado.  
* **RNF-2 (Seguridad):** Al tratar con datos legales sensibles, el sistema requiere autenticación robusta y control de acceso basado en roles (RBAC). Los documentos privados no deben ser accesibles sin el token correspondiente.  
* **RNF-3 (Rendimiento):** Las vistas principales (como el Dashboard de casos activos) deben renderizarse rápidamente, delegando la carga pesada al backend y aprovechando las capacidades de Next.js.

flowchart LR
  %% Actores
  Admin(["Administrador"])
  Abogado(["Abogado"])
  Cliente(["Cliente"])

  %% Limites del Sistema
  subgraph CRM ["Módulo de Expedientes (Abogatech)"]
    direction TB
    
    %% Casos de Uso - Admin
    UC1("Crear Expediente (Asignación a cualquier abogado)")
    UC2("Ver TODOS los expedientes de la firma")
    UC3("Reasignar / Eliminar Expedientes")
    
    %% Casos de Uso - Abogado
    UC4("Crear Expediente (Auto-asignación automática)")
    UC5("Ver ÚNICAMENTE mis expedientes asignados")
    UC6("Actualizar Bitácora y Subir Documentos")
    
    %% Casos de Uso - Cliente
    UC7("Ver Informe Público (Portal de Solo Lectura)")
    UC8("Descargar Documentos marcados como Públicos")
  end

  %% Relaciones Administrador
  Admin -.->|Control Global| UC1
  Admin -.-> UC2
  Admin -.-> UC3
  Admin -.-> UC6

  %% Relaciones Abogado
  Abogado ===>|Autonomía| UC4
  Abogado ===> UC5
  Abogado ===> UC6

  %% Relaciones Cliente
  Cliente --->|Acceso Restringido| UC7
  Cliente ---> UC8

  %% Estilos para que luzca Premium en GitHub
  classDef actor fill:#f9f9f9,stroke:#0A192F,stroke-width:2px,color:#000,font-weight:bold;
  classDef usecase fill:#F8F9FA,stroke:#D4AF37,stroke-width:2px,color:#0A192F,rx:20px,ry:20px;
  classDef system fill:#ffffff,stroke:#CBD5E1,stroke-width:1px,stroke-dasharray: 5 5;

  class Admin,Abogado,Cliente actor;
  class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8 usecase;
  class CRM system;

erDiagram
    PERFILES ||--o{ EXPEDIENTES : "gestiona"
    CLIENTES ||--o{ EXPEDIENTES : "posee"

    PERFILES {
        uuid id PK
        string nombre_completo
        string rol "admin, abogado, cliente"
        string email
    }

    CLIENTES {
        uuid id PK
        string nombre_completo
        string carnet_identidad
    }

    EXPEDIENTES {
        uuid id PK
        string numeroCaso
        string estado
        uuid cliente_id FK
        uuid abogado_id FK "El responsable del caso"
    } 