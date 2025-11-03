# Saltools

Vanilla JS utilities for Jenkins pipelines.

## Instalação

```bash
npm install @fr-mm/saltools
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

### saltools.parse.phone()

Valida e formata números de telefone.

```javascript
saltools.parse.phone(phone, {
  addCountryCode: true,      // Adiciona código do país ao número (padrão: true)
  addPlusPrefix: false,      // Adiciona prefixo '+' ao número (padrão: false)
  addAreaCode: true,         // Adiciona código de área (padrão: true)
  numbersOnly: true,         // Retorna apenas números (padrão: true)
  throwError: true           // Lança erro se número inválido, senão retorna null (padrão: true)
})
```

**Exemplo:**
```javascript
saltools.parse.phone('11987654321', { numbersOnly: false, addCountryCode: false });
// Retorna: "(11) 98765-4321"

saltools.parse.phone('11987654321', { numbersOnly: false });
// Retorna: "55 (11) 98765-4321"

saltools.parse.phone('11987654321', { addPlusPrefix: true });
// Retorna: "+5511987654321"
```

### saltools.parse.string()

Valida e formata strings.

```javascript
saltools.parse.string(value, {
  allowEmpty: false,         // Permite string vazia (padrão: false)
  cast: false,               // Converte valor não-string para string (padrão: false)
  trim: true,                // Remove espaços no início e fim (padrão: true)
  capitalize: false,         // Capitaliza primeira letra de cada palavra (padrão: false)
  varName: null,             // Nome da variável para mensagens de erro (padrão: null)
  throwError: true           // Lança erro se inválido, senão retorna null (padrão: true)
})
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
  allowEmptyString: false,   // Permite string vazia (padrão: false)
  allowNull: false,          // Permite null (padrão: false)
  allowNegative: false,      // Permite números negativos (padrão: false)
  allowZero: false,          // Permite zero (padrão: false)
  varName: null,             // Nome da variável para mensagens de erro (padrão: null)
  throwError: true           // Lança erro se inválido, senão retorna null (padrão: true)
})
```

**Exemplo:**
```javascript
saltools.parse.number('123.45');
// Retorna: 123.45

saltools.parse.number('-10', { allowNegative: true });
// Retorna: -10
```

### saltools.parse.integer()

Valida e converte valores para número inteiro.

```javascript
saltools.parse.integer(value, {
  allowEmptyString: false,   // Permite string vazia (padrão: false)
  allowNull: false,          // Permite null (padrão: false)
  allowNegative: false,      // Permite números negativos (padrão: false)
  allowZero: false,          // Permite zero (padrão: false)
  varName: null,             // Nome da variável para mensagens de erro (padrão: null)
  throwError: true           // Lança erro se inválido, senão retorna null (padrão: true)
})
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
  delimiter: ',',            // Delimitador de colunas (padrão: ',')
  quoteChar: '"',            // Caractere de citação (padrão: '"')
  escapeChar: '\\',          // Caractere de escape (padrão: '\\')
  throwError: true           // Lança erro se inválido, senão retorna null (padrão: true)
})
```

**Exemplo:**
```javascript
saltools.parse.csv('./data.csv');
// Retorna: Array de objetos com as linhas do CSV

saltools.parse.csv('./data.csv', { delimiter: ';' });
// Retorna: Array parseado com delimitador ';'
```