import { Environment } from "./environment.config";
import ExpressConfig from "configuration/express.config";

Environment();

const app = ExpressConfig();

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
  console.log(`Server Running on Port http://localhost:${PORT}`);
});
