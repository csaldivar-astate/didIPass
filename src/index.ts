import express, { Express } from 'express';
import {
  getAllStudents,
  createNewStudent,
  getStudentByName,
  updateGrade,
  getFinalExamScores,
  calcFinalScore,
} from './controllers/StudentController';

const app: Express = express();
app.use(express.json());
const PORT = 8008;

app.get('/api/students', getAllStudents);
app.post('/api/students', createNewStudent);

app.get('/api/students/:studentName', getStudentByName);
app.get('/api/students/:studentName/finalExam', getFinalExamScores);

app.post('/api/students/:studentName/finalExam', calcFinalScore);

app.post('/api/students/:studentName/grades/:assignmentName', updateGrade);

app.listen(PORT, () => {
  console.log(`Listening on http://127.0.0.1:${PORT}`);
});
