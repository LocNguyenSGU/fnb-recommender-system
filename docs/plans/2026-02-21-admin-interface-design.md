# Admin Interface Design for F&B Recommender System

## Overview
Create a modern, clean admin interface for managing CRUD operations on 8 database models: users, categories, shops, menus, menu_items, reviews, blogs, and comments.

## Architecture
- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with modern design (clean whites, subtle shadows, blue accents)
- **Components**: shadcn/ui for consistent, accessible UI components
- **Data**: Mock in-memory data stores with CRUD APIs (replaceable with real API calls)
- **Navigation**: Sidebar layout with links to each model's management page
- **Authentication**: Basic route protection (assume admin is logged in)

## Pages Structure
```
/admin
├── page.tsx (dashboard with model links)
├── users/page.tsx
├── categories/page.tsx
├── shops/page.tsx
├── menus/page.tsx
├── menu-items/page.tsx
├── reviews/page.tsx
├── blogs/page.tsx
└── comments/page.tsx
```

## Components
- **AdminLayout**: Sidebar navigation + main content area
- **DataTable**: Sortable, filterable table with pagination
- **ModalForm**: Reusable form component for add/edit operations
- **Toast**: Success/error notifications

## Model Configurations

### Users
- Fields: username, full_name, email, phone, role (select: user/admin/owner), provider (select: local/google/facebook), avatar_url
- Table columns: ID, Username, Full Name, Email, Role, Created At
- Validations: Required username, email unique format

### Categories
- Fields: name, description
- Table columns: ID, Name, Description, Created At
- Validations: Required name

### Shops
- Fields: name, address, latitude, longitude, open_time, close_time, status (select: pending/approved/rejected), owner_id, category_id, images (JSON textarea)
- Table columns: ID, Name, Address, Status, Owner ID, Category ID, Created At
- Validations: Required name, valid lat/lng ranges

### Menus
- Fields: name, shop_id, images (JSON textarea)
- Table columns: ID, Name, Shop ID, Created At
- Validations: Required shop_id

### Menu Items
- Fields: name, description, price, is_available (checkbox), is_hot (checkbox), is_signature (checkbox), images (JSON textarea), menu_id
- Table columns: ID, Name, Price, Available, Hot, Signature, Menu ID, Created At
- Validations: Required name, price > 0

### Reviews
- Fields: rating (select 1-5), content, user_id, shop_id, replies (JSON textarea)
- Table columns: ID, Rating, Content, User ID, Shop ID, Created At
- Validations: Rating 1-5, required user_id, shop_id

### Blogs
- Fields: title, content, status (select: pending/published/draft), author_id, images (JSON textarea), likes_count
- Table columns: ID, Title, Status, Author ID, Likes, Created At
- Validations: Required title

### Comments
- Fields: content, blog_id, user_id, replies (JSON textarea)
- Table columns: ID, Content, Blog ID, User ID, Created At
- Validations: Required content, blog_id, user_id

## Data Flow
1. Page loads → Fetch all records via API.getAll()
2. User clicks Add → Open modal with empty form
3. User clicks Edit → Open modal pre-filled with record data
4. Form submit → Validate → API.create/update() → Refresh table → Show toast
5. User clicks Delete → Confirm dialog → API.delete() → Refresh table → Show toast

## Error Handling
- Form validation errors: Highlight fields, show messages
- API errors: Show toast with error message
- Network errors: Retry mechanism or offline indicator

## Testing
- Unit tests for API functions
- Integration tests for CRUD operations
- E2E tests for critical user flows

## Future Enhancements
- Real API integration
- Advanced search/filtering
- Bulk operations
- Export/import functionality
- Audit logging
- Role-based permissions