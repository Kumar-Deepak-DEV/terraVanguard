import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import UserLayout from '../layouts/UserLayout';
import Dashboard from '../pages/Dashboard';
import Ideas from '../pages/Ideas';
import UserHallOfFame from '../pages/UserHallOfFame';
import Profile from '../pages/Profile';

const userRoutes = [
    {
        element: (
            <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/ideas', element: <Ideas /> },
            { path: '/dashboard/hall-of-fame', element: <UserHallOfFame /> },
        ],
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Profile />
            </ProtectedRoute>
        ),
    },
];

export default userRoutes;
