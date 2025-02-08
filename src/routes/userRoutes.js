const express = require('express');
const User = require('../models/user');

const router = express.Router();
router.use(express.json()); // ✅ Middleware para JSON

// ✅ Endpoint para sincronizar creación de usuarios desde otros microservicios
router.post('/sync-create', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-create:', req.body);
    const { id, first_name, last_name, identification_number, email, password_hash, phone_number } = req.body;

    try {
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            await User.create({ id, first_name, last_name, identification_number, email, password_hash, phone_number });
            console.log(`✅ Usuario con ID ${id} sincronizado en la base de Crear Usuario`);
        } else {
            console.log(`⚠️ Usuario con ID ${id} ya existe en la base de Crear Usuario`);
        }

        res.status(200).send({ message: `Usuario con ID ${id} sincronizado correctamente en Crear Usuario` });
    } catch (error) {
        console.error('❌ Error sincronizando usuario en Crear Usuario:', error);
        res.status(500).send({ error: 'Failed to sync user creation' });
    }
});

// ✅ Endpoint para sincronizar actualización de usuarios
router.post('/sync-update', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-update:', req.body);
    const { id, first_name, last_name, identification_number, email, password_hash, phone_number } = req.body;

    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.update({ first_name, last_name, identification_number, email, password_hash, phone_number });
            console.log(`✅ Usuario con ID ${id} actualizado en la base de Crear Usuario`);
        } else {
            console.log(`⚠️ Usuario con ID ${id} no encontrado en la base de Crear Usuario`);
        }

        res.status(200).send({ message: `Usuario con ID ${id} actualizado correctamente en Crear Usuario` });
    } catch (error) {
        console.error('❌ Error sincronizando actualización de usuario en Crear Usuario:', error);
        res.status(500).send({ error: 'Failed to sync user update' });
    }
});

// ✅ Endpoint para sincronizar eliminación de usuarios
router.post('/sync-delete', async (req, res) => {
    console.log('📌 Solicitud recibida en /sync-delete:', req.body);
    const { id } = req.body;

    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            console.log(`✅ Usuario con ID ${id} eliminado en la base de Crear Usuario`);
        } else {
            console.log(`⚠️ Usuario con ID ${id} no encontrado en la base de Crear Usuario`);
        }

        res.status(200).send({ message: `Usuario con ID ${id} eliminado correctamente en Crear Usuario` });
    } catch (error) {
        console.error('❌ Error sincronizando eliminación de usuario en Crear Usuario:', error);
        res.status(500).send({ error: 'Failed to sync user delete' });
    }
});

// ✅ Endpoint para obtener todos los usuarios
router.get('/get-all-users', async (req, res) => {
    try {
        console.log("📌 Solicitando todos los usuarios de UserService...");
        const users = await User.findAll();
        console.table(users.map(u => ({ id: u.id, email: u.email }))); // ✅ Imprimir en tabla

        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error obteniendo usuarios:", error);
        res.status(500).json({ error: "Error obteniendo usuarios" });
    }
});

module.exports = router; // ✅ Exportar correctamente
