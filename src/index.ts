import createServer from "./base/server";
import config from "./config";

const PORT = config.PORT as number;
const server = createServer();

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
