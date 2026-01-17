<?php
// Proteção contra acesso às ferramentas de desenvolvedor
// Esta é uma proteção básica em PHP - mais segurança será adicionada via JavaScript

// Detectar se estamos em ambiente de desenvolvimento (para evitar problemas durante o desenvolvimento)
$is_dev = isset($_SERVER['HTTP_HOST']) && 
          (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
           strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false);

// Se não for desenvolvimento, aplicar medidas de segurança
if (!$is_dev) {
    // Headers de segurança
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}
?>

<script>
// Proteção avançada contra DevTools (JavaScript)
(function() {
    'use strict';
    
    // Detectar abertura do DevTools
    var devtools = {
        isOpen: false,
        orientation: undefined
    };
    
    var threshold = 160;
    
    var emitEvent = function(isOpen, orientation) {
        window.dispatchEvent(new CustomEvent('devtoolschange', {
            detail: {
                isOpen: isOpen,
                orientation: orientation
            }
        }));
    };
    
    setInterval(function() {
        var widthThreshold = window.outerWidth - window.innerWidth > threshold;
        var heightThreshold = window.outerHeight - window.innerHeight > threshold;
        var orientation = widthThreshold ? 'vertical' : 'horizontal';
        
        if (!(heightThreshold && widthThreshold) &&
            ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
            
            if (!devtools.isOpen || devtools.orientation !== orientation) {
                emitEvent(true, orientation);
            }
            
            devtools.isOpen = true;
            devtools.orientation = orientation;
        } else {
            if (devtools.isOpen) {
                emitEvent(false, undefined);
            }
            
            devtools.isOpen = false;
            devtools.orientation = undefined;
        }
    }, 500);
    
    // Quando DevTools for detectado
    window.addEventListener('devtoolschange', function(e) {
        if (e.detail.isOpen) {
            // Tentar fechar a janela ou mostrar aviso
            try {
                // Tentar bloquear várias vezes
                document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#1a1a2e;color:white;display:flex;align-items:center;justify-content:center;z-index:999999;"><div style="text-align:center;padding:2rem;background:#e94560;border-radius:10px;"><h2>🚫 Acesso Negado</h2><p>Ferramentas de desenvolvedor não são permitidas</p><p>Esta página será fechada automaticamente</p></div></div>';
                
                // Tentar fechar a janela
                setTimeout(function() {
                    window.location.href = 'about:blank';
                    window.close();
                    
                    // Se não fechar, redirecionar
                    setTimeout(function() {
                        window.location.href = '/';
                    }, 1000);
                }, 3000);
            } catch(e) {
                console.error('Erro de segurança:', e);
            }
        }
    });
    
    // Detectar teclas de atalho
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
            (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault();
            e.stopPropagation();
            
            // Mostrar aviso
            alert('🚫 Acesso às ferramentas de desenvolvedor não é permitido neste site.');
            return false;
        }
    });
    
    // Desabilitar clique direito
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert('Menu de contexto desabilitado por segurança.');
        return false;
    });
    
    // Desabilitar seleção de texto (opcional)
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
})();
</script>
