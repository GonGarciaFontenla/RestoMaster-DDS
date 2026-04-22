import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const DB_URI = process.env.DB_URI;

    if (!DB_URI) {
      throw new Error("Falta la variable DB_URI en el archivo .env");
    }

    // Fix #19: se configuran timeouts explícitos para evitar que el servidor
    // espere indefinidamente si MongoDB no está disponible al arrancar.
    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ Conectado a MongoDB con Mongoose");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    throw err;
  }
};
