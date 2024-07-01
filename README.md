# Visão Geral
O presente projeto realiza um CRUD(Create, Read, Update e Delete) em uma tabela do DynamoDB, por meio de lambdas functions. Além disso, a interface de acesso é realizada por meio de um API Gateway. Toda a infraestrutura foi provisionada utilizando o aws cdk (AWS Cloud Development Kit).

# Arquitetura
![image](https://github.com/paolabasso/carteira-blockchain/assets/91506356/6ba19ef0-89df-4899-8f58-0f5fd8225006)

# Primeiros Passos:
## Criar uma conta AWS e configurar um usuário IAM e gerar um secret Id e access key.

## Montando o ambiente, baixe os seguintes recursos:
  - aws cli;
  - nodeJs;
  - aws cdk(segue documentação oficial:[https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html]): npm install -g aws-cdk
  - Typescript: npm -g install typescript
   - Docker desktop ou a engine (Este passo será importante para a hora de subir aplicação, pois o build é realizado por meio da enginner do docker para gerar a imagem.)

## Comandos importantes
- Para a primeira vez que rodar o projeto:
cdk bootstrap
- Para provisionar os recursos:
cdk deploy --all
- Para destruir os recursos:
cdk destroy --all




