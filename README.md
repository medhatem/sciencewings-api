# Sciencewings server repo

![current version](badges/version.svg) ![typescript](https://img.shields.io/badge/built%20with-typescript-3178C6.svg)

- mana core back-end repository
- mana server and micro-services

## Requirement

- [npm && Node version 14](https://nodejs.org/en/download/)

if you have another version better to install nvm to switch between versions easily.

- [Docker](https://www.docker.com/)

if you have windows you can use wsl or dual boot your pc adding linux

- [Docker VSc extenction](https://code.visualstudio.com/docs/containers/overview)

### Nice to have

[iterm](https://iterm2.com/) for a better terminal experience

## set up the IDE

enable eslint to read from the file .eslintrc.json

- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

enable prettier code formatter to read from the file .prettierrc.json

- [prettier code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

enable sort-imports to sort your imports for typescript automaticly

- [sort-imports](https://marketplace.visualstudio.com/items?itemName=amatiasq.sort-imports)

#### Nice to have Vscode extensions

- [todo tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
- [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)
- [Error lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

## Getting started

1. create an ssh key for Bitbucket.
2. clone the repository.
3. open your cloned code in vs code.
4. change the branch to dev if it is in Master by default.

then run the folowing commands :

```
npm run init
npm run watch
npm run swagger-gen
npm run start-local-containers
npm run dev
npm run permission-seed
```

1. npm run init to initialize the project.
2. npm run build to build typescript into Javascript.
3. npm run watch same as build but stays running and recompiles at each change.
4. npm run swagger-gen to generate the swagger openapi documentation from the routes ,make sure that the generated file is not empty
5. npm run start-local-containers to start postgres and keycloak locally
6. If succesfull open a new terminal and run npm run dev to start the server locally then run npm run permission-seed to fill the permission table

- checkout server health: /health
- checkout the swagger docs: api/docs/
