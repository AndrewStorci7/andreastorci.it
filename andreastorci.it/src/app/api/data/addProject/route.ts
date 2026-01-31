import { PersonalData } from "@ctypes";
import { NextResponse } from "next/server";
import db from "@lib/mongodb";
import z from "zod"

const collection = db.collection<PersonalData>("it-IT");

const ProjectSchema = z.object({
    name: z.string().max(50),
    type: z.string().max(50),
    description: z.string().max(20000),
    // technologies: z.string()
})