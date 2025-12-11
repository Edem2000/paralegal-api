const esbuild = require("esbuild");

const externals = [
    // native / опциональные вещи, которые мы не хотим бандлить
    "realm",

    // опциональные модули Nest, которые не установлены, но require-ятся лениво
    "@nestjs/websockets",
    "@nestjs/websockets/socket-module",
    "@nestjs/microservices",
    "@nestjs/microservices/microservices-module",
];

esbuild
    .build({
        entryPoints: ["src/app/services/core/main.ts"], // твой прод-энтрипоинт
        bundle: true,
        platform: "node",
        target: "node18",
        outfile: "bundle/server.js",

        format: "cjs",
        sourcemap: false,
        minify: true,
        legalComments: "none",

        external: externals,

        // ВАЖНО: esbuild сам читает baseUrl + paths из tsconfig
        tsconfig: "tsconfig.json",

        // чуть более подробный лог
        logLevel: "info",
    })
    .then(() => {
        console.log("✔ Backend bundled successfully");
    })
    .catch((err) => {
        console.error("✖ Backend bundle failed");
        console.error(err);
        process.exit(1);
    });
