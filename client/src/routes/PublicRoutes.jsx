import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import Landing from '../pages/Landing';
import PublicHallOfFame from '../pages/PublicHallOfFame';
import PublicEvents from '../pages/PublicEvents';
import Login from '../pages/Login';
import AdminRegister from '../pages/AdminRegister';

const publicRoutes = [
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <Landing /> },
            { path: 'hall-of-fame', element: <PublicHallOfFame /> },
            { path: 'events', element: <PublicEvents /> },
        ],
    },
    { path: '/login', element: <Login /> },
    { path: '/admin-register', element: <AdminRegister /> },
];

export default publicRoutes;
