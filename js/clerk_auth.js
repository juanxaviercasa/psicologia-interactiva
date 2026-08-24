// ==========================================
// CLERK AUTHENTICATION ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Escuchamos el evento de carga del script de Clerk
    window.addEventListener("load", async function () {
        
        const clerk = window.Clerk;
        
        if (!clerk) {
            console.error("Clerk no se cargó correctamente. Revisa la Publishable Key o la conexión a internet.");
            return;
        }

        try {
            await clerk.load({
                appearance: {
                    baseTheme: 'dark', // Clerk soporta temas oscuros
                    variables: {
                        colorPrimary: '#06b6d4', // cyan-500
                        colorBackground: '#0B1120',
                        colorText: '#e2e8f0',
                    }
                }
            });

            const loadingScreen = document.getElementById('clerk-loading-screen');
            const authScreen = document.getElementById('clerk-auth-screen');
            const appContent = document.getElementById('app-main-content');
            
            // Ocultar pantalla de carga inicial
            if (loadingScreen) loadingScreen.style.display = 'none';

            if (!clerk.user) {
                // Usuario NO autenticado -> Mostrar UI de Login
                console.log("Usuario no autenticado. Mostrando Login...");
                if (authScreen) authScreen.classList.remove('hidden');
                
                const signInDiv = document.getElementById("clerk-sign-in-box");
                if (signInDiv) {
                    clerk.mountSignIn(signInDiv, {
                        routing: 'virtual'
                    });
                }
            } else {
                // Usuario AUTENTICADO -> Mostrar App
                console.log("Usuario autenticado:", clerk.user.primaryEmailAddress?.emailAddress);
                
                if (authScreen) authScreen.classList.add('hidden');
                if (appContent) {
                    appContent.classList.remove('hidden');
                    // Reiniciar animaciones o lógica de la app si es necesario
                }

                // Montar el UserButton en el header
                const userButtonDiv = document.getElementById("clerk-user-button");
                if (userButtonDiv) {
                    clerk.mountUserButton(userButtonDiv);
                }
            }

        } catch (err) {
            console.error("Error inicializando Clerk:", err);
            const loadingText = document.getElementById('clerk-loading-text');
            if (loadingText) loadingText.innerText = "Error de conexión con el servidor de autenticación.";
        }
    });
});
