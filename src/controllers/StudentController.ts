import { Request, Response } from 'express';
import { students, addStudent, getStudent, updateStudentGrade } from '../models/StudentModel';

function getAllStudents(req: Request, res: Response): void {
  res.json(students);
}

function createNewStudent(req: Request, res: Response): void {
  const studentData = req.body as NewStudentRequest;
  const didAddStudent = addStudent(studentData);

  if (!didAddStudent) {
    res.sendStatus(409); // The student was already in the dataset
    return; // terminate immediately
  }

  res.sendStatus(201); // The student was created
}

function getStudentByName(req: Request, res: Response): void {
  const { studentName } = req.params as StudentNameParams;
  const student = getStudent(studentName);

  if (!student) {
    res.sendStatus(404);
    return;
  }

  res.json(student);
}

function calculateFinalExamScore(
  currentAverage: number,
  finalExamWeight: number,
  targetScore: number
): number {
  const currentOverall = currentAverage * ((100 - finalExamWeight) / 100);

  return ((targetScore - currentOverall) / finalExamWeight) * 100;
}

function getFinalExamScores(req: Request, res: Response): void {
  const { studentName } = req.params as StudentNameParams;
  const student = getStudent(studentName);
  if (!student) {
    res.sendStatus(404);
    return;
  }

  const { currentAverage, weights } = student;
  const neededForA = calculateFinalExamScore(currentAverage, weights.finalExamWeight, 90);
  const neededForB = calculateFinalExamScore(currentAverage, weights.finalExamWeight, 80);
  const neededForC = calculateFinalExamScore(currentAverage, weights.finalExamWeight, 70);
  const neededForD = calculateFinalExamScore(currentAverage, weights.finalExamWeight, 60);

  res.json({
    neededForA,
    neededForB,
    neededForC,
    neededForD,
  });
}

function getLetterGrade(score: number): string {
  if (score >= 90) {
    return 'A';
  }
  if (score >= 80) {
    return 'B';
  }
  if (score >= 70) {
    return 'C';
  }
  if (score >= 60) {
    return 'D';
  }

  return 'F';
}

function calcFinalScore(req: Request, res: Response): void {
  const { studentName } = req.params as StudentNameParams;
  const student = getStudent(studentName);
  if (!student) {
    res.sendStatus(404);
    return;
  }

  const { grade } = req.body as AssignmentGrade;

  const { currentAverage, weights } = student;
  const currentOverall = currentAverage * ((100 - weights.finalExamWeight) / 100);
  const overallScore = currentOverall + (grade * weights.finalExamWeight) / 100;
  const letterGrade = getLetterGrade(overallScore);
  res.json({
    overallScore,
    letterGrade,
  });
}

function updateGrade(req: Request, res: Response): void {
  const { studentName, assignmentName } = req.params as GradeUpdateParams;
  const { grade } = req.body as AssignmentGrade;

  const didUpdateGrade = updateStudentGrade(studentName, assignmentName, grade);
  if (!didUpdateGrade) {
    // Either the student name or the assignment wasn't found
    res.sendStatus(404);
    return;
  }

  res.sendStatus(200);
}

export {
  getAllStudents,
  createNewStudent,
  getStudentByName,
  updateGrade,
  getFinalExamScores,
  calcFinalScore,
};
