const students: StudentManager = {};

function calculateAverage(weights: CourseGrades): number {
  let total = 0;

  for (const grade of weights.assignmentWeights) {
    total += (grade.grade * grade.weight) / (100 - weights.finalExamWeight);
  }

  return total;
}

function addStudent(newStudentData: NewStudentRequest): boolean {
  const { name, weights } = newStudentData;
  if (name in students) {
    return false;
  }

  const currentAverage = calculateAverage(weights);

  const student: Student = { name, weights, currentAverage };

  students[name] = student;
  return true;
}

function getStudent(studentName: string): Student | undefined {
  if (!(studentName in students)) {
    return undefined;
  }

  return students[studentName];
}

function updateStudentGrade(
  studentName: string,
  assignmentName: string,
  newGrade: number
): boolean {
  const student = getStudent(studentName);
  if (!student) {
    console.log(`Didn't find person ${studentName}`);
    return false;
  }

  const assignment = student.weights.assignmentWeights.find(
    (grade: CourseGrade) => grade.name === assignmentName
  );

  if (!assignment) {
    console.log(`Didn't find assignment ${assignmentName}`);
    return false;
  }

  assignment.grade = newGrade;
  student.currentAverage = calculateAverage(student.weights);
  return true;
}

export { students, addStudent, getStudent, updateStudentGrade };
