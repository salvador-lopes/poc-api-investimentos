# poc-api-investimentos


BIBLIOTECAS:

NESTJS - Utilizei essa ferramentas baseada em NOde e Typescript que já integrará com facilidade o Sequelize enquanto ORM pra um banco relacional e as bibliotecas de teste.

Como já dito acima, utilizarei o Sequelize, para facilitar a comunicação com o banco.

Uso o ESLINT para auxílio nas boas práticas de 'code smells', padrão airbnb.

Para o banco de dados usei o docker, bastando rodar o "docker-compose up" no terminal estando na pasta raiz
tendo o arquivo ".env". 

Uso Jest como biblioteca de testes. 

DOCUMENTAÇÃO DE ROTAS E REQUISIÇÕES

Acompanha no repositório o JSON "insomnia_investimentos", o qual já fornece exemplos de requisições e rotas utilizadas.

PARA RODAR A APLICAÇÃO

Além do arquivo de variáveis de ambiente da pasta raiz, também vai um arquivo na pasta src.

Tendo estes dois arquivos, basta rodar "docker-compose up" na pasta raiz, "npm i" na pasta src e depois "npm start".

Para rodar os testes unitários use "npm test"
