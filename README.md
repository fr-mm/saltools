# saltools

Utilitários em Vanilla JS para pipelines do Jenkins.

## Publicando no GitHub Packages

### 1. Configurar .npmrc

Após criar seu repositório no GitHub, atualize `.npmrc` com o owner da sua org/usuário do GitHub:

```
registry=https://npm.pkg.github.com/@OWNER
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Substitua `@OWNER` pelo seu nome de usuário ou organização do GitHub (ex: `@saltsystems`).

### 2. Publicar

Crie um Personal Access Token do GitHub com permissão `write:packages`, depois:

```bash
export NPM_TOKEN=seu_token_github
npm publish
```

Ou use em CI/CD:
```bash
npm publish --//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Instalação no Jenkins

### Instalação Global

A biblioteca deve ser instalada globalmente na máquina do Jenkins para estar disponível em todos os pipelines.

#### 1. Configurar .npmrc global

No servidor Jenkins, configure o `.npmrc` global do npm (ou no diretório home do usuário do Jenkins):

```bash
echo "registry=https://npm.pkg.github.com/@OWNER" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
```

Substitua `@OWNER` pelo seu nome de usuário ou organização do GitHub.

Ou configure globalmente para o sistema:
```bash
sudo npm config set registry https://npm.pkg.github.com/@OWNER
sudo npm config set //npm.pkg.github.com/:_authToken ${NPM_TOKEN}
```

#### 2. Instalar globalmente

```bash
npm install -g saltools
```

#### 3. Usar nos Pipelines

Após a instalação global, a biblioteca estará disponível em todos os pipelines sem necessidade de instalação:

```groovy
pipeline {
    agent any
    stages {
        stage('Usar saltools') {
            steps {
                sh '''
                    node -e "const { hello_world } = require('saltools'); console.log(hello_world());"
                '''
            }
        }
    }
}
```

## Uso

Após instalação global, use diretamente:

```js
const { hello_world } = require('saltools');

console.log(hello_world()); // "Hello, World!"
```
