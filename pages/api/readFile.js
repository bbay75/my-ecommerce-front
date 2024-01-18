// pages/api/readFile.js

import fs from "fs";

export default async (req, res) => {
  try {
    const data = fs.readFileSync("path/to/your/file.txt", "utf-8");
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error reading file" });
  }
};
