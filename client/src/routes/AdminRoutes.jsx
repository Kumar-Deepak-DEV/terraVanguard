import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminIdeas from '../pages/admin/AdminIdeas';
import AdminHallOfFame from '../pages/admin/AdminHallOfFame';
import Profile from '../pages/Profile';

const adminRoutes = [
    {
        path: '/admin',
        element: (
            <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/admin/users" replace /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'events', element: <AdminEvents /> },
            { path: 'ideas', element: <AdminIdeas /> },
            { path: 'hall-of-fame', element: <AdminHallOfFame /> },
            { path: 'profile', element: <Profile /> },
        ],
    },
];

export default adminRoutes;
