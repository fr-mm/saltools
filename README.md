# saltools

Utilitários em Vanilla JS para pipelines do Jenkins.

## Instalação

Para instalar ou atualizar o saltools no Jenkins, execute o pipeline `update-saltools`.

> **Pré-requisito:** Crie uma credencial no Jenkins:
> - **Manage Jenkins** → **Credentials** → **System** → **Global credentials** → **Add Credentials**
> - Tipo: **Secret text**
> - Secret: Seu GitHub Personal Access Token (começa com `ghp_`)
> - ID: `github-npm-token`

```groovy
pipeline {
    agent any
    tools {
        nodejs 'node24'  // Ajuste para o nome da sua instalação do Node.js
    }
    environment {
        NPM_TOKEN = credentials('github-npm-token')
    }
    stages {
        stage('Configurar .npmrc') {
            steps {
                sh '''
                    echo "@fr-mm:registry=https://npm.pkg.github.com" > ~/.npmrc
                    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
                    chmod 600 ~/.npmrc
                '''
            }
        }
        stage('Instalar/Atualizar saltools') {
            steps {
                sh 'npm install -g @fr-mm/saltools@latest'
            }
        }
        stage('Configurar NODE_PATH') {
            steps {
                sh '''
                    NPM_GLOBAL_PATH=$(npm root -g)
                    # Salvar em arquivo para pipelines poderem ler
                    echo "$NPM_GLOBAL_PATH" > ~/.npm-global-path
                    # Adicionar ao profile também (para shells interativos)
                    if ! grep -q "NODE_PATH.*$NPM_GLOBAL_PATH" ~/.profile 2>/dev/null; then
                        echo "export NODE_PATH=\"$NPM_GLOBAL_PATH\"" >> ~/.profile
                    fi
                    if ! grep -q "NODE_PATH.*$NPM_GLOBAL_PATH" ~/.bashrc 2>/dev/null; then
                        echo "export NODE_PATH=\"$NPM_GLOBAL_PATH\"" >> ~/.bashrc
                    fi
                '''
            }
        }
        stage('Criar alias') {
            steps {
                sh '''
                    GLOBAL_PATH=$(npm root -g)
                    cd "$GLOBAL_PATH"
                    if [ ! -e saltools ] || [ "$(readlink saltools)" != "@fr-mm/saltools" ]; then
                        rm -f saltools
                        ln -s @fr-mm/saltools saltools
                    fi
                '''
            }
        }
    }
}
```

## Uso

Após a instalação, use nos seus pipelines. **Importante:** Adicione `NODE_PATH` no environment do pipeline:

```groovy
pipeline {
    agent any
    tools {
        nodejs 'node24'
    }
    environment {
        NODE_PATH = "${sh(script: 'cat ~/.npm-global-path 2>/dev/null || npm root -g', returnStdout: true).trim()}"
    }
    stages {
        stage('Exemplo') {
            steps {
                sh '''
                    node -e "const { hello_world } = require('saltools'); console.log(hello_world());"
                '''
            }
        }
    }
}
```

Ou em um script Node.js:

```js
const { hello_world } = require('saltools');
// ou
const { hello_world } = require('@fr-mm/saltools');
```

## API

### hello_world()

Retorna uma mensagem de saudação.

**Retorna:** `string` - "Hello, World!"

**Exemplo:**
```js
const { hello_world } = require('saltools');
console.log(hello_world()); // "Hello, World!"
```
