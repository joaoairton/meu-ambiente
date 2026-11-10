Este firmware permite configurar a rede Wi-Fi do ESP32, ler temperatura e umidade reais com o DHT11 e consultar os dados por uma API HTTP local.

## Requisitos

- ESP32 Dev Module ou placa equivalente;
- sensor DHT11, preferencialmente em módulo de 3 pinos;
- Arduino IDE;
- pacote de placas `esp32 by Espressif Systems`;
- biblioteca `DHT sensor library by Adafruit`;
- biblioteca `Adafruit Unified Sensor`;
- cabo USB com transmissão de dados;
- rede Wi-Fi de 24 GHz.

As bibliotecas `WiFi`, `WebServer` e `Preferences` já fazem parte do pacote do ESP32. As duas bibliotecas da Adafruit devem ser instaladas pelo **Gerenciador de Bibliotecas** da Arduino IDE.

## Ligação do DHT11

Para um módulo DHT11 de 3 pinos:

COLOCAR IMAGEM DO SENDSOR

## Como gravar

1. Abra `firmware.ino` no Arduino IDE.
2. Em **Ferramentas > Placa**, selecione sua placa. Para placas genéricas, normalmente funciona `ESP32 Dev Module`.
3. Selecione a porta serial.
4. Clique em **Carregar**.
5. Abra o Monitor Serial em `115200 baud`.

Uma leitura deve aparecer aproximadamente a cada 2,5 segundos:

```text
DHT11 | Temperatura: 27.4 °C | Umidade: 68.0 %
```

Se aparecer uma falha, confira a alimentação, o cabo de dados e a GPIO configurada.

## Como testar pelo navegador

1. Ligue ou reinicie o ESP32.
2. No celular ou computador, abra as configurações de Wi-Fi.
3. Conecte-se a:

   - Rede: `Nome da Rede`
   - Senha: `senha - a definir`

4. Se o aparelho avisar que a rede não tem internet, escolha permanecer conectado.
5. Abra `http://192.168.4.1` no navegador.
6. Clique em **Procurar redes Wi-Fi**.
7. Escolha uma rede de 2,4 GHz e digite a senha.
8. Clique em **Conectar ESP32**.
9. Aguarde a página mostrar o IP recebido pelo ESP32.

A própria página também mostra a leitura atual do DHT11.

Durante este primeiro teste, a constante abaixo está definida como `false`:

```cpp
const bool STOP_AP_AFTER_SUCCESS = false;
```

Por isso, a rede `Climai-Config` continuará disponível mesmo depois que o ESP32 entrar no roteador. Isso facilita os testes. Na versão final, altere para `true`.

## Endpoints disponíveis

### Leitura real do DHT11

Enquanto estiver conectado à rede `Climai-Config`, abra:

```http
GET http://192.168.4.1/api/sensor
```

Resposta esperada:

```json
{
  "success": true,
  "sensor": "online",
  "type": "DHT11",
  "pin": 4,
  "temperature": 27.4,
  "humidity": 68.0,
  "temperatureUnit": "C",
  "humidityUnit": "%",
  "lastReadMs": 12500,
  "uptimeMs": 12830
}
```

Se o sensor não puder ser lido, o endpoint retorna HTTP `503` com uma mensagem de erro. Depois que o ESP32 se conectar ao roteador, o mesmo endpoint também estará disponível no IP exibido na página e no Monitor Serial.

### Situação atual

```http
GET http://192.168.4.1/api/status
```

### Listar redes próximas

```http
GET http://192.168.4.1/api/networks
```

### Configurar Wi-Fi

O endpoint recebe `application/x-www-form-urlencoded`.

```http
POST http://192.168.4.1/api/connect
Content-Type: application/x-www-form-urlencoded

ssid=MinhaRede&password=MinhaSenha
```

Exemplo com `curl`:

```bash
curl -X POST http://192.168.4.1/api/connect \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "ssid=MinhaRede" \
  --data-urlencode "password=MinhaSenha"
```

### Apagar credenciais

```http
POST http://192.168.4.1/api/reset
```

## Comportamento esperado

- O ESP32 inicia em modo `AP + STA`.
- A rede de configuração fica disponível em `192.168.4.1`.
- As credenciais recebidas ficam temporariamente na memória RAM.
- O ESP32 tenta conectar durante 20 segundos.
- As credenciais são salvas na NVS somente após uma conexão bem-sucedida.
- Se a senha estiver errada, o AP permanece disponível para outra tentativa.
- Após reiniciar, o ESP32 tenta usar as credenciais salvas.

## Problemas comuns

### O celular desconecta de Climai-Config

O celular detectou que a rede não possui internet. Nas opções apresentadas pelo sistema, escolha permanecer conectado.

### Nenhuma rede aparece

Verifique se o roteador oferece uma rede de 2,4 GHz. O ESP32 comum não se conecta a uma rede exclusivamente de 5 GHz.

### A conexão falha mesmo com a senha correta

- aproxime o ESP32 do roteador;
- confirme se o SSID selecionado está correto;
- verifique se a rede utiliza autenticação compatível;
- acompanhe as mensagens no Monitor Serial.

### Quero começar do zero

Abra `http://192.168.4.1`, clique em **Apagar configuração salva** e aguarde o reinício.

## Critério para concluir esta etapa

- o Monitor Serial exibe temperatura e umidade reais;
- `http://192.168.4.1/api/sensor` devolve JSON com `success: true`;
- ao tocar no sensor, a temperatura muda gradualmente nas leituras seguintes;
- ao remover o fio de dados, a API passa a responder com erro `503`.
