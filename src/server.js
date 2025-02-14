const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const resolvers = require('./graphql/resolvers');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use(userRoutes); // ✅ Registrar correctamente las rutas

console.log('📌 Microservicio de Crear Usuario iniciando...');

// ✅ Verificar si el archivo `schema.graphql` existe
const schemaPath = path.join(__dirname, 'graphql', 'schema.graphql');
if (!fs.existsSync(schemaPath)) {
    console.error('❌ ERROR: El archivo schema.graphql no existe en', schemaPath);
    process.exit(1);
}

// ✅ Leer el esquema GraphQL
const typeDefs = fs.readFileSync(schemaPath, 'utf-8');

// ✅ Sincronizar base de datos antes de iniciar los servidores
sequelize.sync().then(() => {
    console.log('✅ Database synced successfully!');

    const server = new ApolloServer({ typeDefs, resolvers });

    server.listen({ port: 4005 }).then(({ url }) => {
        console.log(`🚀 GraphQL server papito ready at ${url}`);
    });

    app.listen(5005, () => {
        console.log(`✅ REST server listening on port 5005`);
    });
}).catch(err => {
    console.error('❌ Error syncing database:', err);
});
