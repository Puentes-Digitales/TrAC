import { dbData } from "../";

export interface ICourse {
  id: string;
  name: string;
  description: string;
  tags: string;
  grading: string;
  grade_min: number;
  grade_max: number;
  grade_pass_min: number;
}

export const COURSE_TABLE = "course";

export const CourseTable = () => dbData<ICourse>(COURSE_TABLE);

// -------------------------------------------------------------------------------------
export interface ICourseStats {
  course_taken: string;
  year: number;
  term: number;
  p_group: number;
  n_total: number;
  n_finished: number;
  n_pass: number;
  n_fail: number;
  n_drop: number;
  histogram: string;
  avg_grade: number;
  n_grades: number;
  id: number;
  histogram_labels: string;
  color_bands: string;
}

export const COURSE_STATS_TABLE = "course_stats";

export const CourseStatsTable = () => dbData<ICourseStats>(COURSE_STATS_TABLE);

// -------------------------------------------------------------------------------------

export interface IParameter {
  id: number;
  loading_type: string;
  loading_date: Date;
}

export const PARAMETER_TABLE = "parameter";

export const ParameterTable = () => dbData<IParameter>(PARAMETER_TABLE);

// -------------------------------------------------------------------------------------
export interface IProgram {
  id: string;
  name: string;
  desc: string;
  tags: string;
  active: boolean;
  last_gpa: number;
}

export const PROGRAM_TABLE = "program";

export const ProgramTable = () => dbData<IProgram>(PROGRAM_TABLE);

// -------------------------------------------------------------------------------------

export interface IProgramStructure {
  id: number;
  program_id: string;
  curriculum: string;
  semester: number;
  course_id: string;
  credits: number;
  requisites: string;
  mention: string;
  course_cat: string;
  mode: string;
  credits_sct: number;
  tags: string;
}

export const PROGRAM_STRUCTURE_TABLE = "program_structure";

export const ProgramStructureTable = () =>
  dbData<IProgramStructure>(PROGRAM_STRUCTURE_TABLE);

// -------------------------------------------------------------------------------------#############################

export interface IRiskNotification {
  student_id: string;
  course_id: string;
  program_id: string;
  curriculum: string;
  risk_type: string;
  details: string;
  notified: boolean;
}

export const RISK_NOTIFICATION_TABLE = "risk_notification";

export const RiskNotificationTable = () =>
  dbData<IRiskNotification>(RISK_NOTIFICATION_TABLE);

// -------------------------------------------------------------------------------------##############################

export interface IExternalEvaluationStructure {
  id: number;
  program_id: string;
  curriculum: string;
  year: number;
  semester: number;
  external_evaluation_id: string;
  credits: number;
  requisites: string;
  mention: string;
  evaluation_cat: string;
  mode: string;
  credits_sct: number;
  tags: string;
}

export const EXTERNAL_EVALUATION_STRUCTURE_TABLE =
  "external_evaluation_structure";

export const ExternalEvaluationStructureTable = () =>
  dbData<IExternalEvaluationStructure>(EXTERNAL_EVALUATION_STRUCTURE_TABLE);

// -------------------------------------------------------------------------------------

export interface IStudent {
  id: string;
  name: string;
  state: string;
}

export const STUDENT_TABLE = "student";

export const StudentTable = () => dbData<IStudent>(STUDENT_TABLE);

// -------------------------------------------------------------------------------------

export interface IStudentCourse {
  id: number;
  year: number;
  term: number;
  student_id: string;
  course_taken: string;
  course_equiv: string;
  elect_equiv: string;
  registration: string;
  state: string;
  grade: number;
  p_group: number;
  comments: string;
  instructors: string;
  duplicates: number;
}

export const STUDENT_COURSE_TABLE = "student_course";

export const StudentCourseTable = () =>
  dbData<IStudentCourse>(STUDENT_COURSE_TABLE);

// -------------------------------------------------------------------------------------
export interface IStudentDropout {
  student_id: string;
  prob_dropout?: number;
  weight_per_semester?: string;
  active: boolean;
  model_accuracy?: number;
  explanation?: string;
}

export const STUDENT_DROPOUT_TABLE = "student_dropout";

export const StudentDropoutTable = () =>
  dbData<IStudentDropout>(STUDENT_DROPOUT_TABLE);

// -------------------------------------------------------------------------------------
export interface IStudentProgram {
  student_id: string;
  program_id: string;
  curriculum: string;
  start_year: number;
  mention: string;
  last_term: number;
  n_courses: number;
  n_passed_courses: number;
  completion: number;
}

export const STUDENT_PROGRAM_TABLE = "student_program";

export const StudentProgramTable = () =>
  dbData<IStudentProgram>(STUDENT_PROGRAM_TABLE);

// -------------------------------------------------------------------------------------

export interface IStudentTerm {
  id: number;
  student_id: string;
  year: number;
  term: number;
  situation: string;
  t_gpa: number;
  c_gpa: number;
  comments: string;
  program_id: string;
  curriculum: string;
  start_year: number;
  mention: string;
}

export const STUDENT_TERM_TABLE = "student_term";

export const StudentTermTable = () => dbData<IStudentTerm>(STUDENT_TERM_TABLE);
// -------------------------------------------------------------------------------------
export interface IStudentEmployed {
  id: string;
  student_id: string;
  employed: boolean;
  institution: string;
  educational_system: string;
  months_to_first_job: number;
  description: string;
}

export const STUDENT_EMPLOYED_TABLE = "student_employed";

export const StudentEmployedTable = () =>
  dbData<IStudentEmployed>(STUDENT_EMPLOYED_TABLE);

// --------------------------------------------------------------------------
export interface IStudentAdmission {
  student_id: string;
  active: boolean;
  type_admission: string;
}

export const STUDENT_ADMISSION_TABLE = "student_admission";

export const StudentAdmissionTable = () =>
  dbData<IStudentAdmission>(STUDENT_ADMISSION_TABLE);
// --------------------------------------------------------------------------

export interface IGroupedComplementaryInformation {
  id: number;
  program_id: string;
  curriculum: string;
  type_admission: string;
  cohort: string;
  total_students: number;
  university_degree_rate: number;
  retention_rate: number;
  average_time_university_degree: number;
  timely_university_degree_rate: number;
}

export const GROUPED_COMPLEMENTARY_INFORMATION_TABLE =
  "grouped_complementary_information";
export const GroupedComplementaryInformationTable = () =>
  dbData<IGroupedComplementaryInformation>(
    GROUPED_COMPLEMENTARY_INFORMATION_TABLE
  );

// --------------------------------------------------------------------------

export interface IGroupedEmployed {
  id: number;
  program_id: string;
  curriculum: string;
  type_admission: string;
  cohort: string;
  total_students: number;
  employed_rate: number;
  average_time_job_finding: number;
  employed_rate_educational_system: number;
}

export const GROUPED_EMPLOYED_TABLE = "grouped_employed";
export const GroupedEmployedTable = () =>
  dbData<IGroupedEmployed>(GROUPED_EMPLOYED_TABLE);

// --------------------------------------------------------------------------

export interface ICourseGroupedStats {
  id: number;
  course_id: string;
  program_id: string;
  curriculum: string;
  type_admission: string;
  cohort: string;
  year: number;
  term: number;
  n_students: number;
  n_total: number;
  n_finished: number;
  n_pass: number;
  n_fail: number;
  n_drop: number;
  histogram: string;
  histogram_labels: string;
  color_bands: string;
}

export const COURSE_GROUPED_STATS_TABLE = "course_grouped_stats";

export const CourseGroupedStatsTable = () =>
  dbData<ICourseGroupedStats>(COURSE_GROUPED_STATS_TABLE);
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
export interface IStudentExternalEvaluation {
  id: number;
  curriculum: number;
  year: number;
  term: number;
  student_id: string;
  external_evaluation_taken: string;
  topic: string;
  registration: string;
  state: string;
  grade: string;
  p_group: number;
  comments: string;
  duplicates: number;
}

export const STUDENT_EXTERNAL_EVALUATION_TABLE = "student_external_evaluation";

export const StudentExternalEvaluationTable = () =>
  dbData<IStudentExternalEvaluation>(STUDENT_EXTERNAL_EVALUATION_TABLE);
// -------------------------------------------------------------------------------------
export interface IExternalEvaluation {
  id: string;
  name: string;
  description: string;
  tags: string;
  grading: string;
  grade_min: number;
  grade_max: number;
  grade_pass_min: number;
}

export const EXTERNAL_EVALUATION_TABLE = "external_evaluation";

export const ExternalEvaluationTable = () =>
  dbData<IExternalEvaluation>(EXTERNAL_EVALUATION_TABLE);
// -------------------------------------------------------------------------------------
export interface IExternalEvaluationStats {
  external_evaluation_taken: string;
  year: number;
  term: number;
  topic: string;
  p_group: number;
  n_total: number;
  n_finished: number;
  n_pass: number;
  n_fail: number;
  n_drop: number;
  histogram: string;
  avg_grade: number;
  id: number;
  histogram_labels: string;
  color_bands: string;
}

export const EXTERNAL_EVALUATION_STATS_TABLE = "external_evaluation_stats";

export const ExternalEvaluationStatsTable = () =>
  dbData<IExternalEvaluationStats>(EXTERNAL_EVALUATION_STATS_TABLE);

// -------------------------------------------------------------------------------------
export interface IExternalEvaluationGroupedStats {
  id: number;
  external_evaluation_id: string;
  topic: string;
  program_id: string;
  curriculum: string;
  type_admission: string;
  cohort: string;
  year: number;
  term: number;
  n_students: number;
  p_group: number;
  n_total: number;
  n_finished: number;
  n_pass: number;
  n_fail: number;
  n_drop: number;
  histogram: string;
  histogram_labels: string;
  color_bands: string;
}

export const EXTERNAL_EVALUATION_GROUPED_STATS_TABLE =
  "external_evaluation_grouped_stats";

export const ExternalEvaluationGroupedStatsTable = () =>
  dbData<IExternalEvaluationGroupedStats>(
    EXTERNAL_EVALUATION_GROUPED_STATS_TABLE
  );
// -------------------------------------------------------------------------------------

export interface IPerformanceByLoad {
  id: number;
  program_id: string;
  student_cluster: number;
  courseload_unit: string;
  courseload_lb: number;
  courseload_ub: number;
  hp_value: number;
  mp_value: number;
  lp_value: number;
  message_title: string;
  message_text: string;
  cluster_label: string;
  hp_count?: number;
  mp_count?: number;
  lp_count?: number;
  courseload_label: string;
  n_total?: number;
}

export const PERFORMANCE_BY_LOAD_TABLE = "performance_by_load";

export const PerformanceByLoadTable = () =>
  dbData<IPerformanceByLoad>(PERFORMANCE_BY_LOAD_TABLE);

// -------------------------------------------------------------------------------------

export interface IStudentCluster {
  student_id: string;
  program_id: string;
  cluster: number;
}

export const STUDENT_CLUSTER_TABLE = "student_cluster";

export const StudentClusterTable = () =>
  dbData<IStudentCluster>(STUDENT_CLUSTER_TABLE);

// --------------------------------------------------------------------------
