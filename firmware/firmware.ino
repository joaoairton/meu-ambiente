/**
 * MEU-AMBIENTE - Firmware ESP32
 * 
 * Monitora temperatura e umidade e disponibiliza
 * os dados via API HTTP.
 */

// ======================
// Bibliotecas
// ======================
#include <WiFi.h>
#include <WebServer.h>
#include <WiFiManager.h>
#include <DHT.h>

// ======================
// Configurações
// ======================
#define DHT_PIN 4
#define DHT_TYPE DHT11

// Nome e senha do Access Point do portal de configuração
const char* AP_NAME = "MEU-AMBIENTE-CONFIG";
const char* AP_PASSWORD = "teste@123";

// Intervalo entre leituras do sensor (evita sobrecarregar o DHT11)
const unsigned long SENSOR_INTERVAL = 2000;

// Tempo máximo sem Wi-Fi antes de abrir o portal de configuração novamente
const unsigned long WIFI_RETRY_TIME = 60000;


// ======================
// Objetos globais
// ======================
DHT dht(DHT_PIN, DHT_TYPE);
WebServer server(80);
WiFiManager wifiManager;


// ======================
// Variáveis de estado
// ======================
float temperatura = NAN;
float umidade = NAN;

unsigned long ultimaLeitura = 0;
unsigned long inicioDesconexao = 0;

bool serverStarted = false;
bool portalEmExecucao = false;

// ======================
// Funções auxiliares
// ======================

/**
 * Realiza a leitura do DHT11 respeitando o intervalo mínimo.
 * Só atualiza as variáveis globais se a leitura for válida.
 */
void atualizarSensor() {
  if (millis() - ultimaLeitura < SENSOR_INTERVAL) {
    return;
  }

  ultimaLeitura = millis();
  float novaTemperatura = dht.readTemperature();
  float novaUmidade = dht.readHumidity();

// DHT11 retorna NaN em caso de falha de comunicação
  if (!isnan(novaTemperatura) && !isnan(novaUmidade)) {
    temperatura = novaTemperatura;
    umidade = novaUmidade;

    Serial.printf(
      "Temperatura: %.1f C | Umidade: %.1f %%\n",
      temperatura,
      umidade
    );

  } else {
    Serial.println("Erro na leitura do sensor");
  }
}

/**
 * Endpoint: GET /api/sensor
 * Retorna temperatura e umidade em JSON.
 * Responde 503 caso ainda não exista leitura válida.
 */
void handleSensor() {
  if (isnan(temperatura) || isnan(umidade)) {
    server.send(
      503,
      "application/json",
      "{\"erro\":\"Leitura do sensor indisponivel\"}"
    );

    return;
  }

// Montagem do JSON (evita dependência de biblioteca externa)
  String json = "{";

  json += "\"temperatura\":" + String(temperatura, 1) + ",";
  json += "\"umidade\":" + String(umidade, 0) + ",";
  json += "\"sensor\":\"DHT11\",";
  json += "\"status\":\"online\"";

  json += "}";

  server.send(200, "application/json", json);
}


/**
 * Endpoint: GET /api/status
 * Retorna informações básicas do dispositivo e da conexão Wi-Fi
 */
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


/**
 * Configura e inicia o servidor HTTP.
 * Só executa uma vez (controlado pela flag serverStarted).
 */
void iniciarServidor() {
  if (serverStarted) {
    return;
  }

  /**
  * Habilita CORS para o React Native Web
  * Necessário para permitir requisições vindas de apps web/mobile
  */
  server.enableCORS(true);

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


/**
 * Tenta conectar usando as credenciais salvas.
 * Se não conseguir, abre o portal de configuração.
 * Retorna true se conectou com sucesso.
 */
bool configurarWiFi() {
  Serial.println("Verificando rede Wi-Fi...");
  wifiManager.setConnectTimeout(20);
  // Mantem o portal aberto ate configurar uma rede
  wifiManager.setConfigPortalTimeout(0);
  bool conectado = wifiManager.autoConnect(
    AP_NAME,
    AP_PASSWORD
  );

  if (conectado) {
    Serial.println("Wi-Fi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    // Garante que o ESP tente reconectar sozinho em caso de queda
    WiFi.setAutoReconnect(true);
    return true;
  }

  return false;
}


/**
 * Abre o portal de configuração manualmente.
 * Usado quando a conexão é perdida por um longo período.
 * Reinicia o ESP caso o usuário feche o portal sem configurar.
 */
void abrirPortalConfiguracao() {
  if (portalEmExecucao) {
    return;
  }

  portalEmExecucao = true;
  Serial.println();
  Serial.println("Abrindo portal de configuracao Wi-Fi...");
  // Para o servidor para liberar recursos e evitar conflitos
  server.stop();
  serverStarted = false;
  // startConfigPortal NÃO apaga as credenciais já salvas.
  // O usuário pode cadastrar uma nova rede sem perder a anterior.
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
    // Sem conexão após fechar o portal, reinicia para tentar novamente
    Serial.println("Portal encerrado sem conexao.");
    Serial.println("Reiniciando ESP32...");
    delay(2000);
    ESP.restart();

  }

  portalEmExecucao = false;
}

/**
 * Monitora o estado da conexão Wi-Fi.
 * Tenta reconectar automaticamente e, após WIFI_RETRY_TIME,
 * abre o portal de configuração.
 */
void monitorarWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    inicioDesconexao = 0;
    return;
  }

  // Marca o momento em que a desconexão começou
  if (inicioDesconexao == 0) {
    inicioDesconexao = millis();
    Serial.println("Wi-Fi desconectado!");
  }

  // Tenta recuperar a conexao automaticamente
  WiFi.reconnect();

  // Se permanecer desconectado por 60s oferece nova configuração
  if (millis() - inicioDesconexao >= WIFI_RETRY_TIME) {
    abrirPortalConfiguracao();
  }
}


// ======================
// Setup
// ======================
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
  // Força a primeira leitura logo no boot
  ultimaLeitura = millis() - SENSOR_INTERVAL;
  atualizarSensor();
}


// ======================
// Loop principal
// ======================
void loop() {
  // Só processa requisições HTTP enquanto estiver conectado
  if (WiFi.status() == WL_CONNECTED) {
    server.handleClient();
  }

  atualizarSensor();
  monitorarWiFi();

}
