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

### saltools.parse.date()

Converte uma string de data de um formato para outro formato.

```javascript
saltools.parse.date(date, {
  inputFormat: 'iso',        // Formato de entrada (padrão: 'iso')
  outputFormat: 'iso',       // Formato de saída (padrão: 'iso')
  throwError: true           // Lança erro se inválido, senão retorna null (padrão: true)
})
```

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
  outputFormat: 'dd/mm/yyyy'
});
// Retorna: "15/03/2024"

saltools.parse.date('15/03/2024', {
  inputFormat: 'dd/mm/yyyy',
  outputFormat: 'mm/dd/yyyy'
});
// Retorna: "03/15/2024"

saltools.parse.date('15032024', {
  inputFormat: 'ddmmyyyy',
  outputFormat: 'dd/mm/yyyy'
});
// Retorna: "15/03/2024"

saltools.parse.date('15/03/2024', {
  inputFormat: 'dd/mm/yyyy',
  outputFormat: 'dd/mm/yy'
});
// Retorna: "15/03/24"
```

### saltools.parse.email()

Valida e verifica emails através de múltiplas validações.

```javascript
await saltools.parse.email(email, {
  allowAlias: false,         // Permite emails com aliases (ex: nome+tag@domain.com) (padrão: false)
  allowDisposable: false,    // Permite emails temporários/descartáveis (padrão: false)
  useMailbox: false,         // Verifica se a caixa postal existe (padrão: false)
  useNeverbounce: false,     // Usa Neverbounce para validação (padrão: false)
  validateSPF: true,         // Valida registro SPF (padrão: true)
  validateDMARC: true,       // Valida registro DMARC (padrão: true)
  validateDKIM: true,        // Valida registro DKIM (padrão: true)
  validateMX: true,          // Valida registro MX (padrão: true)
  validateSMTP: true         // Valida através de SMTP (padrão: true)
})
```

**Exemplo:**
```javascript
await saltools.parse.email('usuario@exemplo.com');
// Valida sintaxe, SPF, DMARC, DKIM, MX e SMTP

await saltools.parse.email('usuario@exemplo.com', {
  allowAlias: true,
  validateSPF: false
});
// Permite aliases e não valida SPF

await saltools.parse.email('usuario@exemplo.com', {
  useMailbox: true,
  useNeverbounce: true
});
// Valida se a caixa postal existe e usa Neverbounce
```