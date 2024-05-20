import mongoose from "mongoose";
import colors from 'colors';

const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    if (connection) {
      console.log(colors.bgBlue(`Connected to Database successfully: ${connection.connection.host}`));
    }
  } catch (error) {
    console.log("An error occurred while connecting to Data base", error);
    throw error;
  }
};


export default connectToDb;
