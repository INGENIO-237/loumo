import supertest from "supertest"
import createServer from "../src/base/server";

const server = createServer() 
const apiClient = supertest(server)

export default apiClient