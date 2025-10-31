# saltools

Utilitários em Vanilla JS para pipelines do Jenkins.

## Publicando no GitHub Packages

### 1. Configurar .npmrc

Configure o `.npmrc` com o escopo do GitHub:

```
@fr-mm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

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

### Passo a Passo no Servidor Jenkins

#### 1. Conectar no servidor Jenkins

SSH no servidor onde o Jenkins está rodando (ou acesse como administrador se estiver no mesmo servidor).

#### 2. Verificar/Instalar Node.js e npm

Primeiro, verifique se o npm está instalado:

```bash
which npm
npm --version
```

**Se o npm não estiver instalado, você tem algumas opções:**

**Opção A: Instalar Node.js via NVM (recomendado)**

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar o shell
source ~/.bashrc

# Instalar Node.js LTS (que inclui npm)
nvm install --lts
nvm use --lts

# Verificar instalação
node --version
npm --version
```

**Opção B: Instalar Node.js via package manager (Ubuntu/Debian)**

```bash
# Adicionar repositório NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Instalar Node.js (inclui npm)
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

**Opção C: Usar o Node.js do Jenkins (se já estiver instalado via Jenkins Tool)**

Encontre o caminho onde o Jenkins instalou o Node.js:

```bash
# Procure no diretório do Jenkins
find /var/lib/jenkins -name "node" -type f 2>/dev/null
find /opt -name "node" -type f 2>/dev/null

# Ou verifique as ferramentas instaladas do Jenkins
ls -la /var/lib/jenkins/tools/

# Quando encontrar, adicione ao PATH do usuário do Jenkins
sudo su - jenkins
echo 'export PATH="/caminho/para/node/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Opção D: Instalar Node.js manualmente (binários)**

```bash
# Download do Node.js LTS
cd /tmp
wget https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz

# Extrair
tar -xf node-v20.11.0-linux-x64.tar.xz

# Mover para /opt
sudo mv node-v20.11.0-linux-x64 /opt/nodejs

# Criar links simbólicos (para todo o sistema)
sudo ln -s /opt/nodejs/bin/node /usr/local/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/local/bin/npm

# Verificar
node --version
npm --version
```

#### 3. Obter o token do GitHub

Você precisa do mesmo Personal Access Token criado anteriormente (ou criar um novo com permissão `read:packages`).

#### 4. Configurar .npmrc

**Opção A: Para o usuário do Jenkins (recomendado)**

```bash
# Se o Jenkins roda como usuário 'jenkins', faça login como esse usuário
sudo su - jenkins

# Configure o .npmrc no home do usuário
cat >> ~/.npmrc << EOF
@fr-mm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_SEU_TOKEN_AQUI
EOF
```

**Opção B: Para todo o sistema (requer sudo)**

```bash
sudo npm config set @fr-mm:registry https://npm.pkg.github.com
sudo npm config set //npm.pkg.github.com/:_authToken ghp_SEU_TOKEN_AQUI
```

**Substitua `ghp_SEU_TOKEN_AQUI` pelo seu Personal Access Token do GitHub.**

#### 5. Instalar globalmente

```bash
# Se configurou como usuário do Jenkins
sudo su - jenkins
npm install -g @fr-mm/saltools

# Se configurou para todo o sistema
sudo npm install -g @fr-mm/saltools
```

#### 6. Criar alias para usar sem escopo (opcional, mas recomendado)

Para usar `require('saltools')` sem escopo:

```bash
# Encontre o diretório de módulos globais do npm
GLOBAL_NPM_PATH=$(npm root -g)

# Crie o link simbólico
cd "$GLOBAL_NPM_PATH"
ln -s @fr-mm/saltools saltools

# Verifique se funcionou
node -e "const s = require('saltools'); console.log(s.hello_world());"
```

**No Windows (se o Jenkins estiver no Windows):**

```powershell
$globalPath = npm root -g
cd $globalPath
New-Item -ItemType SymbolicLink -Path saltools -Target "@fr-mm\saltools"
```

#### 7. Verificar instalação

Teste se está funcionando:

```bash
node -e "const { hello_world } = require('@fr-mm/saltools'); console.log(hello_world());"
# ou se criou o alias:
node -e "const { hello_world } = require('saltools'); console.log(hello_world());"
```

### Usar nos Pipelines do Jenkins

Após a instalação global, use nos seus pipelines:

**Com escopo:**
```groovy
pipeline {
    agent any
    stages {
        stage('Exemplo') {
            steps {
                sh '''
                    node -e "const { hello_world } = require('@fr-mm/saltools'); console.log(hello_world());"
                '''
            }
        }
    }
}
```

**Sem escopo (se criou o alias):**
```groovy
pipeline {
    agent any
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

**Em um script Node.js dentro do pipeline:**
```groovy
pipeline {
    agent any
    stages {
        stage('Executar script') {
            steps {
                script {
                    sh '''
                        cat > script.js << 'EOF'
                        const { hello_world } = require('saltools');
                        console.log(hello_world());
                        EOF
                        node script.js
                    '''
                }
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
