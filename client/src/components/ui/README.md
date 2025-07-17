# ListBud Design System

A comprehensive UI component library for the ListBud application.

## Components

### Core Components

#### Button
```tsx
<Button variant="primary" size="md" leftIcon={Plus}>
  Add Place
</Button>
```
- **Variants**: `primary`, `secondary`, `ghost`, `danger`, `outline`
- **Sizes**: `xs`, `sm`, `md`, `lg`
- **Props**: `leftIcon`, `rightIcon`, `loading`, `fullWidth`

#### Input
```tsx
<Input
  label="Place Name"
  placeholder="Enter place name"
  leftIcon={MapPin}
  helperText="The name of the place"
/>
```
- **Variants**: `default`, `search`, `inline`
- **Props**: `label`, `error`, `helperText`, `leftIcon`, `rightIcon`

#### Card
```tsx
<Card variant="elevated" padding="lg" hover clickable>
  {children}
</Card>
```
- **Variants**: `default`, `elevated`, `outlined`, `filled`
- **Padding**: `none`, `sm`, `md`, `lg`
- **States**: `hover`, `clickable`

### New Components

#### Dropdown
```tsx
<Dropdown
  items={items}
  selectedIds={selectedIds}
  onSelect={handleSelect}
  multiSelect={true}
  searchable={true}
  trigger={<Button>Select</Button>}
/>
```
- **Features**: Multi-select, search, icons, colors
- **Props**: `items`, `selectedIds`, `onSelect`, `onMultiSelect`, `trigger`

#### Badge
```tsx
<Badge color="#3b82f6" size="sm" onRemove={handleRemove}>
  Category Name
</Badge>
```
- **Variants**: `default`, `primary`, `secondary`, `success`, `warning`, `danger`
- **Sizes**: `sm`, `md`, `lg`
- **Props**: `color`, `onRemove`

#### Modal
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Add Place" size="lg">
  {children}
</Modal>
```
- **Sizes**: `sm`, `md`, `lg`, `xl`
- **Features**: Backdrop blur, escape key, focus management
- **Props**: `isOpen`, `onClose`, `title`, `size`

#### Toast
```tsx
const { showSuccess, showError } = useToasts();
showSuccess('Place added successfully!');
```
- **Types**: `success`, `error`, `warning`, `info`
- **Features**: Auto-dismiss, actions, animations
- **Hook**: `useToasts()` for management

#### Loading
```tsx
<Loading message="Loading places..." />
<LoadingSpinner size="lg" />
```
- **Components**: `Loading`, `LoadingSpinner`
- **Sizes**: `sm`, `md`, `lg`

## Design Tokens

### Colors
- **Primary**: Blue scale (`--color-primary-50` to `--color-primary-900`)
- **Neutral**: Gray scale (`--color-neutral-0` to `--color-neutral-900`)
- **Semantic**: Success, warning, error, info

### Spacing
- **Scale**: 8px grid system (`--space-1` to `--space-32`)
- **Usage**: Consistent spacing throughout components

### Typography
- **Sizes**: `--font-size-xs` to `--font-size-5xl`
- **Weights**: `--font-weight-light` to `--font-weight-extrabold`
- **Line Heights**: `--line-height-tight` to `--line-height-loose`

### Shadows
- **Scale**: `--shadow-sm` to `--shadow-2xl`
- **Usage**: Elevation and depth

## Usage Guidelines

### Component Composition
```tsx
import { Card, Button, Stack, Badge } from './ui';

<Card variant="elevated" padding="md">
  <Stack spacing="sm">
    <h3>Place Name</h3>
    <Badge color="#3b82f6">Category</Badge>
    <Button variant="primary">View Details</Button>
  </Stack>
</Card>
```

### Theme Integration
All components use CSS custom properties for theming:
```css
:root {
  --color-primary-500: #0ea5e9;
  --space-4: 1rem;
  --radius-lg: 0.5rem;
}
```

### Accessibility
- All components support keyboard navigation
- Proper ARIA labels and roles
- High contrast mode compatibility
- Screen reader support

## Best Practices

1. **Use design tokens** instead of hardcoded values
2. **Compose components** for consistent layouts
3. **Follow accessibility guidelines** for inclusive design
4. **Test interactions** across devices and input methods
5. **Maintain consistency** with existing patterns

## Development

### Adding New Components
1. Create component in `/client/src/components/ui/`
2. Export from `/client/src/components/ui/index.ts`
3. Follow established patterns and prop conventions
4. Include TypeScript types and JSDoc comments
5. Test accessibility and responsiveness

### Extending Components
All components accept `className` and standard HTML props for customization while maintaining design system consistency.
