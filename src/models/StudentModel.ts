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

export { students, addStudent, getStudent };
