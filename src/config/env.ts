// Importamos las dependencias necesarias. 'dotenv/config' carga las variables de entorno
// desde un archivo .env en el proceso de ejecución, y 'joi' se utiliza para la validación de esquemas.
import 'dotenv/config';
import * as joi from 'joi';

// Definimos una interfaz que describe la estructura de las variables de entorno que esperamos.
interface EnvVars {
  PORT: number; // Esperamos una variable PORT de tipo número.
  DATABASE_URL: string;
}

// Creamos un esquema de validación usando Joi. Este esquema asegura que la variable PORT es obligatoria.
const envsShema = joi
  .object({
    PORT: joi.number().required(), // Validamos que PORT sea un número y es requerido.
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true); // Permitimos otras variables de entorno no especificadas en la validación.

const { error, value } = envsShema.validate(process.env); // Validamos las variables de entorno actuales.

if (error) {
  // Si hay un error en la validación, lanzamos una excepción con el mensaje de error.
  throw new Error(`Config validation error: ${error.message}`);
}

// Asignamos las variables de entorno validadas a una constante envVars de tipo EnvVars.
const envVars: EnvVars = value;

// Exportamos un objeto 'envs' que contiene la variable 'port' extraída de envVars.
export const envs = {
  port: envVars.PORT, // Permitimos acceder a la variable PORT de manera estructurada.
  dataBaseUrl: envVars.DATABASE_URL,
};
