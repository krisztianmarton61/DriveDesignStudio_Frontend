# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Deploy

# Create a UserPool in aws cognito

- login only with email

# flow

Ket lehetosege van a vevonek:

1. General egy kepet

- a kep elmentesre kerul es mindenki szamara lathato lesz, bekerul egy s3 bucketbe
- amennyiben egy kep nem kerul megvasarlasra 30 napig, akkor torlesre kerul
  Vasarlas eseten:
- a kep szemelyreszabasa utan bekerul egy masik s3 bucket-be amely a vasarlohoz kapcsolodik

Informaciok egy keprol:

- kep id
- utoljara mikor volt megvasarolva
- generalo script
- hanyszor volt megvasarolva
- kedvencekhez hanyan adtak
- generalas datuma
- kategoria

Informaciok a vasarlohoz kapcsolt keprol

- order tablaban elmentve

2. Feltolt egy kepet

- mely szemelyreszabas utan fog bekerulni az s3-bucket-ba amely a vasarlohoz kapcsolodik
  Informaciok a vasarlohoz kapcsolt keprol
- order tablaban elmentve

## Cognito User pool létrehozása

- No verification needed
