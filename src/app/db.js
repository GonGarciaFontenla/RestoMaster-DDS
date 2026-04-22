import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const DB_URI = process.env.DB_URI;

    if (!DB_URI) {
      throw new Error("Falta la variable DB_URI en el archivo .env");
    }

    await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ Conectado a MongoDB con Mongoose");

    // Fix #16: listener de desconexión para detectar pérdida de conexión en runtime.
    // Sin esto, el servidor acepta requests que fallan silenciosamente.
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB desconectado. Las operaciones de DB fallarán hasta reconexión.");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconectado.");
    });
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    throw err;
  }
};
