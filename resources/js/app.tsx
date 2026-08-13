import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.{jsx,tsx}', { eager: true });
        const page = pages[`./pages/${name}.jsx`] || pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page as { default: React.ComponentType };
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});