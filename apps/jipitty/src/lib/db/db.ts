import { Client, connect } from "@planetscale/database"
import { z } from "zod"
import { drizzle } from "drizzle-orm/planetscale-serverless"
import { migrate } from "drizzle-orm/mysql2/migrator"
import {
	DATABASE_HOST,
	DATABASE_PASSWORD,
	DATABASE_USERNAME
} from "./environment"

export const config = {
	host: DATABASE_HOST,
	username: DATABASE_USERNAME,
	password: DATABASE_PASSWORD
}

const connection = connect(config)

export const db = drizzle(connection)

export const createDatabaseConnection = () => {
	const connection = new Client(config).connection()
	return connection
}

// await migrate(db as any, { migrationsFolder: "drizzle" });
