import { createAccessControl } from "better-auth/plugins/access";
 
export const statement = {
    user: [
        // Permiso especifico para leer cada aspecto del usuario
        "read:own:id",
        "read:own:name",
        "read:own:email",
        "read:own:image",
        "read:own:createdAt",
        "read:own:updatedAt",
        "read:own:role",
        "read:own:banned",
        "read:own:banReason",
        "read:own:banExpires",

        // Permiso especifico para leer cada aspecto de otros usuarios
        "read:other:id",
        "read:other:name",
        "read:other:email",
        "read:other:image",
        "read:other:createdAt",
        "read:other:updatedAt",
        "read:other:role",
        "read:other:banned",
        "read:other:banReason",
        "read:other:banExpires",

        // Permiso especifico para actualizar cada aspecto del usuario
        "update:own:name",
        "update:own:email",
        "update:own:image",

        // Permiso especifico para actualizar cada aspecto de otros usuarios
        "update:other:name",
        "update:other:email",
        "update:other:image",

        // Permiso especifico para banear a otros usuarios
        "ban:other",
        "unban:other",
    ],
} as const;
 
const ac = createAccessControl(statement);
 
export const user = ac.newRole({ 
}); 
 
export const admin = ac.newRole({ 
});