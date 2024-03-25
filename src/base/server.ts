import express from "express";
import connectToDatabase from "./db";

export default function createServer(){
    const server = express();

    connectToDatabase()

    return server;
}