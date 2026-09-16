// import Sequelize and DataTypes
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const databaseUrl = process.env.DATABASE_URL_UNPOOLED;

const dbName = process.env.PGDATABASE;
const dbUsername = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbURL = process.env.PGHOST_UNPOOLED;
const PORT = process.env.PORT || 5432;

// DB connection
// db_name , user, password, { configulation option }
const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbURL,
  port: PORT,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// define databse schema
// จากตาราง Product และต้องกำหนดทุกอันให้ถูก
const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// function connect to DB
const connectDB = async () => {
  // try catch เพื่อจับ error
  try {
    // รอ ให้เชื่อม database
    await sequelize.authenticate();
    // แสดงให้ดูว่าเชื่อมแล้ว
    console.log("Connected to PostgresSQL!");
    // ให้ table sync กัน
    await sequelize.sync({ alter: false });
    // แสดงให้ดูว่า sync แล้ว
    console.log("Table synchronize!");
    // จับ error
  } catch (error) {
    // แสดงให้ดูว่า connect fail และ แสดง error
    console.error("Connection failed!", error);
    // จบการทำงานแบบ เกิด Error จนโปรแกรมไปต่อไม่ได้
    process.exit(1);
  }
};

// ส่งออก
export { sequelize, Product, connectDB };
