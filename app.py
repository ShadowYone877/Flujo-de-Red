from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/procesar', methods=['POST'])
def procesar():
    mensaje = request.json.get('mensaje', '')
    
    # Datos técnicos para cada capa (Simulación de protocolos de Facebook)
    capas_data = [
        {"n": 7, "nombre": "Aplicación", "info": f"Protocolo: HTTP/JSON. Data: {mensaje}"},
        {"n": 6, "nombre": "Presentación", "info": f"Cifrado SSL/TLS: {mensaje.encode().hex()[:15]}..."},
        {"n": 5, "nombre": "Sesión", "info": "ID de Sesión: FB-SECURE-98765"},
        {"n": 4, "nombre": "Transporte", "info": "Protocolo: TCP. Puerto Destino: 443"},
        {"n": 3, "nombre": "Red", "info": "IP Origen: 192.168.1.1 -> Destino: 157.240.x.x"},
        {"n": 2, "nombre": "Enlace", "info": "Trama Ethernet. MAC: 00:1A:2B:3C:4D:5E"},
        {"n": 1, "nombre": "Física", "info": "Señal Eléctrica: 01010011 01101001..."}
    ]
    
    return jsonify(capas_data)

if __name__ == '__main__':
    app.run(debug=True)