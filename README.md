# React Seed
React seed is based on create-react-app and it incorporates many best practices typically needed in Enterprise apps.


## Content
- [X] SCSS Inclusion
- [X] Linting: `scss, js`
- [X] Build Environments: `dev, stag, next, prod`
- [X] Translation (i18n)
- [X] Redux


## Libraries and Frameworks
#### Internal
- [X] [SCSS Framework](https://github.com/imransilvake/SCSS-Framework)

#### External 
- [X] [Create React App](https://github.com/facebook/create-react-app)
- [X] [Translation](https://github.com/i18next/react-i18next)
- [X] [Redux](https://redux.js.org/)


## Commands
#### Update & Install
```
update: npm update
install: npm install
```

#### Environments: Serve & Build
###### Local
```
serve: yarn start
build: yarn build
```

###### Staging
```
serve: yarn serve.app.stag
build: yarn build.app.stag
```

###### Next
```
serve: yarn serve.app.next
build: yarn build.app.next
```

###### Production
```
serve: yarn serve.app.prod
build: yarn build.app.prod
```


## Linting
###### JSX
```
npm run es
```

###### SCSS
```
npm run lint:scss
```

## Extra
- Listen to port: `localhost:3000`
- Kill port: 4200: `sudo lsof -t -i tcp:3000 | xargs kill -9`
- Search and remove file recursively: `find . -name "*.DS_Store" -delete`
