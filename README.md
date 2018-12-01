# React Seed
React seed is based on create-react-app and it incorporates many best practices typically needed in Enterprise apps.


## Content
- [X] SCSS Inclusion
- [X] Linting: `scss, js`
- [ ] Build Environments: `dev, stag, next, prod`
- [X] Translation (i18n)
- [X] Redux


## Libraries and Frameworks
#### Internal
- [X] [SCSS Framework](https://github.com/imransilvake/SCSS-Framework)

#### External 
- [X] [Create React App](https://github.com/facebook/create-react-app)
- [X] [Translation](https://github.com/i18next/react-i18next)
- [X] [Redux](https://redux.js.org/)


## Environments
In order to serve the build folder, run the following command first:
```
yarn global add serve
```

#### Local
```
build: yarn build
serve: yarn start
```

#### Staging
```
build: yarn build:staging
serve: yarn serve
```

#### Production
```
build: yarn build:production
serve: yarn serve
```


## Linting
#### JSX
```
yarn lint:es
```

#### SCSS
```
yarn lint:scss
```


## Extra
- Listen to port: `localhost:3000`
- Kill port: 4200: `sudo lsof -t -i tcp:3000 | xargs kill -9`
- Search and remove file recursively: `find . -name "*.DS_Store" -delete`
