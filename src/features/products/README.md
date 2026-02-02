# Products Feature - eCommerce CMS

Implementación completa del módulo de gestión de productos para el CMS de eCommerce.

## Estructura del Feature

```
products/
├── components/
│   ├── ImageUploader.tsx      # Gestión de imágenes del producto
│   ├── ProductFilters.tsx     # Filtros avanzados de productos
│   └── ProductForm.tsx         # Formulario de creación/edición
├── hooks/
│   ├── useCategories.ts        # Hook para obtener categorías
│   ├── useProductMutations.ts  # Mutations (create, update, delete)
│   └── useProducts.ts          # Queries (list, get)
├── pages/
│   ├── ProductCreatePage.tsx   # Página de creación
│   ├── ProductEditPage.tsx     # Página de edición
│   └── ProductsPage.tsx        # Listado principal
├── services/
│   └── product.service.ts      # API service layer
├── types/
│   └── product.types.ts        # TypeScript interfaces
├── utils/
│   └── productValidation.ts    # Zod schemas y validaciones
└── index.ts                    # Exportaciones centralizadas

```

## Componentes Principales

### ImageUploader
- Subida múltiple de imágenes (drag & drop)
- Preview de imágenes existentes
- Eliminación de imágenes
- Integración con API `/admin/products/{id}/images`

### ProductForm
- Formulario completo con react-hook-form + Zod
- Validación client-side y server-side
- Auto-generación de slug desde el nombre
- Integración con ImageUploader
- Campos soportados:
  - Información básica (nombre, slug, descripción)
  - Precios (regular, oferta, comparación, costo)
  - Inventario (SKU, stock, umbral de stock bajo)
  - Organización (categoría, destacado, activo)

### ProductFilters
- Búsqueda por nombre/SKU
- Filtro por categoría
- Filtro por estado (activo/inactivo)
- Filtro por stock (todos, en stock, bajo, sin stock)
- Botón "Limpiar filtros"

## Páginas

### ProductsPage
- Listado paginado de productos
- Tabla con columnas: Producto, Categoría, Precio, Stock, Estado, Acciones
- Botones de Editar y Eliminar por producto
- Modal de confirmación para eliminación
- Integración con filtros avanzados
- Botón "Crear Producto"

### ProductCreatePage
- Formulario de creación
- Redirección automática después de crear
- Toast notifications

### ProductEditPage
- Carga de datos existentes
- Actualización parcial soportada
- Loading states con Skeleton
- Error handling

## Hooks Personalizados

### useProducts
```typescript
const { data, isLoading } = useProducts(filters)
```

### useProduct
```typescript
const { data: product, isLoading } = useProduct(productId)
```

### useCreateProduct
```typescript
const createProduct = useCreateProduct()
await createProduct.mutateAsync(productData)
```

### useUpdateProduct
```typescript
const updateProduct = useUpdateProduct()
await updateProduct.mutateAsync({ id, data })
```

### useDeleteProduct
```typescript
const deleteProduct = useDeleteProduct()
await deleteProduct.mutateAsync(productId)
```

### useCategories
```typescript
const { data: categories } = useCategories()
```

## Validación con Zod

### createProductSchema
Schema completo para crear productos con validaciones:
- Precios: sale_price < price
- Costos: cost_price < price
- Stock: >= 0
- Nombres y descripciones con longitud mínima/máxima

### Helpers
- `generateSlug(name)`: Genera slug URL-friendly
- `isLowStock(stock, threshold)`: Verifica stock bajo
- `isOutOfStock(stock)`: Verifica sin stock

## Rutas

```typescript
/products              → ProductsPage (listado)
/products/create       → ProductCreatePage
/products/edit/:id     → ProductEditPage
```

## API Endpoints Utilizados

```
GET    /admin/products              - Listar productos (con filtros)
GET    /admin/products/:id          - Obtener producto
POST   /admin/products              - Crear producto
PUT    /admin/products/:id          - Actualizar producto
DELETE /admin/products/:id          - Eliminar producto
POST   /admin/products/:id/images   - Subir imagen
DELETE /admin/products/:id/images/:imageId - Eliminar imagen
GET    /admin/categories            - Listar categorías
```

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada componente tiene una única responsabilidad claramente definida
- ImageUploader: solo gestiona imágenes
- ProductForm: solo UI del formulario
- ProductFilters: solo UI de filtros
- Hooks: cada uno maneja un aspecto específico de datos

### Open/Closed Principle (OCP)
- Componentes extensibles mediante props sin modificar código interno
- Filtros se pueden agregar sin cambiar ProductFilters internamente

### Liskov Substitution Principle (LSP)
- Todas las interfaces TypeScript son intercambiables
- Product y ProductFormData respetan contratos

### Interface Segregation Principle (ISP)
- Props interfaces mínimas y focalizadas
- No se fuerzan dependencias innecesarias

### Dependency Inversion Principle (DIP)
- Componentes dependen de abstracciones (hooks) no implementaciones
- API calls encapsulados en service layer
- Validaciones separadas en utils

## Características Destacadas

1. **Type Safety**: TypeScript completo con validación Zod
2. **Responsive**: Mobile-first design con Tailwind CSS
3. **Accessible**: ARIA labels y keyboard navigation
4. **Performance**: React Query con caching inteligente
5. **UX**: Loading states, error handling, toast notifications
6. **Clean Code**: Documentación inline, naming conventions, DRY

## Diseño Visual

- Color scheme: Sage/Gold/Black
- Componentes UI reutilizables del design system
- Animaciones suaves y transiciones
- Estados hover/focus visibles
- Feedback visual inmediato

## Notas de Implementación

- Imágenes se suben DESPUÉS de crear el producto (productId requerido)
- Slug se genera automáticamente pero es editable
- Stock puede ser 0 (válido)
- Categoría es opcional
- Todos los precios son opcionales excepto el precio regular
