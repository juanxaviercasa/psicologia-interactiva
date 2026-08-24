// ==========================================
// CLERK AUTHENTICATION ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Escuchamos el evento de carga del script de Clerk
    window.addEventListener("load", async function () {
        
        const clerk = window.Clerk;
        const loadingScreen = document.getElementById('clerk-loading-screen');
        const authScreen = document.getElementById('clerk-auth-screen');
        const appContent = document.getElementById('app-main-content');
        
        // MODO PÚBLICO TEMPORAL (Bypass)
        // Si no hay clerk, o si la llave es el placeholder, mostramos la app directamente.
        const clerkScript = document.querySelector('script[data-clerk-publishable-key]');
        const isPlaceholder = clerkScript && clerkScript.getAttribute('data-clerk-publishable-key').includes('PLACEHOLDER');

        if (!clerk || isPlaceholder) {
            console.warn("Clerk Auth: Modo Desarrollo/Público activo (Publishable Key no configurada). Omitiendo login.");
            if (loadingScreen) loadingScreen.style.display = 'none';
            if (authScreen) authScreen.classList.add('hidden');
            if (appContent) appContent.classList.remove('hidden');
            return;
        }

        try {
            await clerk.load({
                appearance: {
                    baseTheme: 'dark',
                    variables: {
                        colorPrimary: '#06b6d4',
                        colorBackground: '#0B1120',
                        colorText: '#e2e8f0',
                    }
                }
            });
            
            if (loadingScreen) loadingScreen.style.display = 'none';

            if (!clerk.user) {
                // Usuario NO autenticado -> Mostrar UI de Login
                console.log("Usuario no autenticado. Mostrando Login...");
                if (authScreen) authScreen.classList.remove('hidden');
                
                const signInDiv = document.getElementById("clerk-sign-in-box");
                if (signInDiv) {
                    clerk.mountSignIn(signInDiv, { routing: 'virtual' });
                }
            } else {
                // Usuario AUTENTICADO -> Mostrar App
                console.log("Usuario autenticado:", clerk.user.primaryEmailAddress?.emailAddress);
                
                if (authScreen) authScreen.classList.add('hidden');
                if (appContent) appContent.classList.remove('hidden');

                // Montar el UserButton
                const userButtonDiv = document.getElementById("clerk-user-button");
                if (userButtonDiv) {
                    clerk.mountUserButton(userButtonDiv);
                }
            }

        } catch (err) {
            console.error("Error inicializando Clerk:", err);
            // Fallback en caso de error de red: mostrar la app para no bloquear al usuario (opcional)
            if (loadingScreen) loadingScreen.style.display = 'none';
            if (authScreen) authScreen.classList.add('hidden');
            if (appContent) appContent.classList.remove('hidden');
        }
    });
});
