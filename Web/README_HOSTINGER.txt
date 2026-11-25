DRUMMOTION — PÁGINA WEB

Esta carpeta contiene una web estática con estética oscura/morada, cámara, detector de pose MediaPipe, batería interactiva, registro de golpes y sonidos sintetizados con Web Audio (no necesita WAV).

IMPORTANTE SOBRE EL RECONOCIMIENTO
- La versión actual de assets/js/gesture.js usa reglas geométricas provisionales. No es todavía el clasificador LSTM entrenado en Colab.
- Clases previstas del proyecto: Crash, Ride, Tom, Hit_Tom y Neutral.
- Los sonidos manuales funcionan sin el modelo entrenado. El reconocimiento automático puede confundir gestos; para usar el LSTM hay que exportarlo a TensorFlow.js y conectar el preprocesamiento idéntico al entrenamiento.

PROBAR EN TU PC
1. Descomprime el paquete.
2. Abre una terminal dentro de la carpeta web.
3. Ejecuta: py -m http.server 8000
4. Abre http://localhost:8000 en Chrome o Edge.
5. Pulsa Activar cámara y permite el acceso. Prueba los instrumentos con clic o teclas 1-4.
No abras index.html con doble clic; la cámara requiere localhost o HTTPS.

SUBIR A HOSTINGER
1. Abre hPanel > Administrador de archivos > public_html.
2. Sube el CONTENIDO de esta carpeta web (index.html, assets/, models/, sounds/).
3. Activa HTTPS/SSL en el dominio.
4. Abre tu dominio y permite la cámara.

SONIDOS
Los sonidos Crash, Ride, Tom y Hit Tom se sintetizan en assets/js/audio.js usando Web Audio. El navegador suele requerir un primer clic del usuario para habilitar audio. Teclas: 1 Crash, 2 Ride, 3 Tom, 4 Hit Tom.

GESTOS
- Crash: brazo derecho extendido diagonal arriba/derecha.
- Ride: brazo izquierdo extendido diagonal arriba/izquierda.
- Tom: mano derecha hacia delante/zona media.
- Hit Tom: mano izquierda cerca del abdomen.
- Neutral: postura de reposo entre golpes.

MODELO ENTRENADO
Cuando exportes la LSTM desde Colab a TensorFlow.js, copia model.json y TODOS los archivos de pesos a la carpeta de destino que indique la integración del clasificador. El detector de pose MediaPipe no es el clasificador LSTM. No copies un archivo .keras directamente a la web.
