# Saltools

Vanilla JS utilities for Jenkins pipelines.

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