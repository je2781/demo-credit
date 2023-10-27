import api from '../api';
import { config } from "dotenv";
config({ path: '../../.env' });

api.listen(+process.env.PORT! || 3000);
