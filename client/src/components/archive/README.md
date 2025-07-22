# Archived Components

This folder contains components that have been moved to archive to clean up the codebase and make debugging easier.

## Components Archived

### Components
- **EnhancedCard.tsx** - Was imported in ModernDashboard but never actually used in the render

## Currently Active Components

### Main Dashboard (ModernDashboard.tsx uses):
- AppHeader
- ImportTakeout
- LayoutComponents (Grid, SkeletonCard)
- ui/Button

### Legacy Dashboard (Dashboard.tsx uses):
- Layout
- SearchBar
- PlaceCard
- FolderCard (shared with ModernDashboard logic)
- ImportTakeout (shared with ModernDashboard)
- CategoryManager
- FolderManager
- AddPlaceModal
- ui components (Button, Container, Stack, Skeleton)

### Redesign Components (Planned Improvements - RESTORED):
- **redesign/** folder - Modern redesigned components (Phase 2 complete, Phase 3 integration pending):
  - GlobalSearchCommand.tsx
  - ListCard.tsx
  - ListView.tsx
  - NewDashboard.tsx
  - NewListDialog.tsx
- **shadcn/** folder - Modern ShadCN UI components for the redesign:
  - badge.tsx
  - button.tsx
  - card.tsx
  - dialog.tsx
  - input.tsx
- **DashboardIntegration.tsx** - Integration page to connect redesign to main app

### Shared Components:
- FolderCard - Used by legacy Dashboard but also referenced in ModernDashboard logic
- ImportTakeout - Used by both dashboards

## Redesign Implementation Status

Based on REDESIGN_IMPLEMENTATION.md:

✅ **Phase 1: Setup and Foundation** - COMPLETE
- Tailwind CSS Setup
- Shadcn/ui Components
- Updated Types
- Utility Functions

✅ **Phase 2: Core Components** - COMPLETE
- NewDashboard - Main landing page with list grid
- ListCard - Individual list cards with actions
- ListView - Detailed view of a specific list
- GlobalSearchCommand - Cmd+K search functionality
- NewListDialog - Modal for creating new lists

❌ **Phase 3: Integration** - PENDING
- API Updates - Modify backend to support new data structure
- Component Integration - Replace old components with new ones
- Data Migration - Convert existing folders to lists
- Testing - Comprehensive testing of new functionality

## Next Steps

The redesign components are ready but need to be integrated! Consider:

1. **Complete Phase 3 Integration** - Replace current ModernDashboard with redesigned components
2. **Connect to existing API** - Wire up the new components to current backend
3. **Gradual rollout** - Use feature flags to switch between old/new interface
4. **Data migration** - Plan for converting existing data to new structure

## How to Restore

If you need any archived components back, simply move them from the archive folder back to their original location and update the imports.

## Notes

- The legacy Dashboard is accessible via `/legacy` route
- ModernDashboard is the main dashboard but could be replaced with NewDashboard from redesign
- FolderCard component was updated with decodeHtmlEntities to fix character encoding issues
- The redesign represents a complete UI overhaul with modern design patterns
