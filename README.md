# Saltools

Vanilla JS utilities for Jenkins pipelines.

## Instalação

```bash
npm install git@github.com:fr-mm/saltools.git
```

## Como usar em um pipeline do Jenkins

Para usar esta biblioteca num pipeline do Jenkins, é preciso começar com um stage assim:

```groovy
stage('Update saltools') {
    steps {
        sh '''
            cd "$BASE_DIR"
            npm install git@github.com:fr-mm/saltools.git
        '''
    }
}
```

## Uso

```javascript
const saltools = require('@fr-mm/saltools');
```

### saltools.timestamp()

Gera uma string com timestamp no formato `DD-MM-YYYY-hh-mm-ss-mmm`.

```javascript
saltools.timestamp();
```

**Exemplo:**

```javascript
saltools.timestamp();
// Retorna: "15-03-2024-14h-30m-45s-123ms"
```

### saltools.parse.phone()

Valida e formata números de telefone.

```javascript
saltools.parse.phone(phone, {
  addCountryCode: true, // Adiciona código do país ao número (padrão: true)
  addPlusPrefix: false, // Adiciona prefixo '+' ao número (padrão: false)
  addAreaCode: true, // Adiciona código de área (padrão: true)
  numbersOnly: true, // Retorna apenas números (padrão: true)
  throwError: true, // Lança erro se número inválido, senão retorna null (padrão: true)
  fixWhatsapp9: true, // Corrige o dígito 9 em celulares: DDD < 47 deve ter 9, DDD >= 47 não deve ter (padrão: true)
});
```

**Exemplo:**

```javascript
saltools.parse.phone('11987654321', { numbersOnly: false, addCountryCode: false });
// Retorna: "(11) 98765-4321"

saltools.parse.phone('11987654321', { numbersOnly: false });
// Retorna: "55 (11) 98765-4321"

saltools.parse.phone('11987654321', { addPlusPrefix: true });
// Retorna: "+5511987654321"

saltools.parse.phone('1188887777', { fixWhatsapp9: true });
// Retorna: "5511988887777" (adiciona o 9 porque DDD 11 < 47)

saltools.parse.phone('47988887777', { fixWhatsapp9: true });
// Retorna: "554788887777" (remove o 9 porque DDD 47 >= 47)
```

### saltools.parse.string()

Valida e formata strings.

```javascript
saltools.parse.string(value, {
  allowEmpty: false, // Permite string vazia (padrão: false)
  cast: false, // Converte valor não-string para string (padrão: false)
  trim: true, // Remove espaços no início e fim (padrão: true)
  capitalize: false, // Capitaliza primeira letra de cada palavra (padrão: false)
  varName: undefined, // Nome da variável para mensagens de erro (padrão: undefined)
  throwError: true, // Lança erro se inválido, senão retorna null (padrão: true)
});
```

**Exemplo:**

```javascript
saltools.parse.string('  joão silva  ', { trim: true, capitalize: true });
// Retorna: "João Silva"

saltools.parse.string(123, { cast: true });
// Retorna: "123"
```

### saltools.parse.number()

Valida e converte valores para número.

```javascript
saltools.parse.number(value, {
  allowEmptyString: false, // Permite string vazia (padrão: false)
  allowNull: false, // Permite null (padrão: false)
  allowNegative: true, // Permite números negativos (padrão: true)
  allowZero: true, // Permite zero (padrão: true)
  varName: undefined, // Nome da variável para mensagens de erro (padrão: undefined)
  throwError: true, // Lança erro se inválido, senão retorna null (padrão: true)
});
```

**Exemplo:**

```javascript
saltools.parse.number('123.45');
// Retorna: 123.45

saltools.parse.number('-10');
// Retorna: -10

saltools.parse.number('0');
// Retorna: 0
```

### saltools.parse.integer()

Valida e converte valores para número inteiro.

```javascript
saltools.parse.integer(value, {
  allowEmptyString: false, // Permite string vazia (padrão: false)
  allowNull: false, // Permite null (padrão: false)
  allowNegative: true, // Permite números negativos (padrão: true)
  allowZero: true, // Permite zero (padrão: true)
  varName: undefined, // Nome da variável para mensagens de erro (padrão: undefined)
  throwError: true, // Lança erro se inválido, senão retorna null (padrão: true)
});
```

**Exemplo:**

```javascript
saltools.parse.integer('123');
// Retorna: 123

saltools.parse.integer('123.45');
// Lança erro (não é inteiro)
```

### saltools.parse.csv()

Converte arquivo CSV para objeto JSON

```javascript
saltools.parse.csv(path, {
  delimiter: ',', // Delimitador de colunas (padrão: ',')
  quoteChar: '"', // Caractere de citação (padrão: '"')
  escapeChar: '\\', // Caractere de escape (padrão: '\\')
  throwError: true, // Lança erro se inválido, senão retorna null (padrão: true)
});
```

**Exemplo:**

```javascript
saltools.parse.csv('./data.csv');
// Retorna: Array de objetos com as linhas do CSV

saltools.parse.csv('./data.csv', { delimiter: ';' });
// Retorna: Array parseado com delimitador ';'
```

### saltools.parse.date()

Converte uma string de data de um formato para outro formato. Também aceita objetos Date como entrada.

```javascript
saltools.parse.date(date, {
  inputFormat: 'iso', // Formato de entrada (padrão: 'iso') - usado apenas quando date é uma string
  outputFormat: 'iso', // Formato de saída (padrão: 'iso')
  throwError: true, // Lança erro se inválido, senão retorna null (padrão: true)
});
```

**Parâmetros:**
- `date` - String ou objeto Date a ser parseado
- `options.inputFormat` - Formato de entrada (usado apenas quando `date` é uma string)
- `options.outputFormat` - Formato de saída
- `options.throwError` - Lança erro se inválido, senão retorna null

**Formatos suportados:**

- `'iso'` - Formato ISO 8601 (ex: `2024-03-15T10:30:00Z`)
- `'dd/mm/yyyy'` - Dia/mês/ano com separador `/` (ex: `15/03/2024`)
- `'dd-mm-yyyy'` - Dia/mês/ano com separador `-` (ex: `15-03-2024`)
- `'dd.mm.yyyy'` - Dia/mês/ano com separador `.` (ex: `15.03.2024`)
- `'mm/dd/yyyy'` - Mês/dia/ano com separador `/` (ex: `03/15/2024`)
- `'yyyy/mm/dd'` - Ano/mês/dia com separador `/` (ex: `2024/03/15`)
- `'ddmmyyyy'` - Sem separadores (ex: `15032024`)
- `'yyyymmdd'` - Sem separadores (ex: `20240315`)
- `'d/m/yyyy'`, `'dd/mm/yy'`, etc. - Variações com 1 ou 2 dígitos para dia/mês e 2 ou 4 dígitos para ano

**Exemplo:**

```javascript
saltools.parse.date('2024-03-15T10:30:00Z', {
  inputFormat: 'iso',
  outputFormat: 'dd/mm/yyyy',
});
// Retorna: "15/03/2024"

saltools.parse.date('15/03/2024', {
  inputFormat: 'dd/mm/yyyy',
  outputFormat: 'mm/dd/yyyy',
});
// Retorna: "03/15/2024"

saltools.parse.date('15032024', {
  inputFormat: 'ddmmyyyy',
  outputFormat: 'dd/mm/yyyy',
});
// Retorna: "15/03/2024"

saltools.parse.date('15/03/2024', {
  inputFormat: 'dd/mm/yyyy',
  outputFormat: 'dd/mm/yy',
});
// Retorna: "15/03/24"

saltools.parse.date(new Date('2024-03-15T10:30:00Z'), {
  outputFormat: 'dd/mm/yyyy',
});
// Retorna: "15/03/2024" (inputFormat é ignorado quando date é um objeto Date)
```

### saltools.parse.email()

Valida e verifica emails através de múltiplas validações.

```javascript
await saltools.parse.email(email, {
  allowAlias: true, // Permite emails com aliases (ex: nome+tag@domain.com) (padrão: true)
  allowDisposable: false, // Permite emails temporários/descartáveis (padrão: false)
  validateSPF: true, // Valida registro SPF (padrão: true)
  validateDMARC: true, // Valida registro DMARC (padrão: true)
  validateDKIM: true, // Valida registro DKIM (padrão: true)
  validateMX: true, // Valida registro MX (padrão: true)
  validateSMTP: true, // Valida através de SMTP (padrão: true)
});
```

**Exemplo:**

```javascript
await saltools.parse.email('usuario@exemplo.com');
// Valida sintaxe, SPF, DMARC, DKIM, MX e SMTP

await saltools.parse.email('usuario@exemplo.com', {
  allowAlias: true,
  validateSPF: false,
});
// Permite aliases e não valida SPF
```

### saltools.parse.fwf()

Faz o parse de um arquivo de largura fixa (fixed-width file).

```javascript
saltools.parse.fwf(path, fields, {
  lineValidation: undefined, // Função para validar se uma linha deve ser processada (padrão: undefined)
});
```

**Exemplo:**

```javascript
const fields = [
  { key: 'name', start: 0, end: 9 },
  { key: 'age', start: 10, end: 11 },
  { key: 'city', start: 12, end: 19 },
];

saltools.parse.fwf('./data.txt', fields);
// Retorna: Array de objetos com os campos parseados

saltools.parse.fwf('./data.txt', fields, {
  lineValidation: (line) => line.startsWith('VALID'),
});
// Retorna: Array apenas com linhas que começam com 'VALID'

saltools.parse.fwf('./data.txt', fields, {
  lineValidation: (line) => line.length >= 10,
});
// Retorna: Array apenas com linhas que têm 10 ou mais caracteres
```

### saltools.parse.bool()

Converte valores para boolean.

```javascript
saltools.parse.bool(value, {
  throwError: true, // Lança erro se inválido, senão retorna undefined (padrão: true)
});
```

**Valores aceitos:**
- Strings: `'true'`, `'TRUE'`, `'false'`, `'FALSE'`, `'1'`, `'0'` (case-insensitive, com ou sem espaços)
- Numbers: `1` (true), `0` (false)
- Booleans: retornados como estão

**Exemplo:**
```javascript
saltools.parse.bool('true');
// Retorna: true

saltools.parse.bool('TRUE');
// Retorna: true

saltools.parse.bool('1');
// Retorna: true

saltools.parse.bool('false');
// Retorna: false

saltools.parse.bool('0');
// Retorna: false

saltools.parse.bool(' true ');
// Retorna: true (espaços são removidos)

saltools.parse.bool(1);
// Retorna: true

saltools.parse.bool(0);
// Retorna: false

saltools.parse.bool(true);
// Retorna: true

saltools.parse.bool('invalid', { throwError: false });
// Retorna: undefined (não lança erro)
```

### saltools.parse.doc()

Valida e formata documentos CPF ou CNPJ.

```javascript
saltools.parse.doc(doc, {
  numbersOnly: true, // Retorna apenas números (padrão: true)
  type: undefined, // Tipo do documento: 'cpf', 'cnpj' ou undefined para inferir (padrão: undefined)
  throwError: true, // Lança erro se inválido, senão retorna null (padrão: true)
});
```

**Exemplo:**

```javascript
saltools.parse.doc('123.456.789-00');
// Retorna: "12345678900" (formato padrão: apenas números)

saltools.parse.doc('12.345.678/0001-90');
// Retorna: "12345678000190" (CNPJ: apenas números)

saltools.parse.doc(12345678900);
// Retorna: "12345678900" (aceita número como entrada)

saltools.parse.doc(12345678900, { type: 'cpf' });
// Retorna: "12345678900" (força tipo CPF)

saltools.parse.doc(123456780001, { type: 'cnpj' });
// Retorna: "00012345678001" (força tipo CNPJ e preenche zeros)

saltools.parse.doc('123.456.789-00', { numbersOnly: false });
// Retorna: "123.456.789-00" (formatado)

saltools.parse.doc('12.345.678/0001-90', { numbersOnly: false });
// Retorna: "12.345.678/0001-90" (CNPJ formatado)
```

### saltools.sftp

Wrapper para gerenciar conexões SFTP. Esta biblioteca não depende de nenhuma biblioteca SFTP específica - você deve fornecer um cliente SFTP instanciado.

#### saltools.sftp.configure()

Configura o cliente SFTP com as credenciais e opções de conexão.

```javascript
saltools.sftp.configure({
  client: sftpClient, // Cliente SFTP instanciado (obrigatório)
  host: 'example.com', // Host do servidor SFTP (obrigatório)
  username: 'user', // Nome de usuário (obrigatório)
  password: 'password', // Senha (obrigatório)
  port: 22, // Porta do servidor SFTP (padrão: 22)
  readyTimeout: 10000, // Timeout para conexão em milissegundos (padrão: 10000)
});
```

**Exemplo:**

```javascript
const Client = require('ssh2-sftp-client');
const sftpClient = new Client();

saltools.sftp.configure({
  client: sftpClient,
  host: 'sftp.example.com',
  username: 'myuser',
  password: 'mypassword',
  port: 22,
  readyTimeout: 10000,
});
```

#### saltools.sftp.connect()

Conecta ao servidor SFTP usando as credenciais configuradas.

```javascript
await saltools.sftp.connect();
```

**Exemplo:**

```javascript
try {
  await saltools.sftp.connect();
  console.log('Conectado com sucesso!');
} catch (error) {
  console.error('Erro ao conectar:', error.message);
}
```

#### saltools.sftp.disconnect()

Desconecta do servidor SFTP.

```javascript
await saltools.sftp.disconnect();
```

**Exemplo:**

```javascript
try {
  await saltools.sftp.disconnect();
  console.log('Desconectado com sucesso!');
} catch (error) {
  console.error('Erro ao desconectar:', error.message);
}
```

#### saltools.sftp.testConnection()

Testa a conexão SFTP conectando e desconectando automaticamente.

```javascript
await saltools.sftp.testConnection();
```

**Exemplo:**

```javascript
try {
  await saltools.sftp.testConnection();
  // Log: "[OK] Conexão estabelecida com SFTP"
  console.log('Conexão testada com sucesso!');
} catch (error) {
  console.error('Erro ao testar conexão:', error.message);
}
```

#### saltools.sftp.client

Getter que retorna o cliente SFTP configurado. Use este cliente para realizar operações SFTP (upload, download, listar arquivos, etc.).

```javascript
const client = saltools.sftp.client;
```

**Exemplo:**

```javascript
saltools.sftp.configure({
  client: sftpClient,
  host: 'sftp.example.com',
  username: 'myuser',
  password: 'mypassword',
});

await saltools.sftp.connect();

// Usar o cliente para operações SFTP
const client = saltools.sftp.client;
const list = await client.list('/remote/path');
const data = await client.get('/remote/file.txt');

await saltools.sftp.disconnect();
```

**Exemplo completo:**

```javascript
const Client = require('ssh2-sftp-client');
const saltools = require('@fr-mm/saltools');

const sftpClient = new Client();

// Configurar
saltools.sftp.configure({
  client: sftpClient,
  host: 'sftp.example.com',
  username: 'myuser',
  password: 'mypassword',
  port: 22,
});

try {
  // Conectar
  await saltools.sftp.connect();
  
  // Usar o cliente para operações
  const client = saltools.sftp.client;
  const files = await client.list('/remote/path');
  console.log('Arquivos:', files);
  
  // Desconectar
  await saltools.sftp.disconnect();
} catch (error) {
  console.error('Erro:', error.message);
}
```

### saltools.config

Configurações globais para o saltools.

#### saltools.config.date

Configurações específicas para parsing de datas.

```javascript
saltools.config.date.inputFormat('dd/mm/yyyy');
saltools.config.date.outputFormat('iso');
saltools.config.date.get();
saltools.config.date.reset();
```

**Métodos:**

- `inputFormat(value)` - Define o formato de entrada padrão para parsing de datas (ex: 'dd/mm/yyyy', 'iso')
- `outputFormat(value)` - Define o formato de saída padrão para parsing de datas (ex: 'dd/mm/yyyy', 'iso')
- `get()` - Obtém o objeto de configuração de data atual
- `reset()` - Redefine a configuração de data para um objeto vazio

**Exemplo:**

```javascript
saltools.config.date.inputFormat('dd/mm/yyyy');
saltools.config.date.outputFormat('iso');

const config = saltools.config.date.get();
// Retorna: { inputFormat: 'dd/mm/yyyy', outputFormat: 'iso' }

saltools.config.date.reset();
// Limpa todas as configurações de data
```

#### saltools.config.log.error

Configurações específicas para `saltools.log.error`.

```javascript
saltools.config.log.error.directory('./logs');
saltools.config.log.error.filename('error');
saltools.config.log.error.addTimestamp(true);
saltools.config.log.error.print(true);
saltools.config.log.error.throwError(false);
saltools.config.log.error.get();
saltools.config.log.error.reset();
```

**Métodos:**

- `directory(value)` - Define o diretório padrão para salvar arquivos de log de erro
- `filename(value)` - Define o nome padrão do arquivo de log de erro
- `addTimestamp(value)` - Define se deve adicionar timestamp ao nome do arquivo por padrão (true/false)
- `print(value)` - Define se deve imprimir erros no console por padrão (true/false)
- `throwError(value)` - Define se deve relançar erros após o registro por padrão (true/false)
- `get()` - Obtém o objeto de configuração de log de erro atual
- `reset()` - Redefine a configuração de log de erro para um objeto vazio

**Exemplo:**

```javascript
saltools.config.log.error.directory('./logs');
saltools.config.log.error.filename('error');
saltools.config.log.error.addTimestamp(true);
saltools.config.log.error.print(false);

const config = saltools.config.log.error.get();
// Retorna: { directory: './logs', filename: 'error', addTimestamp: true, print: false }

saltools.config.log.error.reset();
// Limpa todas as configurações de log de erro
```

#### saltools.config.log.save

Configurações específicas para `saltools.log.save`.

```javascript
saltools.config.log.save.directory('./logs');
saltools.config.log.save.filename('app');
saltools.config.log.save.addTimestamp(true);
saltools.config.log.save.get();
saltools.config.log.save.reset();
```

**Métodos:**

- `directory(value)` - Define o diretório padrão para salvar arquivos de log
- `filename(value)` - Define o nome padrão do arquivo de log
- `addTimestamp(value)` - Define se deve adicionar timestamp ao nome do arquivo por padrão (true/false)
- `get()` - Obtém o objeto de configuração de log atual
- `reset()` - Redefine a configuração de log para um objeto vazio

**Exemplo:**

```javascript
saltools.config.log.save.directory('./logs');
saltools.config.log.save.filename('app');
saltools.config.log.save.addTimestamp(true);

const config = saltools.config.log.save.get();
// Retorna: { directory: './logs', filename: 'app', addTimestamp: true }

saltools.config.log.save.reset();
// Limpa todas as configurações de log
```

#### saltools.config.throwError

Define o valor de configuração throwError global.

```javascript
saltools.config.throwError(true);
saltools.config.throwError(false);
```

#### saltools.config.get()

Obtém o objeto de configuração atual.

```javascript
const config = saltools.config.get();
```

#### saltools.config.reset()

Redefine todas as configurações para valores padrão.

```javascript
saltools.config.reset();
```
