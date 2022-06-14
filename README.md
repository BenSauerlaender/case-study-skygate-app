# case-study-skygate-app

I'm creating a simple web app as part of my internship at SkyGate internetworking GmbH

This is the Frontend: Vue App.

Im using Vue3 with Vite, TS, Composition API, Pinia and Vue-Router.

## Project Setup

```sh
npm install
```

### Start Development Environment

1. Start the [Backend](https://github.com/BenSauerlaender/case-study-skygate-api) (default port: 3000)

    Tip: You can easily seed the database with:

    ```sh
    php scripts/seed.php <seed>
    ```

    useful seeds: "reset", "100Users", "1Admin" (more in sql/seeds/)

2. Start the dev-server (default port: 3001)

    ```sh
    npm run dev
    ```

3. Visit localhost:3001 in your browser of choice

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
