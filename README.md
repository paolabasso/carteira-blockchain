#Primeiros Passos
1 - Baixar o AWS CLI e configurar a conta AWS com um usuário IAM para configurar as credenciais no cli.
2 - Baixar o NodeJs
3 - Baixar o aws cdk e dependências necessárias
Para instalação conforme linguaguem escolhida, segue documentação oficial:
[https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html]
npm install -g aws-cdk
Neste projetos usamos TS, desta forma é necessário:
npm -g install typescript
4 - Baixar docker desktop ou a enginner
Este passo será importante para a hora de subir aplicação, pois o build é realizado por meio da enginner do docker para gerar a imagem.
5 - Na primeira vez que rodar o projet será necessário rodar o seguinte comando:
cdk bootstrap
6 - Para provisionar os recursos:
cdk apply --all
7 - Para destruir os recursos:


##Comandos importantes
Para a primeira vez que rodar o projeto:
cdk bootstrap
Para provisionar os recursos:
cdk apply --all
Para destruir os recursos:
cdk destroy --all


