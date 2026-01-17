<?php
// Configurações do Firebase (para uso futuro)
$firebaseConfig = array(
    'apiKey' => "AIzaSyBFarkcZ4W8lk-GybNyk4Fp4RMMl7cz6Gc",
    'authDomain' => "silvaportfolio-6766a.firebaseapp.com",
    'databaseURL' => "https://silvaportfolio-6766a-default-rtdb.firebaseio.com",
    'projectId' => "silvaportfolio-6766a",
    'storageBucket' => "silvaportfolio-6766a.firebasestorage.app",
    'messagingSenderId' => "166925374205",
    'appId' => "1:166925374205:web:973f9cbf9dced650b16494",
    'measurementId' => "G-3HKSFRFVET"
);

// Função para inicializar Firebase (para versão futura com JavaScript)
function getFirebaseConfig() {
    global $firebaseConfig;
    return json_encode($firebaseConfig);
}
?>
