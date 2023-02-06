import express, { Express } from 'express';
import {
  getAllStudents,
  createNewStudent,
  getStudentByName,
} from './controllers/StudentController';

const PORT = 8080;

const app: Express = express();
app.use(express.json());

app.get('/', getAllStudents);
app.post('/students', createNewStudent);

app.get('/students/:studentName', getStudentByName);

app.listen(PORT, () => {
  console.log(`Listening on http://127.0.0.1:${PORT}`);
});
