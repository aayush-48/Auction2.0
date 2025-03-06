import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), "public/data")
    const fileContents = await fs.readFile(jsonDirectory + "/players.json", "utf8")
    const players = JSON.parse(fileContents)
    return NextResponse.json(players)
  } catch (error) {
    console.error("Error reading players data:", error)
    return NextResponse.json({ error: "Failed to load players" }, { status: 500 })
  }
}

