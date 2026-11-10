
#include <WiFi.h>
#include <WebServer.h>
#include <WiFiManager.h>
#include <DHT.h>

// =====================================
// CONFIGURACOES
// =====================================

#define DHT_PIN 4
#define DHT_TYPE DHT11

const char* AP_NAME = "MEU-AMBIENTE-CONFIG";
const char* AP_PASSWORD = "teste@123";

const unsigned long SENSOR_INTERVAL = 2000;
const unsigned long WIFI_RETRY_TIME = 60000;

// =====================================
// OBJETOS
// =====================================

DHT dht(DHT_PIN, DHT_TYPE);
WebServer server(80);
WiFiManager wifiManager;

// =====================================
// VARIAVEIS
// =====================================

float temperatura = NAN;
float umidade = NAN;

unsigned long ultimaLeitura = 0;
unsigned long inicioDesconexao = 0;

bool serverStarted = false;
bool portalEmExecucao = false;

// =====================================
// LEITURA DO SENSOR
// =====================================

void atualizarSensor() {

  if (millis() - ultimaLeitura < SENSOR_INTERVAL) {
    return;
  }

  ultimaLeitura = millis();

  float novaTemperatura = dht.readTemperature();
  float novaUmidade = dht.readHumidity();

  if (!isnan(novaTemperatura) && !isnan(novaUmidade)) {

    temperatura = novaTemperatura;
    umidade = novaUmidade;

    Serial.printf(
      "Temperatura: %.1f C | Umidade: %.1f %%\n",
      temperatura,
      umidade
    );

  } else {

    Serial.println("Erro na leitura do DHT11");

  }
}

// =====================================
// ENDPOINT SENSOR
// =====================================

void handleSensor() {

  if (isnan(temperatura) || isnan(umidade)) {

    server.send(
      503,
      "application/json",
      "{\"erro\":\"Leitura do sensor indisponivel\"}"
    );

    return;
  }

  String json = "{";

  json += "\"temperatura\":" + String(temperatura, 1) + ",";
  json += "\"umidade\":" + String(umidade, 0) + ",";
  json += "\"sensor\":\"DHT11\",";
  json += "\"status\":\"online\"";

  json += "}";

  server.send(200, "application/json", json);
}

// =====================================
// ENDPOINT STATUS
// =====================================

void handleStatus() {

  String json = "{";

  json += "\"status\":\"online\",";
  json += "\"dispositivo\":\"ESP32-WROOM-32\",";
  json += "\"wifi\":\"conectado\",";
  json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
  json += "\"sinal_wifi\":" + String(WiFi.RSSI());

  json += "}";

  server.send(200, "application/json", json);
}

// =====================================
// INICIAR SERVIDOR HTTP
// =====================================

void iniciarServidor() {

  if (serverStarted) {
    return;
  }

  server.on("/api/sensor", HTTP_GET, handleSensor);
  server.on("/api/status", HTTP_GET, handleStatus);

  server.onNotFound([]() {

    server.send(
      404,
      "application/json",
      "{\"erro\":\"Endpoint nao encontrado\"}"
    );

  });

  server.begin();

  serverStarted = true;

  Serial.println("Servidor HTTP iniciado!");

  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

// =====================================
// CONFIGURACAO AUTOMATICA DO WIFI
// =====================================

bool configurarWiFi() {

  Serial.println("Verificando rede Wi-Fi...");

  wifiManager.setConnectTimeout(20);

  // Portal permanece aberto ate configurar uma rede
  wifiManager.setConfigPortalTimeout(0);

  bool conectado = wifiManager.autoConnect(
    AP_NAME,
    AP_PASSWORD
  );

  if (conectado) {

    Serial.println("Wi-Fi conectado!");

    Serial.print("IP: ");
    Serial.println(WiFi.localIP());

    WiFi.setAutoReconnect(true);

    return true;
  }

  return false;
}

// =====================================
// PORTAL AUTOMATICO APOS DESCONEXAO
// =====================================

void abrirPortalConfiguracao() {

  if (portalEmExecucao) {
    return;
  }

  portalEmExecucao = true;

  Serial.println();
  Serial.println("Abrindo portal de configuracao Wi-Fi...");

  // Para o servidor enquanto o ESP32 configura a rede
  server.stop();
  serverStarted = false;

  // Abre o portal sem apagar as credenciais antigas.
  // O usuario pode cadastrar uma nova rede.
  bool conectado = wifiManager.startConfigPortal(
    AP_NAME,
    AP_PASSWORD
  );

  if (conectado) {

    Serial.println("Nova conexao Wi-Fi estabelecida!");

    WiFi.setAutoReconnect(true);

    iniciarServidor();

    inicioDesconexao = 0;

  } else {

    Serial.println("Portal encerrado sem conexao.");
    Serial.println("Reiniciando ESP32...");

    delay(2000);
    ESP.restart();

  }

  portalEmExecucao = false;
}

// =====================================
// MONITORAMENTO DA CONEXAO
// =====================================

void monitorarWiFi() {

  if (WiFi.status() == WL_CONNECTED) {

    inicioDesconexao = 0;
    return;

  }

  if (inicioDesconexao == 0) {

    inicioDesconexao = millis();

    Serial.println("Wi-Fi desconectado!");

  }

  // Tenta recuperar a conexao automaticamente
  WiFi.reconnect();

  // Se permanecer desconectado por 60 segundos,
  // disponibiliza uma nova configuracao
  if (millis() - inicioDesconexao >= WIFI_RETRY_TIME) {

    abrirPortalConfiguracao();

  }
}

// =====================================
// SETUP
// =====================================

void setup() {

  Serial.begin(115200);

  dht.begin();

  Serial.println();
  Serial.println("==========================");
  Serial.println("       MEU-AMBIENTE");
  Serial.println("==========================");

  if (!configurarWiFi()) {

    Serial.println("Nao foi possivel conectar ao Wi-Fi.");

    delay(2000);
    ESP.restart();

  }

  iniciarServidor();

  // Permite realizar a primeira leitura
  ultimaLeitura = millis() - SENSOR_INTERVAL;

  atualizarSensor();
}

// =====================================
// LOOP
// =====================================

void loop() {

  if (WiFi.status() == WL_CONNECTED) {

    server.handleClient();

  }

  atualizarSensor();

  monitorarWiFi();

}
