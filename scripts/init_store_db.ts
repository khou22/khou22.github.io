import { initStoreDb } from "../src/data/store/storeDbManager";

async function main() {
  console.log("Initializing store database...");
  try {
    await initStoreDb();
    console.log("Store database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize store database:", error);
    process.exit(1);
  }
}

main();
