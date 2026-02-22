# 2026-02-22-users-api-integration-design.md

## Overview
Chuyển module Users admin từ dữ liệu mock sang API thực tế để kết nối với backend.

## Current State
- Sử dụng `userAPI` từ `@/lib/api` (mock data)
- Các hàm sync: getAll(), create(), update(), delete()
- Không có error handling từ API

## Target State
- Sử dụng `users` từ `@/lib/users` (axios API client)
- Các hàm async với promises
- Error handling từ API responses
- Loading states cho UX tốt hơn

## Implementation Details

### 1. Import Changes
```typescript
// Before
import { userAPI } from '@/lib/api';

// After  
import users from '@/lib/users';
```

### 2. Function Updates
- `loadUsers()`: Async call với error handling
- `handleDelete()`: Async remove với reload
- `handleSubmit()`: Async create/update với validation

### 3. State Management
- Thêm `loading` state cho các operations
- Error states cho API failures

### 4. Error Handling
- Catch API errors và hiển thị toast messages
- Handle 401 unauthorized (logout)
- Network errors

## Benefits
- Real-time data từ backend
- Consistent với production environment  
- Proper error handling
- Scalable architecture

## Risks
- API downtime affects UI
- Need proper error boundaries
- Loading states required for UX

## Testing
- Test success cases
- Test error cases (401, 500, network)
- Test loading states