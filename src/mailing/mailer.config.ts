/* eslint-disable prettier/prettier */
import { Transporter } from 'nodemailer';

export const transporterConfig: Transporter = {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true pour le port 465, false pour les autres ports
    auth: {
        user: 'votre@email.com',
        pass: 'votre_mot_de_passe',
    },
};