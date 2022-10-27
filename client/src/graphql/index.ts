import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: string;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: Record<string,any>;
};

export type Admission = {
  type_admission: Scalars['String'];
};

export type AuthResult = {
  error?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type BandColor = {
  color: Scalars['String'];
  max: Scalars['Float'];
  min: Scalars['Float'];
};

export type Course = {
  bandColors: Array<BandColor>;
  code: Scalars['String'];
  credits: Array<Credit>;
  flow: Array<Course>;
  historicalDistribution: Array<DistributionValue>;
  /** Course-Semester-Curriculum-Program ID  */
  id: Scalars['Int'];
  mention: Scalars['String'];
  mode: Scalars['String'];
  name: Scalars['String'];
  requisites: Array<Course>;
};

export type CourseGroupedStats = {
  cohort: Scalars['String'];
  color_bands: Array<BandColor>;
  course_id: Scalars['String'];
  curriculum: Scalars['String'];
  distribution: Array<DistributionValue>;
  id: Scalars['Float'];
  n_drop: Scalars['Float'];
  n_fail: Scalars['Float'];
  n_finished: Scalars['Float'];
  n_pass: Scalars['Float'];
  n_students: Scalars['Float'];
  n_total: Scalars['Float'];
  program_id: Scalars['String'];
  term: Scalars['Float'];
  type_admission: Scalars['String'];
  year: Scalars['Float'];
};

export type Credit = {
  label: Scalars['String'];
  value: Scalars['Int'];
};

export type Curriculum = {
  id: Scalars['String'];
  semesters: Array<Semester>;
};


export type DistributionValue = {
  label: Scalars['String'];
  value: Scalars['Int'];
};

export type Dropout = {
  active: Scalars['Boolean'];
  explanation?: Maybe<Scalars['String']>;
  model_accuracy?: Maybe<Scalars['Float']>;
  prob_dropout?: Maybe<Scalars['Float']>;
};


export type Employed = {
  description?: Maybe<Scalars['String']>;
  educational_system?: Maybe<Scalars['Boolean']>;
  employed?: Maybe<Scalars['Boolean']>;
  institution?: Maybe<Scalars['String']>;
  months_to_first_job?: Maybe<Scalars['Float']>;
};

export type ExternalEvaluation = {
  bandColors: Array<BandColor>;
  code: Scalars['String'];
  historicalDistribution: Array<DistributionValue>;
  /** ExternalEvaluation-Semester-Curriculum-Program ID  */
  id: Scalars['Int'];
  mention: Scalars['String'];
  name: Scalars['String'];
  year: Scalars['Float'];
};

export type ExternalEvaluationGroupedStats = {
  cohort: Scalars['String'];
  color_bands: Array<BandColor>;
  curriculum: Scalars['String'];
  distribution: Array<DistributionValue>;
  external_evaluation_id: Scalars['String'];
  id: Scalars['Float'];
  n_drop: Scalars['Float'];
  n_fail: Scalars['Float'];
  n_finished: Scalars['Float'];
  n_pass: Scalars['Float'];
  n_students: Scalars['Float'];
  n_total: Scalars['Float'];
  program_id: Scalars['String'];
  term: Scalars['Float'];
  topic: Scalars['String'];
  type_admission: Scalars['String'];
};

export type FeedbackAnswer = {
  answer: Scalars['String'];
  question: FeedbackQuestion;
};

export type FeedbackAnswerInput = {
  form: Scalars['Int'];
  questions: Array<FeedbackAnswerQuestionInput>;
};

export type FeedbackAnswerQuestionInput = {
  answer: Scalars['String'];
  question: Scalars['Int'];
};

export type FeedbackForm = {
  id: Scalars['Int'];
  name: Scalars['String'];
  priority: Scalars['Int'];
  questions: Array<FeedbackQuestion>;
};

export type FeedbackQuestion = {
  id: Scalars['Int'];
  options: Array<FeedbackQuestionOption>;
  priority: Scalars['Int'];
  question: Scalars['String'];
  type: FeedbackQuestionType;
};

export type FeedbackQuestionOption = {
  text: Scalars['String'];
  value: Scalars['Int'];
};

export type FeedbackQuestionOptionInput = {
  text: Scalars['String'];
  value: Scalars['Int'];
};

/** Type of question in a feedback form */
export enum FeedbackQuestionType {
  MultipleAnswer = 'MultipleAnswer',
  OpenText = 'OpenText',
  SingleAnswer = 'SingleAnswer'
}

export type FeedbackResult = {
  answers: Array<FeedbackAnswer>;
  form: FeedbackForm;
  timestamp: Scalars['DateTime'];
  user: User;
};

export type GroupedComplementary = {
  average_time_university_degree?: Maybe<Scalars['Float']>;
  cohort: Scalars['String'];
  current_retention_rate: Scalars['Float'];
  curriculum: Scalars['String'];
  inactive_time_rate?: Maybe<Scalars['Float']>;
  program_id: Scalars['String'];
  retention_rate: Scalars['Float'];
  timely_university_degree_rate?: Maybe<Scalars['Float']>;
  total_students: Scalars['Float'];
  type_admission: Scalars['String'];
  university_degree_rate?: Maybe<Scalars['Float']>;
};

export type GroupedEmployed = {
  average_time_job_finding: Scalars['Float'];
  cohort: Scalars['String'];
  curriculum: Scalars['String'];
  employed_rate: Scalars['Float'];
  employed_rate_educational_system: Scalars['Float'];
  program_id: Scalars['String'];
  total_students: Scalars['Float'];
  type_admission: Scalars['String'];
};

export type IndirectTakeCourse = {
  course: Course;
  requisitesUnmet: Array<Scalars['String']>;
};


export type LockedUserResult = {
  mailResult: Scalars['JSONObject'];
  users: Array<User>;
};

export type MultipleLockedUserResult = {
  mailResults: Array<Scalars['JSONObject']>;
  users: Array<User>;
};

export type Mutation = {
  addUsersPrograms: Array<User>;
  answerFeedbackForm: Scalars['Boolean'];
  deleteUser: Scalars['Int'];
  directTakeCourses: Array<Course>;
  editConfig: Scalars['JSONObject'];
  feedbackResultsCsv: Scalars['String'];
  indirectTakeCourses: Array<IndirectTakeCourse>;
  lockMailUser: LockedUserResult;
  login: AuthResult;
  logout: Scalars['Boolean'];
  mailAllLockedUsers: Array<Scalars['JSONObject']>;
  NotificateUsers: Array<Scalars['JSONObject']>;
  performanceLoadAdvices: Array<PerformanceByLoad>;
  program: Program;
  readAnonUrl: Scalars['String'];
  ReNotificateUsers: Array<Scalars['JSONObject']>;
  resetDataLoadersCache: Scalars['Int'];
  resetPersistence: Scalars['Int'];
  sendCredentials: Scalars['String'];
  setPersistenceValue: Persistence;
  student?: Maybe<Student>;
  track: Scalars['Boolean'];
  unlock: AuthResult;
  updateUserPrograms: Array<User>;
  upsertUsers: Array<User>;
};


export type MutationAddUsersProgramsArgs = {
  user_programs: Array<UserProgram>;
};


export type MutationAnswerFeedbackFormArgs = {
  answer: FeedbackAnswerInput;
};


export type MutationDeleteUserArgs = {
  email: Scalars['EmailAddress'];
};


export type MutationDirectTakeCoursesArgs = {
  program_id?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};


export type MutationEditConfigArgs = {
  name: Scalars['String'];
  value: Scalars['String'];
};


export type MutationIndirectTakeCoursesArgs = {
  program_id?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};


export type MutationLockMailUserArgs = {
  email: Scalars['EmailAddress'];
};


export type MutationLoginArgs = {
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
};


export type MutationNotificateUsersArgs = {
  body: Scalars['String'];
  closing: Scalars['String'];
  farewell: Scalars['String'];
  footer: Scalars['String'];
  header: Scalars['String'];
  riskBody: Scalars['String'];
  riskFooter: Scalars['String'];
  riskGif: Scalars['String'];
  riskJSON: Scalars['String'];
  riskTitle: Scalars['String'];
  subject: Scalars['String'];
};


export type MutationPerformanceLoadAdvicesArgs = {
  program_id?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};


export type MutationProgramArgs = {
  id?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};


export type MutationReNotificateUsersArgs = {
  content: Scalars['String'];
  counter: Scalars['Float'];
  email: Scalars['String'];
  id: Scalars['Float'];
  parameters: Scalars['String'];
  risks?: Maybe<Scalars['String']>;
  risksJSON: Scalars['String'];
};


export type MutationResetPersistenceArgs = {
  user: Scalars['String'];
};


export type MutationSendCredentialsArgs = {
  email: Scalars['String'];
  LastName: Scalars['String'];
  Name: Scalars['String'];
  type: Scalars['Boolean'];
};


export type MutationSetPersistenceValueArgs = {
  data: Scalars['JSONObject'];
  key: Scalars['String'];
};


export type MutationStudentArgs = {
  program_id?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
};


export type MutationTrackArgs = {
  data: Scalars['String'];
  datetime_client: Scalars['DateTime'];
};


export type MutationUnlockArgs = {
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
  unlockKey: Scalars['String'];
};


export type MutationUpdateUserProgramsArgs = {
  userPrograms: UpdateUserPrograms;
};


export type MutationUpsertUsersArgs = {
  users: Array<UpsertedUser>;
};

export type Notifications = {
  content: Scalars['String'];
  counter: Scalars['Float'];
  date: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['Int'];
  parameters: Scalars['String'];
  risks?: Maybe<Scalars['String']>;
};

export type Parameter = {
  id: Scalars['Int'];
  loading_date: Scalars['DateTime'];
  loading_type: Scalars['String'];
};

export type PerformanceByLoad = {
  adviceParagraph: Scalars['String'];
  adviceTitle: Scalars['String'];
  clusterLabel: Scalars['String'];
  failRateHigh: Scalars['Int'];
  failRateLow: Scalars['Int'];
  failRateMid: Scalars['Int'];
  id: Scalars['Int'];
  isStudentCluster: Scalars['Boolean'];
  loadUnit: PerformanceLoadUnit;
  lowerBoundary: Scalars['Float'];
  upperBoundary: Scalars['Float'];
};

/** Unit used to distinguish load in the foreplan */
export enum PerformanceLoadUnit {
  Credits = 'Credits'
}

export type Persistence = {
  data: Scalars['JSONObject'];
  key: Scalars['String'];
  timestamp: Scalars['DateTime'];
  user: Scalars['String'];
};

export type Program = {
  active: Scalars['Boolean'];
  courseGroupedStats: Array<CourseGroupedStats>;
  curriculums: Array<Curriculum>;
  desc: Scalars['String'];
  externalEvaluationGroupedStats: Array<ExternalEvaluationGroupedStats>;
  groupedComplementary: Array<GroupedComplementary>;
  groupedEmployed: Array<GroupedEmployed>;
  id: Scalars['String'];
  lastGPA: Scalars['Float'];
  name: Scalars['String'];
  type_admission: Scalars['String'];
};

export type Query = {
  /** Check unlockKey combination, if it's valid, returns null, if it's invalid, returns an error message. */
  checkUnlockKey?: Maybe<Scalars['String']>;
  config: Scalars['JSONObject'];
  currentUser?: Maybe<AuthResult>;
  feedbackResults: Array<FeedbackResult>;
  getPersistenceValue?: Maybe<Persistence>;
  groupedSpecialTypesAdmission: Scalars['String'];
  myPrograms: Array<Program>;
  NotificationsData: Array<Notifications>;
  parameters: Array<Parameter>;
  programs: Array<Program>;
  riskNotification: Array<RiskNotification>;
  students: Array<Student>;
  students_filter: Array<Student>;
  trackInfo: Array<Track>;
  unansweredForm?: Maybe<FeedbackForm>;
  userPersistences: Array<Persistence>;
  users: Array<User>;
};


export type QueryCheckUnlockKeyArgs = {
  email: Scalars['EmailAddress'];
  unlockKey: Scalars['String'];
};


export type QueryFeedbackResultsArgs = {
  user_ids?: Maybe<Array<Scalars['String']>>;
};


export type QueryGetPersistenceValueArgs = {
  key: Scalars['String'];
};


export type QueryRiskNotificationArgs = {
  program_id: Scalars['String'];
  risk_type: Scalars['String'];
};


export type QueryStudentsArgs = {
  last_n_years?: Maybe<Scalars['Int']>;
  program_id: Scalars['String'];
};


export type QueryStudents_FilterArgs = {
  curriculum: Scalars['String'];
  grouped: Scalars['Boolean'];
  program_id: Scalars['String'];
};


export type QueryTrackInfoArgs = {
  maxDate: Scalars['DateTime'];
  minDate: Scalars['DateTime'];
};


export type QueryUserPersistencesArgs = {
  user: Scalars['String'];
};

export type RiskNotification = {
  cohort: Scalars['String'];
  course_id: Scalars['String'];
  curriculum: Scalars['String'];
  details: Scalars['String'];
  notified: Scalars['Boolean'];
  program_id: Scalars['String'];
  risk_type: Scalars['String'];
  student_id: Scalars['String'];
};

export type Semester = {
  courses: Array<Course>;
  externalEvaluations: Array<ExternalEvaluation>;
  id: Scalars['Int'];
};

/** Possible states of a taken course */
export enum StateCourse {
  Canceled = 'Canceled',
  Current = 'Current',
  Failed = 'Failed',
  Passed = 'Passed',
  Pending = 'Pending'
}

export type Student = {
  admission: Admission;
  credits_passed: Scalars['Int'];
  curriculums: Array<Scalars['String']>;
  dropout?: Maybe<Dropout>;
  employed?: Maybe<Employed>;
  graduation_term: Scalars['String'];
  id: Scalars['ID'];
  mention: Scalars['String'];
  n_courses_cycles: Array<Scalars['Float']>;
  n_cycles: Array<Scalars['String']>;
  name: Scalars['String'];
  programs: Array<Program>;
  progress: Scalars['Float'];
  start_year: Scalars['Int'];
  state: Scalars['String'];
  student_rut: Scalars['String'];
  terms: Array<Term>;
};

export type TakenCourse = {
  bandColors: Array<BandColor>;
  code: Scalars['String'];
  currentDistribution: Array<DistributionValue>;
  equiv: Scalars['String'];
  grade: Scalars['Float'];
  historicalDistribution: Array<DistributionValue>;
  id: Scalars['Int'];
  name: Scalars['String'];
  parallelGroup: Scalars['Int'];
  registration: Scalars['String'];
  state: StateCourse;
};

export type TakenExternalEvaluation = {
  bandColors: Array<BandColor>;
  code: Scalars['String'];
  currentDistribution: Array<DistributionValue>;
  grade: Scalars['Float'];
  id: Scalars['Int'];
  name: Scalars['String'];
  registration: Scalars['String'];
  state: StateCourse;
  topic: Scalars['String'];
};

export type Term = {
  comments: Scalars['String'];
  cumulated_grade: Scalars['Float'];
  id: Scalars['Int'];
  program_grade: Scalars['Float'];
  program_id: Scalars['String'];
  semestral_grade: Scalars['Float'];
  situation: Scalars['String'];
  student_id: Scalars['String'];
  takenCourses: Array<TakenCourse>;
  takenExternalEvaluations: Array<TakenExternalEvaluation>;
  term: TermType;
  year: Scalars['Int'];
};

/** Possible states of a term, first semester, second semester or anual */
export enum TermType {
  Anual = 'Anual',
  First = 'First',
  Second = 'Second'
}

export type Track = {
  app_id: Scalars['String'];
  data: Scalars['String'];
  datetime: Scalars['DateTime'];
  datetime_client: Scalars['DateTime'];
  id: Scalars['Int'];
  user_id: Scalars['String'];
};

export type UpdateUserPrograms = {
  email: Scalars['EmailAddress'];
  oldPrograms: Array<Scalars['String']>;
  programs: Array<Scalars['String']>;
};

export type UpsertedUser = {
  config?: Maybe<Scalars['JSONObject']>;
  email: Scalars['EmailAddress'];
  locked?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  oldEmail?: Maybe<Scalars['EmailAddress']>;
  student_id?: Maybe<Scalars['String']>;
  tries?: Maybe<Scalars['Int']>;
  type?: Maybe<UserType>;
};

export type User = {
  admin: Scalars['Boolean'];
  config: Scalars['JSONObject'];
  email: Scalars['EmailAddress'];
  locked: Scalars['Boolean'];
  name: Scalars['String'];
  programs: Array<Program>;
  student_id: Scalars['String'];
  studentIdValid?: Maybe<Scalars['Boolean']>;
  tries: Scalars['Int'];
  type: UserType;
  unlockKey: Scalars['String'];
};

export type UserProgram = {
  email: Scalars['EmailAddress'];
  program: Scalars['String'];
};

/** Possible options of an user type */
export enum UserType {
  Director = 'Director',
  Student = 'Student'
}

export type UserAdminInfoFragment = (
  Pick<User, 'email' | 'name' | 'tries' | 'type' | 'student_id' | 'config' | 'locked' | 'studentIdValid'>
  & { programs: Array<Pick<Program, 'id'>> }
);

export type AllUsersAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersAdminQuery = { users: Array<UserAdminInfoFragment> };

export type AllProgramsAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type AllProgramsAdminQuery = { programs: Array<Pick<Program, 'id'>> };

export type AddUsersProgramsAdminMutationVariables = Exact<{
  user_programs: Array<UserProgram>;
}>;


export type AddUsersProgramsAdminMutation = { addUsersPrograms: Array<UserAdminInfoFragment> };

export type UpdateUserProgramsAdminMutationVariables = Exact<{
  userPrograms: UpdateUserPrograms;
}>;


export type UpdateUserProgramsAdminMutation = { updateUserPrograms: Array<UserAdminInfoFragment> };

export type UpsertUsersAdminMutationVariables = Exact<{
  users: Array<UpsertedUser>;
}>;


export type UpsertUsersAdminMutation = { upsertUsers: Array<UserAdminInfoFragment> };

export type DeleteUserAdminMutationVariables = Exact<{
  email: Scalars['EmailAddress'];
}>;


export type DeleteUserAdminMutation = Pick<Mutation, 'deleteUser'>;

export type LockMailUserAdminMutationVariables = Exact<{
  email: Scalars['EmailAddress'];
}>;


export type LockMailUserAdminMutation = { lockMailUser: (
    Pick<LockedUserResult, 'mailResult'>
    & { users: Array<UserAdminInfoFragment> }
  ) };

export type NotificateUsersAdminMutationVariables = Exact<{
  body: Scalars['String'];
  closing: Scalars['String'];
  farewell: Scalars['String'];
  footer: Scalars['String'];
  header: Scalars['String'];
  subject: Scalars['String'];
  riskBody: Scalars['String'];
  riskTitle: Scalars['String'];
  riskGif: Scalars['String'];
  riskFooter: Scalars['String'];
  riskJSON: Scalars['String'];
}>;


export type NotificateUsersAdminMutation = Pick<Mutation, 'NotificateUsers'>;

export type ReNotificateUsersAdminMutationVariables = Exact<{
  content: Scalars['String'];
  email: Scalars['String'];
  parameters: Scalars['String'];
  counter: Scalars['Float'];
  id: Scalars['Float'];
  risks: Scalars['String'];
  riskJSON: Scalars['String'];
}>;


export type ReNotificateUsersAdminMutation = Pick<Mutation, 'ReNotificateUsers'>;

export type NotificationsDataAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsDataAdminQuery = { NotificationsData: Array<Pick<Notifications, 'id' | 'email' | 'content' | 'date' | 'parameters' | 'counter' | 'risks'>> };

export type MailAllLockedUsersAdminMutationVariables = Exact<{ [key: string]: never; }>;


export type MailAllLockedUsersAdminMutation = Pick<Mutation, 'mailAllLockedUsers'>;

export type EditConfigAdminMutationVariables = Exact<{
  name: Scalars['String'];
  value: Scalars['String'];
}>;


export type EditConfigAdminMutation = Pick<Mutation, 'editConfig'>;

export type UserPersistencesAdminQueryVariables = Exact<{
  user: Scalars['String'];
}>;


export type UserPersistencesAdminQuery = { userPersistences: Array<Pick<Persistence, 'key' | 'data' | 'timestamp'>> };

export type ResetPersistenceAdminMutationVariables = Exact<{
  user: Scalars['String'];
}>;


export type ResetPersistenceAdminMutation = Pick<Mutation, 'resetPersistence'>;

export type ResetDataLoadersCacheAdminMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetDataLoadersCacheAdminMutation = Pick<Mutation, 'resetDataLoadersCache'>;

export type FeedbackResultsCsvAdminMutationVariables = Exact<{ [key: string]: never; }>;


export type FeedbackResultsCsvAdminMutation = Pick<Mutation, 'feedbackResultsCsv'>;

export type FeedbackResultsAdminQueryVariables = Exact<{
  user_ids?: Maybe<Array<Scalars['String']>>;
}>;


export type FeedbackResultsAdminQuery = { feedbackResults: Array<(
    Pick<FeedbackResult, 'timestamp'>
    & { user: Pick<User, 'email'>, form: Pick<FeedbackForm, 'name'>, answers: Array<(
      Pick<FeedbackAnswer, 'answer'>
      & { question: (
        Pick<FeedbackQuestion, 'question' | 'type'>
        & { options: Array<Pick<FeedbackQuestionOption, 'text' | 'value'>> }
      ) }
    )> }
  )> };

export type TrackInfoQueryVariables = Exact<{
  minDate: Scalars['DateTime'];
  maxDate: Scalars['DateTime'];
}>;


export type TrackInfoQuery = { trackInfo: Array<Pick<Track, 'id' | 'user_id' | 'data' | 'app_id' | 'datetime'>> };

export type SendCredentialMutationVariables = Exact<{
  email: Scalars['String'];
  Name: Scalars['String'];
  LastName: Scalars['String'];
  type: Scalars['Boolean'];
}>;


export type SendCredentialMutation = Pick<Mutation, 'sendCredentials'>;

export type UserInfoFragment = Pick<User, 'email' | 'name' | 'admin' | 'type' | 'config' | 'student_id'>;

export type LoginMutationVariables = Exact<{
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
}>;


export type LoginMutation = { login: (
    Pick<AuthResult, 'error'>
    & { user?: Maybe<UserInfoFragment> }
  ) };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { currentUser?: Maybe<{ user?: Maybe<UserInfoFragment> }> };

export type CheckUnlockQueryVariables = Exact<{
  email: Scalars['EmailAddress'];
  unlockKey: Scalars['String'];
}>;


export type CheckUnlockQuery = Pick<Query, 'checkUnlockKey'>;

export type UnlockMutationVariables = Exact<{
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
  unlockKey: Scalars['String'];
}>;


export type UnlockMutation = { unlock: (
    Pick<AuthResult, 'error'>
    & { user?: Maybe<UserInfoFragment> }
  ) };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = Pick<Mutation, 'logout'>;

export type SearchProgramMutationVariables = Exact<{
  id?: Maybe<Scalars['String']>;
  student_id?: Maybe<Scalars['String']>;
}>;


export type SearchProgramMutation = { program: (
    Pick<Program, 'id' | 'name' | 'desc' | 'active'>
    & { groupedComplementary: Array<Pick<GroupedComplementary, 'timely_university_degree_rate' | 'total_students' | 'average_time_university_degree' | 'program_id' | 'curriculum' | 'type_admission' | 'cohort' | 'university_degree_rate' | 'current_retention_rate' | 'retention_rate' | 'inactive_time_rate'>>, groupedEmployed: Array<Pick<GroupedEmployed, 'employed_rate' | 'total_students' | 'average_time_job_finding' | 'program_id' | 'curriculum' | 'type_admission' | 'cohort' | 'employed_rate_educational_system'>>, courseGroupedStats: Array<(
      Pick<CourseGroupedStats, 'id' | 'program_id' | 'course_id' | 'curriculum' | 'type_admission' | 'cohort' | 'year' | 'term' | 'n_students' | 'n_total' | 'n_finished' | 'n_pass' | 'n_drop' | 'n_fail'>
      & { distribution: Array<Pick<DistributionValue, 'label' | 'value'>>, color_bands: Array<Pick<BandColor, 'min' | 'max' | 'color'>> }
    )>, externalEvaluationGroupedStats: Array<(
      Pick<ExternalEvaluationGroupedStats, 'id' | 'external_evaluation_id' | 'topic' | 'program_id' | 'curriculum' | 'type_admission' | 'cohort' | 'term' | 'n_students' | 'n_total' | 'n_finished' | 'n_pass' | 'n_drop' | 'n_fail'>
      & { distribution: Array<Pick<DistributionValue, 'label' | 'value'>>, color_bands: Array<Pick<BandColor, 'min' | 'max' | 'color'>> }
    )>, curriculums: Array<(
      Pick<Curriculum, 'id'>
      & { semesters: Array<(
        Pick<Semester, 'id'>
        & { courses: Array<(
          Pick<Course, 'code' | 'name' | 'mention' | 'mode'>
          & { credits: Array<Pick<Credit, 'label' | 'value'>>, flow: Array<Pick<Course, 'code'>>, requisites: Array<Pick<Course, 'code'>>, historicalDistribution: Array<Pick<DistributionValue, 'label' | 'value'>>, bandColors: Array<Pick<BandColor, 'min' | 'max' | 'color'>> }
        )>, externalEvaluations: Array<(
          Pick<ExternalEvaluation, 'code' | 'name'>
          & { bandColors: Array<Pick<BandColor, 'min' | 'max' | 'color'>> }
        )> }
      )> }
    )> }
  ) };

export type SearchStudentMutationVariables = Exact<{
  student_id?: Maybe<Scalars['String']>;
  program_id?: Maybe<Scalars['String']>;
}>;


export type SearchStudentMutation = { student?: Maybe<(
    Pick<Student, 'id' | 'curriculums' | 'start_year' | 'n_courses_cycles' | 'n_cycles' | 'mention' | 'graduation_term' | 'credits_passed'>
    & { programs: Array<Pick<Program, 'id' | 'name'>>, terms: Array<(
      Pick<Term, 'id' | 'student_id' | 'year' | 'term' | 'situation' | 'comments' | 'semestral_grade' | 'cumulated_grade' | 'program_grade'>
      & { takenCourses: Array<(
        Pick<TakenCourse, 'id' | 'code' | 'equiv' | 'name' | 'registration' | 'grade' | 'state' | 'parallelGroup'>
        & { currentDistribution: Array<Pick<DistributionValue, 'label' | 'value'>>, historicalDistribution: Array<Pick<DistributionValue, 'label' | 'value'>>, bandColors: Array<Pick<BandColor, 'min' | 'max' | 'color'>> }
      )>, takenExternalEvaluations: Array<(
        Pick<TakenExternalEvaluation, 'id' | 'code' | 'topic' | 'name' | 'registration' | 'state' | 'grade'>
        & { currentDistribution: Array<Pick<DistributionValue, 'label' | 'value'>>, bandColors: Array<Pick<BandColor, 'min' | 'max' | 'color'>> }
      )> }
    )>, dropout?: Maybe<Pick<Dropout, 'prob_dropout' | 'model_accuracy' | 'active'>>, admission: Pick<Admission, 'type_admission'>, employed?: Maybe<Pick<Employed, 'employed' | 'institution' | 'educational_system' | 'months_to_first_job'>> }
  )> };

export type MyProgramsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProgramsQuery = { myPrograms: Array<Pick<Program, 'id' | 'name'>> };

export type GroupedSpecialTypesAdmissionQueryVariables = Exact<{ [key: string]: never; }>;


export type GroupedSpecialTypesAdmissionQuery = Pick<Query, 'groupedSpecialTypesAdmission'>;

export type TrackMutationVariables = Exact<{
  data: Scalars['String'];
  datetime_client: Scalars['DateTime'];
}>;


export type TrackMutation = Pick<Mutation, 'track'>;

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = Pick<Query, 'config'>;

export type StudentsListQueryVariables = Exact<{
  program_id: Scalars['String'];
}>;


export type StudentsListQuery = { students: Array<(
    Pick<Student, 'id' | 'name' | 'progress' | 'start_year'>
    & { dropout?: Maybe<Pick<Dropout, 'prob_dropout' | 'explanation'>>, admission: Pick<Admission, 'type_admission'> }
  )> };

export type StudentsFilterListQueryVariables = Exact<{
  program_id: Scalars['String'];
  curriculum: Scalars['String'];
  grouped: Scalars['Boolean'];
}>;


export type StudentsFilterListQuery = { students_filter: Array<(
    Pick<Student, 'id' | 'curriculums' | 'start_year' | 'mention'>
    & { programs: Array<Pick<Program, 'id'>>, admission: Pick<Admission, 'type_admission'>, terms: Array<Pick<Term, 'year' | 'term' | 'semestral_grade' | 'comments' | 'program_id'>> }
  )> };

export type ParametersQueryVariables = Exact<{ [key: string]: never; }>;


export type ParametersQuery = { parameters: Array<Pick<Parameter, 'id' | 'loading_type' | 'loading_date'>> };

export type PerformanceLoadAdvicesMutationVariables = Exact<{
  student_id?: Maybe<Scalars['String']>;
  program_id?: Maybe<Scalars['String']>;
}>;


export type PerformanceLoadAdvicesMutation = { performanceLoadAdvices: Array<Pick<PerformanceByLoad, 'id' | 'loadUnit' | 'lowerBoundary' | 'upperBoundary' | 'failRateLow' | 'failRateMid' | 'failRateHigh' | 'adviceTitle' | 'adviceParagraph' | 'clusterLabel' | 'isStudentCluster'>> };

export type DirectTakeCoursesMutationVariables = Exact<{
  student_id?: Maybe<Scalars['String']>;
  program_id?: Maybe<Scalars['String']>;
}>;


export type DirectTakeCoursesMutation = { directTakeCourses: Array<Pick<Course, 'id' | 'code'>> };

export type IndirectTakeCoursesMutationVariables = Exact<{
  student_id?: Maybe<Scalars['String']>;
  program_id?: Maybe<Scalars['String']>;
}>;


export type IndirectTakeCoursesMutation = { indirectTakeCourses: Array<(
    Pick<IndirectTakeCourse, 'requisitesUnmet'>
    & { course: Pick<Course, 'id' | 'code'> }
  )> };

export type GetPersistenceValueQueryVariables = Exact<{
  key: Scalars['String'];
}>;


export type GetPersistenceValueQuery = { getPersistenceValue?: Maybe<Pick<Persistence, 'key' | 'data'>> };

export type SetPersistenceValueMutationVariables = Exact<{
  key: Scalars['String'];
  data: Scalars['JSONObject'];
}>;


export type SetPersistenceValueMutation = { setPersistenceValue: { __typename: 'Persistence' } };

export type UnansweredFormQueryVariables = Exact<{ [key: string]: never; }>;


export type UnansweredFormQuery = { unansweredForm?: Maybe<(
    Pick<FeedbackForm, 'id' | 'name' | 'priority'>
    & { questions: Array<(
      Pick<FeedbackQuestion, 'id' | 'question' | 'type' | 'priority'>
      & { options: Array<Pick<FeedbackQuestionOption, 'text' | 'value'>> }
    )> }
  )> };

export type AnswerFeedbackFormMutationVariables = Exact<{
  answer: FeedbackAnswerInput;
}>;


export type AnswerFeedbackFormMutation = Pick<Mutation, 'answerFeedbackForm'>;

export type RiskNoticationQueryVariables = Exact<{
  program_id: Scalars['String'];
  risk_type: Scalars['String'];
}>;


export type RiskNoticationQuery = { riskNotification: Array<Pick<RiskNotification, 'student_id' | 'course_id' | 'program_id' | 'curriculum' | 'cohort' | 'risk_type' | 'details'>> };

export type AnonHelpdeskUrlMutationVariables = Exact<{ [key: string]: never; }>;


export type AnonHelpdeskUrlMutation = Pick<Mutation, 'readAnonUrl'>;

export type LoginTestMutationVariables = Exact<{
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
}>;


export type LoginTestMutation = { login: (
    Pick<AuthResult, 'token' | 'error'>
    & { user?: Maybe<Pick<User, 'email'>> }
  ) };

export type UnlockTestMutationVariables = Exact<{
  email: Scalars['EmailAddress'];
  password: Scalars['String'];
  unlockKey: Scalars['String'];
}>;


export type UnlockTestMutation = { unlock: (
    Pick<AuthResult, 'token' | 'error'>
    & { user?: Maybe<Pick<User, 'email'>> }
  ) };

export type CurrentUserTestQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserTestQuery = { currentUser?: Maybe<(
    Pick<AuthResult, 'token' | 'error'>
    & { user?: Maybe<Pick<User, 'email'>> }
  )> };

export const UserAdminInfoFragmentDoc = gql`
    fragment UserAdminInfo on User {
  email
  name
  tries
  type
  student_id
  config
  locked
  studentIdValid
  programs {
    id
  }
}
    `;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  email
  name
  admin
  type
  config
  student_id
}
    `;
export const AllUsersAdminDocument = gql`
    query allUsersAdmin {
  users {
    ...UserAdminInfo
  }
}
    ${UserAdminInfoFragmentDoc}`;

/**
 * __useAllUsersAdminQuery__
 *
 * To run a query within a React component, call `useAllUsersAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllUsersAdminQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersAdminQuery, AllUsersAdminQueryVariables>) {
        return Apollo.useQuery<AllUsersAdminQuery, AllUsersAdminQueryVariables>(AllUsersAdminDocument, baseOptions);
      }
export function useAllUsersAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersAdminQuery, AllUsersAdminQueryVariables>) {
          return Apollo.useLazyQuery<AllUsersAdminQuery, AllUsersAdminQueryVariables>(AllUsersAdminDocument, baseOptions);
        }
export type AllUsersAdminQueryHookResult = ReturnType<typeof useAllUsersAdminQuery>;
export type AllUsersAdminLazyQueryHookResult = ReturnType<typeof useAllUsersAdminLazyQuery>;
export type AllUsersAdminQueryResult = Apollo.QueryResult<AllUsersAdminQuery, AllUsersAdminQueryVariables>;
export const AllProgramsAdminDocument = gql`
    query allProgramsAdmin {
  programs {
    id
  }
}
    `;

/**
 * __useAllProgramsAdminQuery__
 *
 * To run a query within a React component, call `useAllProgramsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllProgramsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllProgramsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllProgramsAdminQuery(baseOptions?: Apollo.QueryHookOptions<AllProgramsAdminQuery, AllProgramsAdminQueryVariables>) {
        return Apollo.useQuery<AllProgramsAdminQuery, AllProgramsAdminQueryVariables>(AllProgramsAdminDocument, baseOptions);
      }
export function useAllProgramsAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllProgramsAdminQuery, AllProgramsAdminQueryVariables>) {
          return Apollo.useLazyQuery<AllProgramsAdminQuery, AllProgramsAdminQueryVariables>(AllProgramsAdminDocument, baseOptions);
        }
export type AllProgramsAdminQueryHookResult = ReturnType<typeof useAllProgramsAdminQuery>;
export type AllProgramsAdminLazyQueryHookResult = ReturnType<typeof useAllProgramsAdminLazyQuery>;
export type AllProgramsAdminQueryResult = Apollo.QueryResult<AllProgramsAdminQuery, AllProgramsAdminQueryVariables>;
export const AddUsersProgramsAdminDocument = gql`
    mutation addUsersProgramsAdmin($user_programs: [UserProgram!]!) {
  addUsersPrograms(user_programs: $user_programs) {
    ...UserAdminInfo
  }
}
    ${UserAdminInfoFragmentDoc}`;
export type AddUsersProgramsAdminMutationFn = Apollo.MutationFunction<AddUsersProgramsAdminMutation, AddUsersProgramsAdminMutationVariables>;

/**
 * __useAddUsersProgramsAdminMutation__
 *
 * To run a mutation, you first call `useAddUsersProgramsAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUsersProgramsAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUsersProgramsAdminMutation, { data, loading, error }] = useAddUsersProgramsAdminMutation({
 *   variables: {
 *      user_programs: // value for 'user_programs'
 *   },
 * });
 */
export function useAddUsersProgramsAdminMutation(baseOptions?: Apollo.MutationHookOptions<AddUsersProgramsAdminMutation, AddUsersProgramsAdminMutationVariables>) {
        return Apollo.useMutation<AddUsersProgramsAdminMutation, AddUsersProgramsAdminMutationVariables>(AddUsersProgramsAdminDocument, baseOptions);
      }
export type AddUsersProgramsAdminMutationHookResult = ReturnType<typeof useAddUsersProgramsAdminMutation>;
export type AddUsersProgramsAdminMutationResult = Apollo.MutationResult<AddUsersProgramsAdminMutation>;
export type AddUsersProgramsAdminMutationOptions = Apollo.BaseMutationOptions<AddUsersProgramsAdminMutation, AddUsersProgramsAdminMutationVariables>;
export const UpdateUserProgramsAdminDocument = gql`
    mutation updateUserProgramsAdmin($userPrograms: UpdateUserPrograms!) {
  updateUserPrograms(userPrograms: $userPrograms) {
    ...UserAdminInfo
  }
}
    ${UserAdminInfoFragmentDoc}`;
export type UpdateUserProgramsAdminMutationFn = Apollo.MutationFunction<UpdateUserProgramsAdminMutation, UpdateUserProgramsAdminMutationVariables>;

/**
 * __useUpdateUserProgramsAdminMutation__
 *
 * To run a mutation, you first call `useUpdateUserProgramsAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProgramsAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProgramsAdminMutation, { data, loading, error }] = useUpdateUserProgramsAdminMutation({
 *   variables: {
 *      userPrograms: // value for 'userPrograms'
 *   },
 * });
 */
export function useUpdateUserProgramsAdminMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProgramsAdminMutation, UpdateUserProgramsAdminMutationVariables>) {
        return Apollo.useMutation<UpdateUserProgramsAdminMutation, UpdateUserProgramsAdminMutationVariables>(UpdateUserProgramsAdminDocument, baseOptions);
      }
export type UpdateUserProgramsAdminMutationHookResult = ReturnType<typeof useUpdateUserProgramsAdminMutation>;
export type UpdateUserProgramsAdminMutationResult = Apollo.MutationResult<UpdateUserProgramsAdminMutation>;
export type UpdateUserProgramsAdminMutationOptions = Apollo.BaseMutationOptions<UpdateUserProgramsAdminMutation, UpdateUserProgramsAdminMutationVariables>;
export const UpsertUsersAdminDocument = gql`
    mutation upsertUsersAdmin($users: [UpsertedUser!]!) {
  upsertUsers(users: $users) {
    ...UserAdminInfo
  }
}
    ${UserAdminInfoFragmentDoc}`;
export type UpsertUsersAdminMutationFn = Apollo.MutationFunction<UpsertUsersAdminMutation, UpsertUsersAdminMutationVariables>;

/**
 * __useUpsertUsersAdminMutation__
 *
 * To run a mutation, you first call `useUpsertUsersAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertUsersAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertUsersAdminMutation, { data, loading, error }] = useUpsertUsersAdminMutation({
 *   variables: {
 *      users: // value for 'users'
 *   },
 * });
 */
export function useUpsertUsersAdminMutation(baseOptions?: Apollo.MutationHookOptions<UpsertUsersAdminMutation, UpsertUsersAdminMutationVariables>) {
        return Apollo.useMutation<UpsertUsersAdminMutation, UpsertUsersAdminMutationVariables>(UpsertUsersAdminDocument, baseOptions);
      }
export type UpsertUsersAdminMutationHookResult = ReturnType<typeof useUpsertUsersAdminMutation>;
export type UpsertUsersAdminMutationResult = Apollo.MutationResult<UpsertUsersAdminMutation>;
export type UpsertUsersAdminMutationOptions = Apollo.BaseMutationOptions<UpsertUsersAdminMutation, UpsertUsersAdminMutationVariables>;
export const DeleteUserAdminDocument = gql`
    mutation deleteUserAdmin($email: EmailAddress!) {
  deleteUser(email: $email)
}
    `;
export type DeleteUserAdminMutationFn = Apollo.MutationFunction<DeleteUserAdminMutation, DeleteUserAdminMutationVariables>;

/**
 * __useDeleteUserAdminMutation__
 *
 * To run a mutation, you first call `useDeleteUserAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserAdminMutation, { data, loading, error }] = useDeleteUserAdminMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useDeleteUserAdminMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserAdminMutation, DeleteUserAdminMutationVariables>) {
        return Apollo.useMutation<DeleteUserAdminMutation, DeleteUserAdminMutationVariables>(DeleteUserAdminDocument, baseOptions);
      }
export type DeleteUserAdminMutationHookResult = ReturnType<typeof useDeleteUserAdminMutation>;
export type DeleteUserAdminMutationResult = Apollo.MutationResult<DeleteUserAdminMutation>;
export type DeleteUserAdminMutationOptions = Apollo.BaseMutationOptions<DeleteUserAdminMutation, DeleteUserAdminMutationVariables>;
export const LockMailUserAdminDocument = gql`
    mutation lockMailUserAdmin($email: EmailAddress!) {
  lockMailUser(email: $email) {
    mailResult
    users {
      ...UserAdminInfo
    }
  }
}
    ${UserAdminInfoFragmentDoc}`;
export type LockMailUserAdminMutationFn = Apollo.MutationFunction<LockMailUserAdminMutation, LockMailUserAdminMutationVariables>;

/**
 * __useLockMailUserAdminMutation__
 *
 * To run a mutation, you first call `useLockMailUserAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLockMailUserAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [lockMailUserAdminMutation, { data, loading, error }] = useLockMailUserAdminMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useLockMailUserAdminMutation(baseOptions?: Apollo.MutationHookOptions<LockMailUserAdminMutation, LockMailUserAdminMutationVariables>) {
        return Apollo.useMutation<LockMailUserAdminMutation, LockMailUserAdminMutationVariables>(LockMailUserAdminDocument, baseOptions);
      }
export type LockMailUserAdminMutationHookResult = ReturnType<typeof useLockMailUserAdminMutation>;
export type LockMailUserAdminMutationResult = Apollo.MutationResult<LockMailUserAdminMutation>;
export type LockMailUserAdminMutationOptions = Apollo.BaseMutationOptions<LockMailUserAdminMutation, LockMailUserAdminMutationVariables>;
export const NotificateUsersAdminDocument = gql`
    mutation NotificateUsersAdmin($body: String!, $closing: String!, $farewell: String!, $footer: String!, $header: String!, $subject: String!, $riskBody: String!, $riskTitle: String!, $riskGif: String!, $riskFooter: String!, $riskJSON: String!) {
  NotificateUsers(
    header: $header
    body: $body
    footer: $footer
    subject: $subject
    farewell: $farewell
    closing: $closing
    riskBody: $riskBody
    riskTitle: $riskTitle
    riskGif: $riskGif
    riskFooter: $riskFooter
    riskJSON: $riskJSON
  )
}
    `;
export type NotificateUsersAdminMutationFn = Apollo.MutationFunction<NotificateUsersAdminMutation, NotificateUsersAdminMutationVariables>;

/**
 * __useNotificateUsersAdminMutation__
 *
 * To run a mutation, you first call `useNotificateUsersAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNotificateUsersAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [notificateUsersAdminMutation, { data, loading, error }] = useNotificateUsersAdminMutation({
 *   variables: {
 *      body: // value for 'body'
 *      closing: // value for 'closing'
 *      farewell: // value for 'farewell'
 *      footer: // value for 'footer'
 *      header: // value for 'header'
 *      subject: // value for 'subject'
 *      riskBody: // value for 'riskBody'
 *      riskTitle: // value for 'riskTitle'
 *      riskGif: // value for 'riskGif'
 *      riskFooter: // value for 'riskFooter'
 *      riskJSON: // value for 'riskJSON'
 *   },
 * });
 */
export function useNotificateUsersAdminMutation(baseOptions?: Apollo.MutationHookOptions<NotificateUsersAdminMutation, NotificateUsersAdminMutationVariables>) {
        return Apollo.useMutation<NotificateUsersAdminMutation, NotificateUsersAdminMutationVariables>(NotificateUsersAdminDocument, baseOptions);
      }
export type NotificateUsersAdminMutationHookResult = ReturnType<typeof useNotificateUsersAdminMutation>;
export type NotificateUsersAdminMutationResult = Apollo.MutationResult<NotificateUsersAdminMutation>;
export type NotificateUsersAdminMutationOptions = Apollo.BaseMutationOptions<NotificateUsersAdminMutation, NotificateUsersAdminMutationVariables>;
export const ReNotificateUsersAdminDocument = gql`
    mutation ReNotificateUsersAdmin($content: String!, $email: String!, $parameters: String!, $counter: Float!, $id: Float!, $risks: String!, $riskJSON: String!) {
  ReNotificateUsers(
    content: $content
    email: $email
    parameters: $parameters
    counter: $counter
    id: $id
    risks: $risks
    risksJSON: $riskJSON
  )
}
    `;
export type ReNotificateUsersAdminMutationFn = Apollo.MutationFunction<ReNotificateUsersAdminMutation, ReNotificateUsersAdminMutationVariables>;

/**
 * __useReNotificateUsersAdminMutation__
 *
 * To run a mutation, you first call `useReNotificateUsersAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReNotificateUsersAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reNotificateUsersAdminMutation, { data, loading, error }] = useReNotificateUsersAdminMutation({
 *   variables: {
 *      content: // value for 'content'
 *      email: // value for 'email'
 *      parameters: // value for 'parameters'
 *      counter: // value for 'counter'
 *      id: // value for 'id'
 *      risks: // value for 'risks'
 *      riskJSON: // value for 'riskJSON'
 *   },
 * });
 */
export function useReNotificateUsersAdminMutation(baseOptions?: Apollo.MutationHookOptions<ReNotificateUsersAdminMutation, ReNotificateUsersAdminMutationVariables>) {
        return Apollo.useMutation<ReNotificateUsersAdminMutation, ReNotificateUsersAdminMutationVariables>(ReNotificateUsersAdminDocument, baseOptions);
      }
export type ReNotificateUsersAdminMutationHookResult = ReturnType<typeof useReNotificateUsersAdminMutation>;
export type ReNotificateUsersAdminMutationResult = Apollo.MutationResult<ReNotificateUsersAdminMutation>;
export type ReNotificateUsersAdminMutationOptions = Apollo.BaseMutationOptions<ReNotificateUsersAdminMutation, ReNotificateUsersAdminMutationVariables>;
export const NotificationsDataAdminDocument = gql`
    query NotificationsDataAdmin {
  NotificationsData {
    id
    email
    content
    date
    parameters
    counter
    risks
  }
}
    `;

/**
 * __useNotificationsDataAdminQuery__
 *
 * To run a query within a React component, call `useNotificationsDataAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationsDataAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationsDataAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationsDataAdminQuery(baseOptions?: Apollo.QueryHookOptions<NotificationsDataAdminQuery, NotificationsDataAdminQueryVariables>) {
        return Apollo.useQuery<NotificationsDataAdminQuery, NotificationsDataAdminQueryVariables>(NotificationsDataAdminDocument, baseOptions);
      }
export function useNotificationsDataAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationsDataAdminQuery, NotificationsDataAdminQueryVariables>) {
          return Apollo.useLazyQuery<NotificationsDataAdminQuery, NotificationsDataAdminQueryVariables>(NotificationsDataAdminDocument, baseOptions);
        }
export type NotificationsDataAdminQueryHookResult = ReturnType<typeof useNotificationsDataAdminQuery>;
export type NotificationsDataAdminLazyQueryHookResult = ReturnType<typeof useNotificationsDataAdminLazyQuery>;
export type NotificationsDataAdminQueryResult = Apollo.QueryResult<NotificationsDataAdminQuery, NotificationsDataAdminQueryVariables>;
export const MailAllLockedUsersAdminDocument = gql`
    mutation mailAllLockedUsersAdmin {
  mailAllLockedUsers
}
    `;
export type MailAllLockedUsersAdminMutationFn = Apollo.MutationFunction<MailAllLockedUsersAdminMutation, MailAllLockedUsersAdminMutationVariables>;

/**
 * __useMailAllLockedUsersAdminMutation__
 *
 * To run a mutation, you first call `useMailAllLockedUsersAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMailAllLockedUsersAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mailAllLockedUsersAdminMutation, { data, loading, error }] = useMailAllLockedUsersAdminMutation({
 *   variables: {
 *   },
 * });
 */
export function useMailAllLockedUsersAdminMutation(baseOptions?: Apollo.MutationHookOptions<MailAllLockedUsersAdminMutation, MailAllLockedUsersAdminMutationVariables>) {
        return Apollo.useMutation<MailAllLockedUsersAdminMutation, MailAllLockedUsersAdminMutationVariables>(MailAllLockedUsersAdminDocument, baseOptions);
      }
export type MailAllLockedUsersAdminMutationHookResult = ReturnType<typeof useMailAllLockedUsersAdminMutation>;
export type MailAllLockedUsersAdminMutationResult = Apollo.MutationResult<MailAllLockedUsersAdminMutation>;
export type MailAllLockedUsersAdminMutationOptions = Apollo.BaseMutationOptions<MailAllLockedUsersAdminMutation, MailAllLockedUsersAdminMutationVariables>;
export const EditConfigAdminDocument = gql`
    mutation editConfigAdmin($name: String!, $value: String!) {
  editConfig(name: $name, value: $value)
}
    `;
export type EditConfigAdminMutationFn = Apollo.MutationFunction<EditConfigAdminMutation, EditConfigAdminMutationVariables>;

/**
 * __useEditConfigAdminMutation__
 *
 * To run a mutation, you first call `useEditConfigAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditConfigAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editConfigAdminMutation, { data, loading, error }] = useEditConfigAdminMutation({
 *   variables: {
 *      name: // value for 'name'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useEditConfigAdminMutation(baseOptions?: Apollo.MutationHookOptions<EditConfigAdminMutation, EditConfigAdminMutationVariables>) {
        return Apollo.useMutation<EditConfigAdminMutation, EditConfigAdminMutationVariables>(EditConfigAdminDocument, baseOptions);
      }
export type EditConfigAdminMutationHookResult = ReturnType<typeof useEditConfigAdminMutation>;
export type EditConfigAdminMutationResult = Apollo.MutationResult<EditConfigAdminMutation>;
export type EditConfigAdminMutationOptions = Apollo.BaseMutationOptions<EditConfigAdminMutation, EditConfigAdminMutationVariables>;
export const UserPersistencesAdminDocument = gql`
    query userPersistencesAdmin($user: String!) {
  userPersistences(user: $user) {
    key
    data
    timestamp
  }
}
    `;

/**
 * __useUserPersistencesAdminQuery__
 *
 * To run a query within a React component, call `useUserPersistencesAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPersistencesAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPersistencesAdminQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useUserPersistencesAdminQuery(baseOptions: Apollo.QueryHookOptions<UserPersistencesAdminQuery, UserPersistencesAdminQueryVariables>) {
        return Apollo.useQuery<UserPersistencesAdminQuery, UserPersistencesAdminQueryVariables>(UserPersistencesAdminDocument, baseOptions);
      }
export function useUserPersistencesAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserPersistencesAdminQuery, UserPersistencesAdminQueryVariables>) {
          return Apollo.useLazyQuery<UserPersistencesAdminQuery, UserPersistencesAdminQueryVariables>(UserPersistencesAdminDocument, baseOptions);
        }
export type UserPersistencesAdminQueryHookResult = ReturnType<typeof useUserPersistencesAdminQuery>;
export type UserPersistencesAdminLazyQueryHookResult = ReturnType<typeof useUserPersistencesAdminLazyQuery>;
export type UserPersistencesAdminQueryResult = Apollo.QueryResult<UserPersistencesAdminQuery, UserPersistencesAdminQueryVariables>;
export const ResetPersistenceAdminDocument = gql`
    mutation resetPersistenceAdmin($user: String!) {
  resetPersistence(user: $user)
}
    `;
export type ResetPersistenceAdminMutationFn = Apollo.MutationFunction<ResetPersistenceAdminMutation, ResetPersistenceAdminMutationVariables>;

/**
 * __useResetPersistenceAdminMutation__
 *
 * To run a mutation, you first call `useResetPersistenceAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPersistenceAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPersistenceAdminMutation, { data, loading, error }] = useResetPersistenceAdminMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useResetPersistenceAdminMutation(baseOptions?: Apollo.MutationHookOptions<ResetPersistenceAdminMutation, ResetPersistenceAdminMutationVariables>) {
        return Apollo.useMutation<ResetPersistenceAdminMutation, ResetPersistenceAdminMutationVariables>(ResetPersistenceAdminDocument, baseOptions);
      }
export type ResetPersistenceAdminMutationHookResult = ReturnType<typeof useResetPersistenceAdminMutation>;
export type ResetPersistenceAdminMutationResult = Apollo.MutationResult<ResetPersistenceAdminMutation>;
export type ResetPersistenceAdminMutationOptions = Apollo.BaseMutationOptions<ResetPersistenceAdminMutation, ResetPersistenceAdminMutationVariables>;
export const ResetDataLoadersCacheAdminDocument = gql`
    mutation resetDataLoadersCacheAdmin {
  resetDataLoadersCache
}
    `;
export type ResetDataLoadersCacheAdminMutationFn = Apollo.MutationFunction<ResetDataLoadersCacheAdminMutation, ResetDataLoadersCacheAdminMutationVariables>;

/**
 * __useResetDataLoadersCacheAdminMutation__
 *
 * To run a mutation, you first call `useResetDataLoadersCacheAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetDataLoadersCacheAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetDataLoadersCacheAdminMutation, { data, loading, error }] = useResetDataLoadersCacheAdminMutation({
 *   variables: {
 *   },
 * });
 */
export function useResetDataLoadersCacheAdminMutation(baseOptions?: Apollo.MutationHookOptions<ResetDataLoadersCacheAdminMutation, ResetDataLoadersCacheAdminMutationVariables>) {
        return Apollo.useMutation<ResetDataLoadersCacheAdminMutation, ResetDataLoadersCacheAdminMutationVariables>(ResetDataLoadersCacheAdminDocument, baseOptions);
      }
export type ResetDataLoadersCacheAdminMutationHookResult = ReturnType<typeof useResetDataLoadersCacheAdminMutation>;
export type ResetDataLoadersCacheAdminMutationResult = Apollo.MutationResult<ResetDataLoadersCacheAdminMutation>;
export type ResetDataLoadersCacheAdminMutationOptions = Apollo.BaseMutationOptions<ResetDataLoadersCacheAdminMutation, ResetDataLoadersCacheAdminMutationVariables>;
export const FeedbackResultsCsvAdminDocument = gql`
    mutation feedbackResultsCsvAdmin {
  feedbackResultsCsv
}
    `;
export type FeedbackResultsCsvAdminMutationFn = Apollo.MutationFunction<FeedbackResultsCsvAdminMutation, FeedbackResultsCsvAdminMutationVariables>;

/**
 * __useFeedbackResultsCsvAdminMutation__
 *
 * To run a mutation, you first call `useFeedbackResultsCsvAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFeedbackResultsCsvAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [feedbackResultsCsvAdminMutation, { data, loading, error }] = useFeedbackResultsCsvAdminMutation({
 *   variables: {
 *   },
 * });
 */
export function useFeedbackResultsCsvAdminMutation(baseOptions?: Apollo.MutationHookOptions<FeedbackResultsCsvAdminMutation, FeedbackResultsCsvAdminMutationVariables>) {
        return Apollo.useMutation<FeedbackResultsCsvAdminMutation, FeedbackResultsCsvAdminMutationVariables>(FeedbackResultsCsvAdminDocument, baseOptions);
      }
export type FeedbackResultsCsvAdminMutationHookResult = ReturnType<typeof useFeedbackResultsCsvAdminMutation>;
export type FeedbackResultsCsvAdminMutationResult = Apollo.MutationResult<FeedbackResultsCsvAdminMutation>;
export type FeedbackResultsCsvAdminMutationOptions = Apollo.BaseMutationOptions<FeedbackResultsCsvAdminMutation, FeedbackResultsCsvAdminMutationVariables>;
export const FeedbackResultsAdminDocument = gql`
    query feedbackResultsAdmin($user_ids: [String!]) {
  feedbackResults(user_ids: $user_ids) {
    user {
      email
    }
    form {
      name
    }
    answers {
      answer
      question {
        question
        type
        options {
          text
          value
        }
      }
    }
    timestamp
  }
}
    `;

/**
 * __useFeedbackResultsAdminQuery__
 *
 * To run a query within a React component, call `useFeedbackResultsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedbackResultsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedbackResultsAdminQuery({
 *   variables: {
 *      user_ids: // value for 'user_ids'
 *   },
 * });
 */
export function useFeedbackResultsAdminQuery(baseOptions?: Apollo.QueryHookOptions<FeedbackResultsAdminQuery, FeedbackResultsAdminQueryVariables>) {
        return Apollo.useQuery<FeedbackResultsAdminQuery, FeedbackResultsAdminQueryVariables>(FeedbackResultsAdminDocument, baseOptions);
      }
export function useFeedbackResultsAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeedbackResultsAdminQuery, FeedbackResultsAdminQueryVariables>) {
          return Apollo.useLazyQuery<FeedbackResultsAdminQuery, FeedbackResultsAdminQueryVariables>(FeedbackResultsAdminDocument, baseOptions);
        }
export type FeedbackResultsAdminQueryHookResult = ReturnType<typeof useFeedbackResultsAdminQuery>;
export type FeedbackResultsAdminLazyQueryHookResult = ReturnType<typeof useFeedbackResultsAdminLazyQuery>;
export type FeedbackResultsAdminQueryResult = Apollo.QueryResult<FeedbackResultsAdminQuery, FeedbackResultsAdminQueryVariables>;
export const TrackInfoDocument = gql`
    query trackInfo($minDate: DateTime!, $maxDate: DateTime!) {
  trackInfo(minDate: $minDate, maxDate: $maxDate) {
    id
    user_id
    data
    app_id
    datetime
  }
}
    `;

/**
 * __useTrackInfoQuery__
 *
 * To run a query within a React component, call `useTrackInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrackInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrackInfoQuery({
 *   variables: {
 *      minDate: // value for 'minDate'
 *      maxDate: // value for 'maxDate'
 *   },
 * });
 */
export function useTrackInfoQuery(baseOptions: Apollo.QueryHookOptions<TrackInfoQuery, TrackInfoQueryVariables>) {
        return Apollo.useQuery<TrackInfoQuery, TrackInfoQueryVariables>(TrackInfoDocument, baseOptions);
      }
export function useTrackInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrackInfoQuery, TrackInfoQueryVariables>) {
          return Apollo.useLazyQuery<TrackInfoQuery, TrackInfoQueryVariables>(TrackInfoDocument, baseOptions);
        }
export type TrackInfoQueryHookResult = ReturnType<typeof useTrackInfoQuery>;
export type TrackInfoLazyQueryHookResult = ReturnType<typeof useTrackInfoLazyQuery>;
export type TrackInfoQueryResult = Apollo.QueryResult<TrackInfoQuery, TrackInfoQueryVariables>;
export const SendCredentialDocument = gql`
    mutation sendCredential($email: String!, $Name: String!, $LastName: String!, $type: Boolean!) {
  sendCredentials(email: $email, Name: $Name, LastName: $LastName, type: $type)
}
    `;
export type SendCredentialMutationFn = Apollo.MutationFunction<SendCredentialMutation, SendCredentialMutationVariables>;

/**
 * __useSendCredentialMutation__
 *
 * To run a mutation, you first call `useSendCredentialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendCredentialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendCredentialMutation, { data, loading, error }] = useSendCredentialMutation({
 *   variables: {
 *      email: // value for 'email'
 *      Name: // value for 'Name'
 *      LastName: // value for 'LastName'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useSendCredentialMutation(baseOptions?: Apollo.MutationHookOptions<SendCredentialMutation, SendCredentialMutationVariables>) {
        return Apollo.useMutation<SendCredentialMutation, SendCredentialMutationVariables>(SendCredentialDocument, baseOptions);
      }
export type SendCredentialMutationHookResult = ReturnType<typeof useSendCredentialMutation>;
export type SendCredentialMutationResult = Apollo.MutationResult<SendCredentialMutation>;
export type SendCredentialMutationOptions = Apollo.BaseMutationOptions<SendCredentialMutation, SendCredentialMutationVariables>;
export const LoginDocument = gql`
    mutation login($email: EmailAddress!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      ...UserInfo
    }
    error
  }
}
    ${UserInfoFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    user {
      ...UserInfo
    }
  }
}
    ${UserInfoFragmentDoc}`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const CheckUnlockDocument = gql`
    query checkUnlock($email: EmailAddress!, $unlockKey: String!) {
  checkUnlockKey(email: $email, unlockKey: $unlockKey)
}
    `;

/**
 * __useCheckUnlockQuery__
 *
 * To run a query within a React component, call `useCheckUnlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckUnlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckUnlockQuery({
 *   variables: {
 *      email: // value for 'email'
 *      unlockKey: // value for 'unlockKey'
 *   },
 * });
 */
export function useCheckUnlockQuery(baseOptions: Apollo.QueryHookOptions<CheckUnlockQuery, CheckUnlockQueryVariables>) {
        return Apollo.useQuery<CheckUnlockQuery, CheckUnlockQueryVariables>(CheckUnlockDocument, baseOptions);
      }
export function useCheckUnlockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckUnlockQuery, CheckUnlockQueryVariables>) {
          return Apollo.useLazyQuery<CheckUnlockQuery, CheckUnlockQueryVariables>(CheckUnlockDocument, baseOptions);
        }
export type CheckUnlockQueryHookResult = ReturnType<typeof useCheckUnlockQuery>;
export type CheckUnlockLazyQueryHookResult = ReturnType<typeof useCheckUnlockLazyQuery>;
export type CheckUnlockQueryResult = Apollo.QueryResult<CheckUnlockQuery, CheckUnlockQueryVariables>;
export const UnlockDocument = gql`
    mutation unlock($email: EmailAddress!, $password: String!, $unlockKey: String!) {
  unlock(email: $email, password: $password, unlockKey: $unlockKey) {
    user {
      ...UserInfo
    }
    error
  }
}
    ${UserInfoFragmentDoc}`;
export type UnlockMutationFn = Apollo.MutationFunction<UnlockMutation, UnlockMutationVariables>;

/**
 * __useUnlockMutation__
 *
 * To run a mutation, you first call `useUnlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlockMutation, { data, loading, error }] = useUnlockMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      unlockKey: // value for 'unlockKey'
 *   },
 * });
 */
export function useUnlockMutation(baseOptions?: Apollo.MutationHookOptions<UnlockMutation, UnlockMutationVariables>) {
        return Apollo.useMutation<UnlockMutation, UnlockMutationVariables>(UnlockDocument, baseOptions);
      }
export type UnlockMutationHookResult = ReturnType<typeof useUnlockMutation>;
export type UnlockMutationResult = Apollo.MutationResult<UnlockMutation>;
export type UnlockMutationOptions = Apollo.BaseMutationOptions<UnlockMutation, UnlockMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const SearchProgramDocument = gql`
    mutation searchProgram($id: String, $student_id: String) {
  program(id: $id, student_id: $student_id) {
    id
    name
    desc
    active
    groupedComplementary {
      timely_university_degree_rate
      total_students
      average_time_university_degree
      program_id
      curriculum
      type_admission
      cohort
      university_degree_rate
      current_retention_rate
      retention_rate
      inactive_time_rate
    }
    groupedEmployed {
      employed_rate
      total_students
      average_time_job_finding
      program_id
      curriculum
      type_admission
      cohort
      employed_rate_educational_system
    }
    courseGroupedStats {
      id
      program_id
      course_id
      curriculum
      type_admission
      cohort
      year
      term
      n_students
      n_total
      n_finished
      n_pass
      n_drop
      n_fail
      distribution {
        label
        value
      }
      color_bands {
        min
        max
        color
      }
    }
    externalEvaluationGroupedStats {
      id
      external_evaluation_id
      topic
      program_id
      curriculum
      type_admission
      cohort
      term
      n_students
      n_total
      n_finished
      n_pass
      n_drop
      n_fail
      distribution {
        label
        value
      }
      color_bands {
        min
        max
        color
      }
    }
    curriculums {
      id
      semesters {
        id
        courses {
          code
          name
          credits {
            label
            value
          }
          mention
          mode
          flow {
            code
          }
          requisites {
            code
          }
          historicalDistribution {
            label
            value
          }
          bandColors {
            min
            max
            color
          }
        }
        externalEvaluations {
          code
          name
          bandColors {
            min
            max
            color
          }
        }
      }
    }
  }
}
    `;
export type SearchProgramMutationFn = Apollo.MutationFunction<SearchProgramMutation, SearchProgramMutationVariables>;

/**
 * __useSearchProgramMutation__
 *
 * To run a mutation, you first call `useSearchProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSearchProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [searchProgramMutation, { data, loading, error }] = useSearchProgramMutation({
 *   variables: {
 *      id: // value for 'id'
 *      student_id: // value for 'student_id'
 *   },
 * });
 */
export function useSearchProgramMutation(baseOptions?: Apollo.MutationHookOptions<SearchProgramMutation, SearchProgramMutationVariables>) {
        return Apollo.useMutation<SearchProgramMutation, SearchProgramMutationVariables>(SearchProgramDocument, baseOptions);
      }
export type SearchProgramMutationHookResult = ReturnType<typeof useSearchProgramMutation>;
export type SearchProgramMutationResult = Apollo.MutationResult<SearchProgramMutation>;
export type SearchProgramMutationOptions = Apollo.BaseMutationOptions<SearchProgramMutation, SearchProgramMutationVariables>;
export const SearchStudentDocument = gql`
    mutation searchStudent($student_id: String, $program_id: String) {
  student(student_id: $student_id, program_id: $program_id) {
    id
    programs {
      id
      name
    }
    curriculums
    start_year
    n_courses_cycles
    n_cycles
    mention
    graduation_term
    terms {
      id
      student_id
      year
      term
      situation
      comments
      semestral_grade
      cumulated_grade
      program_grade
      takenCourses {
        id
        code
        equiv
        name
        registration
        grade
        state
        parallelGroup
        currentDistribution {
          label
          value
        }
        historicalDistribution {
          label
          value
        }
        bandColors {
          min
          max
          color
        }
      }
      takenExternalEvaluations {
        id
        code
        topic
        name
        registration
        state
        grade
        currentDistribution {
          label
          value
        }
        bandColors {
          min
          max
          color
        }
      }
    }
    dropout {
      prob_dropout
      model_accuracy
      active
    }
    admission {
      type_admission
    }
    employed {
      employed
      institution
      educational_system
      months_to_first_job
    }
    credits_passed
  }
}
    `;
export type SearchStudentMutationFn = Apollo.MutationFunction<SearchStudentMutation, SearchStudentMutationVariables>;

/**
 * __useSearchStudentMutation__
 *
 * To run a mutation, you first call `useSearchStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSearchStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [searchStudentMutation, { data, loading, error }] = useSearchStudentMutation({
 *   variables: {
 *      student_id: // value for 'student_id'
 *      program_id: // value for 'program_id'
 *   },
 * });
 */
export function useSearchStudentMutation(baseOptions?: Apollo.MutationHookOptions<SearchStudentMutation, SearchStudentMutationVariables>) {
        return Apollo.useMutation<SearchStudentMutation, SearchStudentMutationVariables>(SearchStudentDocument, baseOptions);
      }
export type SearchStudentMutationHookResult = ReturnType<typeof useSearchStudentMutation>;
export type SearchStudentMutationResult = Apollo.MutationResult<SearchStudentMutation>;
export type SearchStudentMutationOptions = Apollo.BaseMutationOptions<SearchStudentMutation, SearchStudentMutationVariables>;
export const MyProgramsDocument = gql`
    query myPrograms {
  myPrograms {
    id
    name
  }
}
    `;

/**
 * __useMyProgramsQuery__
 *
 * To run a query within a React component, call `useMyProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyProgramsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyProgramsQuery(baseOptions?: Apollo.QueryHookOptions<MyProgramsQuery, MyProgramsQueryVariables>) {
        return Apollo.useQuery<MyProgramsQuery, MyProgramsQueryVariables>(MyProgramsDocument, baseOptions);
      }
export function useMyProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyProgramsQuery, MyProgramsQueryVariables>) {
          return Apollo.useLazyQuery<MyProgramsQuery, MyProgramsQueryVariables>(MyProgramsDocument, baseOptions);
        }
export type MyProgramsQueryHookResult = ReturnType<typeof useMyProgramsQuery>;
export type MyProgramsLazyQueryHookResult = ReturnType<typeof useMyProgramsLazyQuery>;
export type MyProgramsQueryResult = Apollo.QueryResult<MyProgramsQuery, MyProgramsQueryVariables>;
export const GroupedSpecialTypesAdmissionDocument = gql`
    query groupedSpecialTypesAdmission {
  groupedSpecialTypesAdmission
}
    `;

/**
 * __useGroupedSpecialTypesAdmissionQuery__
 *
 * To run a query within a React component, call `useGroupedSpecialTypesAdmissionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupedSpecialTypesAdmissionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupedSpecialTypesAdmissionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGroupedSpecialTypesAdmissionQuery(baseOptions?: Apollo.QueryHookOptions<GroupedSpecialTypesAdmissionQuery, GroupedSpecialTypesAdmissionQueryVariables>) {
        return Apollo.useQuery<GroupedSpecialTypesAdmissionQuery, GroupedSpecialTypesAdmissionQueryVariables>(GroupedSpecialTypesAdmissionDocument, baseOptions);
      }
export function useGroupedSpecialTypesAdmissionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GroupedSpecialTypesAdmissionQuery, GroupedSpecialTypesAdmissionQueryVariables>) {
          return Apollo.useLazyQuery<GroupedSpecialTypesAdmissionQuery, GroupedSpecialTypesAdmissionQueryVariables>(GroupedSpecialTypesAdmissionDocument, baseOptions);
        }
export type GroupedSpecialTypesAdmissionQueryHookResult = ReturnType<typeof useGroupedSpecialTypesAdmissionQuery>;
export type GroupedSpecialTypesAdmissionLazyQueryHookResult = ReturnType<typeof useGroupedSpecialTypesAdmissionLazyQuery>;
export type GroupedSpecialTypesAdmissionQueryResult = Apollo.QueryResult<GroupedSpecialTypesAdmissionQuery, GroupedSpecialTypesAdmissionQueryVariables>;
export const TrackDocument = gql`
    mutation track($data: String!, $datetime_client: DateTime!) {
  track(data: $data, datetime_client: $datetime_client)
}
    `;
export type TrackMutationFn = Apollo.MutationFunction<TrackMutation, TrackMutationVariables>;

/**
 * __useTrackMutation__
 *
 * To run a mutation, you first call `useTrackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackMutation, { data, loading, error }] = useTrackMutation({
 *   variables: {
 *      data: // value for 'data'
 *      datetime_client: // value for 'datetime_client'
 *   },
 * });
 */
export function useTrackMutation(baseOptions?: Apollo.MutationHookOptions<TrackMutation, TrackMutationVariables>) {
        return Apollo.useMutation<TrackMutation, TrackMutationVariables>(TrackDocument, baseOptions);
      }
export type TrackMutationHookResult = ReturnType<typeof useTrackMutation>;
export type TrackMutationResult = Apollo.MutationResult<TrackMutation>;
export type TrackMutationOptions = Apollo.BaseMutationOptions<TrackMutation, TrackMutationVariables>;
export const ConfigDocument = gql`
    query config {
  config
}
    `;

/**
 * __useConfigQuery__
 *
 * To run a query within a React component, call `useConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function useConfigQuery(baseOptions?: Apollo.QueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
        return Apollo.useQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, baseOptions);
      }
export function useConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
          return Apollo.useLazyQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, baseOptions);
        }
export type ConfigQueryHookResult = ReturnType<typeof useConfigQuery>;
export type ConfigLazyQueryHookResult = ReturnType<typeof useConfigLazyQuery>;
export type ConfigQueryResult = Apollo.QueryResult<ConfigQuery, ConfigQueryVariables>;
export const StudentsListDocument = gql`
    query studentsList($program_id: String!) {
  students(program_id: $program_id) {
    id
    name
    progress
    start_year
    dropout {
      prob_dropout
      explanation
    }
    admission {
      type_admission
    }
  }
}
    `;

/**
 * __useStudentsListQuery__
 *
 * To run a query within a React component, call `useStudentsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsListQuery({
 *   variables: {
 *      program_id: // value for 'program_id'
 *   },
 * });
 */
export function useStudentsListQuery(baseOptions: Apollo.QueryHookOptions<StudentsListQuery, StudentsListQueryVariables>) {
        return Apollo.useQuery<StudentsListQuery, StudentsListQueryVariables>(StudentsListDocument, baseOptions);
      }
export function useStudentsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentsListQuery, StudentsListQueryVariables>) {
          return Apollo.useLazyQuery<StudentsListQuery, StudentsListQueryVariables>(StudentsListDocument, baseOptions);
        }
export type StudentsListQueryHookResult = ReturnType<typeof useStudentsListQuery>;
export type StudentsListLazyQueryHookResult = ReturnType<typeof useStudentsListLazyQuery>;
export type StudentsListQueryResult = Apollo.QueryResult<StudentsListQuery, StudentsListQueryVariables>;
export const StudentsFilterListDocument = gql`
    query studentsFilterList($program_id: String!, $curriculum: String!, $grouped: Boolean!) {
  students_filter(
    program_id: $program_id
    curriculum: $curriculum
    grouped: $grouped
  ) {
    id
    programs {
      id
    }
    curriculums
    start_year
    mention
    admission {
      type_admission
    }
    terms {
      year
      term
      semestral_grade
      comments
      program_id
    }
  }
}
    `;

/**
 * __useStudentsFilterListQuery__
 *
 * To run a query within a React component, call `useStudentsFilterListQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsFilterListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsFilterListQuery({
 *   variables: {
 *      program_id: // value for 'program_id'
 *      curriculum: // value for 'curriculum'
 *      grouped: // value for 'grouped'
 *   },
 * });
 */
export function useStudentsFilterListQuery(baseOptions: Apollo.QueryHookOptions<StudentsFilterListQuery, StudentsFilterListQueryVariables>) {
        return Apollo.useQuery<StudentsFilterListQuery, StudentsFilterListQueryVariables>(StudentsFilterListDocument, baseOptions);
      }
export function useStudentsFilterListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentsFilterListQuery, StudentsFilterListQueryVariables>) {
          return Apollo.useLazyQuery<StudentsFilterListQuery, StudentsFilterListQueryVariables>(StudentsFilterListDocument, baseOptions);
        }
export type StudentsFilterListQueryHookResult = ReturnType<typeof useStudentsFilterListQuery>;
export type StudentsFilterListLazyQueryHookResult = ReturnType<typeof useStudentsFilterListLazyQuery>;
export type StudentsFilterListQueryResult = Apollo.QueryResult<StudentsFilterListQuery, StudentsFilterListQueryVariables>;
export const ParametersDocument = gql`
    query parameters {
  parameters {
    id
    loading_type
    loading_date
  }
}
    `;

/**
 * __useParametersQuery__
 *
 * To run a query within a React component, call `useParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParametersQuery({
 *   variables: {
 *   },
 * });
 */
export function useParametersQuery(baseOptions?: Apollo.QueryHookOptions<ParametersQuery, ParametersQueryVariables>) {
        return Apollo.useQuery<ParametersQuery, ParametersQueryVariables>(ParametersDocument, baseOptions);
      }
export function useParametersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParametersQuery, ParametersQueryVariables>) {
          return Apollo.useLazyQuery<ParametersQuery, ParametersQueryVariables>(ParametersDocument, baseOptions);
        }
export type ParametersQueryHookResult = ReturnType<typeof useParametersQuery>;
export type ParametersLazyQueryHookResult = ReturnType<typeof useParametersLazyQuery>;
export type ParametersQueryResult = Apollo.QueryResult<ParametersQuery, ParametersQueryVariables>;
export const PerformanceLoadAdvicesDocument = gql`
    mutation performanceLoadAdvices($student_id: String, $program_id: String) {
  performanceLoadAdvices(student_id: $student_id, program_id: $program_id) {
    id
    loadUnit
    lowerBoundary
    upperBoundary
    failRateLow
    failRateMid
    failRateHigh
    adviceTitle
    adviceParagraph
    clusterLabel
    isStudentCluster
  }
}
    `;
export type PerformanceLoadAdvicesMutationFn = Apollo.MutationFunction<PerformanceLoadAdvicesMutation, PerformanceLoadAdvicesMutationVariables>;

/**
 * __usePerformanceLoadAdvicesMutation__
 *
 * To run a mutation, you first call `usePerformanceLoadAdvicesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePerformanceLoadAdvicesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [performanceLoadAdvicesMutation, { data, loading, error }] = usePerformanceLoadAdvicesMutation({
 *   variables: {
 *      student_id: // value for 'student_id'
 *      program_id: // value for 'program_id'
 *   },
 * });
 */
export function usePerformanceLoadAdvicesMutation(baseOptions?: Apollo.MutationHookOptions<PerformanceLoadAdvicesMutation, PerformanceLoadAdvicesMutationVariables>) {
        return Apollo.useMutation<PerformanceLoadAdvicesMutation, PerformanceLoadAdvicesMutationVariables>(PerformanceLoadAdvicesDocument, baseOptions);
      }
export type PerformanceLoadAdvicesMutationHookResult = ReturnType<typeof usePerformanceLoadAdvicesMutation>;
export type PerformanceLoadAdvicesMutationResult = Apollo.MutationResult<PerformanceLoadAdvicesMutation>;
export type PerformanceLoadAdvicesMutationOptions = Apollo.BaseMutationOptions<PerformanceLoadAdvicesMutation, PerformanceLoadAdvicesMutationVariables>;
export const DirectTakeCoursesDocument = gql`
    mutation directTakeCourses($student_id: String, $program_id: String) {
  directTakeCourses(student_id: $student_id, program_id: $program_id) {
    id
    code
  }
}
    `;
export type DirectTakeCoursesMutationFn = Apollo.MutationFunction<DirectTakeCoursesMutation, DirectTakeCoursesMutationVariables>;

/**
 * __useDirectTakeCoursesMutation__
 *
 * To run a mutation, you first call `useDirectTakeCoursesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDirectTakeCoursesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [directTakeCoursesMutation, { data, loading, error }] = useDirectTakeCoursesMutation({
 *   variables: {
 *      student_id: // value for 'student_id'
 *      program_id: // value for 'program_id'
 *   },
 * });
 */
export function useDirectTakeCoursesMutation(baseOptions?: Apollo.MutationHookOptions<DirectTakeCoursesMutation, DirectTakeCoursesMutationVariables>) {
        return Apollo.useMutation<DirectTakeCoursesMutation, DirectTakeCoursesMutationVariables>(DirectTakeCoursesDocument, baseOptions);
      }
export type DirectTakeCoursesMutationHookResult = ReturnType<typeof useDirectTakeCoursesMutation>;
export type DirectTakeCoursesMutationResult = Apollo.MutationResult<DirectTakeCoursesMutation>;
export type DirectTakeCoursesMutationOptions = Apollo.BaseMutationOptions<DirectTakeCoursesMutation, DirectTakeCoursesMutationVariables>;
export const IndirectTakeCoursesDocument = gql`
    mutation indirectTakeCourses($student_id: String, $program_id: String) {
  indirectTakeCourses(student_id: $student_id, program_id: $program_id) {
    course {
      id
      code
    }
    requisitesUnmet
  }
}
    `;
export type IndirectTakeCoursesMutationFn = Apollo.MutationFunction<IndirectTakeCoursesMutation, IndirectTakeCoursesMutationVariables>;

/**
 * __useIndirectTakeCoursesMutation__
 *
 * To run a mutation, you first call `useIndirectTakeCoursesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIndirectTakeCoursesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [indirectTakeCoursesMutation, { data, loading, error }] = useIndirectTakeCoursesMutation({
 *   variables: {
 *      student_id: // value for 'student_id'
 *      program_id: // value for 'program_id'
 *   },
 * });
 */
export function useIndirectTakeCoursesMutation(baseOptions?: Apollo.MutationHookOptions<IndirectTakeCoursesMutation, IndirectTakeCoursesMutationVariables>) {
        return Apollo.useMutation<IndirectTakeCoursesMutation, IndirectTakeCoursesMutationVariables>(IndirectTakeCoursesDocument, baseOptions);
      }
export type IndirectTakeCoursesMutationHookResult = ReturnType<typeof useIndirectTakeCoursesMutation>;
export type IndirectTakeCoursesMutationResult = Apollo.MutationResult<IndirectTakeCoursesMutation>;
export type IndirectTakeCoursesMutationOptions = Apollo.BaseMutationOptions<IndirectTakeCoursesMutation, IndirectTakeCoursesMutationVariables>;
export const GetPersistenceValueDocument = gql`
    query getPersistenceValue($key: String!) {
  getPersistenceValue(key: $key) {
    key
    data
  }
}
    `;

/**
 * __useGetPersistenceValueQuery__
 *
 * To run a query within a React component, call `useGetPersistenceValueQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersistenceValueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersistenceValueQuery({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useGetPersistenceValueQuery(baseOptions: Apollo.QueryHookOptions<GetPersistenceValueQuery, GetPersistenceValueQueryVariables>) {
        return Apollo.useQuery<GetPersistenceValueQuery, GetPersistenceValueQueryVariables>(GetPersistenceValueDocument, baseOptions);
      }
export function useGetPersistenceValueLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPersistenceValueQuery, GetPersistenceValueQueryVariables>) {
          return Apollo.useLazyQuery<GetPersistenceValueQuery, GetPersistenceValueQueryVariables>(GetPersistenceValueDocument, baseOptions);
        }
export type GetPersistenceValueQueryHookResult = ReturnType<typeof useGetPersistenceValueQuery>;
export type GetPersistenceValueLazyQueryHookResult = ReturnType<typeof useGetPersistenceValueLazyQuery>;
export type GetPersistenceValueQueryResult = Apollo.QueryResult<GetPersistenceValueQuery, GetPersistenceValueQueryVariables>;
export const SetPersistenceValueDocument = gql`
    mutation setPersistenceValue($key: String!, $data: JSONObject!) {
  setPersistenceValue(key: $key, data: $data) {
    __typename
  }
}
    `;
export type SetPersistenceValueMutationFn = Apollo.MutationFunction<SetPersistenceValueMutation, SetPersistenceValueMutationVariables>;

/**
 * __useSetPersistenceValueMutation__
 *
 * To run a mutation, you first call `useSetPersistenceValueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPersistenceValueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPersistenceValueMutation, { data, loading, error }] = useSetPersistenceValueMutation({
 *   variables: {
 *      key: // value for 'key'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSetPersistenceValueMutation(baseOptions?: Apollo.MutationHookOptions<SetPersistenceValueMutation, SetPersistenceValueMutationVariables>) {
        return Apollo.useMutation<SetPersistenceValueMutation, SetPersistenceValueMutationVariables>(SetPersistenceValueDocument, baseOptions);
      }
export type SetPersistenceValueMutationHookResult = ReturnType<typeof useSetPersistenceValueMutation>;
export type SetPersistenceValueMutationResult = Apollo.MutationResult<SetPersistenceValueMutation>;
export type SetPersistenceValueMutationOptions = Apollo.BaseMutationOptions<SetPersistenceValueMutation, SetPersistenceValueMutationVariables>;
export const UnansweredFormDocument = gql`
    query unansweredForm {
  unansweredForm {
    id
    name
    priority
    questions {
      id
      question
      type
      priority
      options {
        text
        value
      }
    }
  }
}
    `;

/**
 * __useUnansweredFormQuery__
 *
 * To run a query within a React component, call `useUnansweredFormQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnansweredFormQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnansweredFormQuery({
 *   variables: {
 *   },
 * });
 */
export function useUnansweredFormQuery(baseOptions?: Apollo.QueryHookOptions<UnansweredFormQuery, UnansweredFormQueryVariables>) {
        return Apollo.useQuery<UnansweredFormQuery, UnansweredFormQueryVariables>(UnansweredFormDocument, baseOptions);
      }
export function useUnansweredFormLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnansweredFormQuery, UnansweredFormQueryVariables>) {
          return Apollo.useLazyQuery<UnansweredFormQuery, UnansweredFormQueryVariables>(UnansweredFormDocument, baseOptions);
        }
export type UnansweredFormQueryHookResult = ReturnType<typeof useUnansweredFormQuery>;
export type UnansweredFormLazyQueryHookResult = ReturnType<typeof useUnansweredFormLazyQuery>;
export type UnansweredFormQueryResult = Apollo.QueryResult<UnansweredFormQuery, UnansweredFormQueryVariables>;
export const AnswerFeedbackFormDocument = gql`
    mutation answerFeedbackForm($answer: FeedbackAnswerInput!) {
  answerFeedbackForm(answer: $answer)
}
    `;
export type AnswerFeedbackFormMutationFn = Apollo.MutationFunction<AnswerFeedbackFormMutation, AnswerFeedbackFormMutationVariables>;

/**
 * __useAnswerFeedbackFormMutation__
 *
 * To run a mutation, you first call `useAnswerFeedbackFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnswerFeedbackFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [answerFeedbackFormMutation, { data, loading, error }] = useAnswerFeedbackFormMutation({
 *   variables: {
 *      answer: // value for 'answer'
 *   },
 * });
 */
export function useAnswerFeedbackFormMutation(baseOptions?: Apollo.MutationHookOptions<AnswerFeedbackFormMutation, AnswerFeedbackFormMutationVariables>) {
        return Apollo.useMutation<AnswerFeedbackFormMutation, AnswerFeedbackFormMutationVariables>(AnswerFeedbackFormDocument, baseOptions);
      }
export type AnswerFeedbackFormMutationHookResult = ReturnType<typeof useAnswerFeedbackFormMutation>;
export type AnswerFeedbackFormMutationResult = Apollo.MutationResult<AnswerFeedbackFormMutation>;
export type AnswerFeedbackFormMutationOptions = Apollo.BaseMutationOptions<AnswerFeedbackFormMutation, AnswerFeedbackFormMutationVariables>;
export const RiskNoticationDocument = gql`
    query riskNotication($program_id: String!, $risk_type: String!) {
  riskNotification(program_id: $program_id, risk_type: $risk_type) {
    student_id
    course_id
    program_id
    curriculum
    cohort
    risk_type
    details
  }
}
    `;

/**
 * __useRiskNoticationQuery__
 *
 * To run a query within a React component, call `useRiskNoticationQuery` and pass it any options that fit your needs.
 * When your component renders, `useRiskNoticationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRiskNoticationQuery({
 *   variables: {
 *      program_id: // value for 'program_id'
 *      risk_type: // value for 'risk_type'
 *   },
 * });
 */
export function useRiskNoticationQuery(baseOptions: Apollo.QueryHookOptions<RiskNoticationQuery, RiskNoticationQueryVariables>) {
        return Apollo.useQuery<RiskNoticationQuery, RiskNoticationQueryVariables>(RiskNoticationDocument, baseOptions);
      }
export function useRiskNoticationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RiskNoticationQuery, RiskNoticationQueryVariables>) {
          return Apollo.useLazyQuery<RiskNoticationQuery, RiskNoticationQueryVariables>(RiskNoticationDocument, baseOptions);
        }
export type RiskNoticationQueryHookResult = ReturnType<typeof useRiskNoticationQuery>;
export type RiskNoticationLazyQueryHookResult = ReturnType<typeof useRiskNoticationLazyQuery>;
export type RiskNoticationQueryResult = Apollo.QueryResult<RiskNoticationQuery, RiskNoticationQueryVariables>;
export const AnonHelpdeskUrlDocument = gql`
    mutation anonHelpdeskUrl {
  readAnonUrl
}
    `;
export type AnonHelpdeskUrlMutationFn = Apollo.MutationFunction<AnonHelpdeskUrlMutation, AnonHelpdeskUrlMutationVariables>;

/**
 * __useAnonHelpdeskUrlMutation__
 *
 * To run a mutation, you first call `useAnonHelpdeskUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnonHelpdeskUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [anonHelpdeskUrlMutation, { data, loading, error }] = useAnonHelpdeskUrlMutation({
 *   variables: {
 *   },
 * });
 */
export function useAnonHelpdeskUrlMutation(baseOptions?: Apollo.MutationHookOptions<AnonHelpdeskUrlMutation, AnonHelpdeskUrlMutationVariables>) {
        return Apollo.useMutation<AnonHelpdeskUrlMutation, AnonHelpdeskUrlMutationVariables>(AnonHelpdeskUrlDocument, baseOptions);
      }
export type AnonHelpdeskUrlMutationHookResult = ReturnType<typeof useAnonHelpdeskUrlMutation>;
export type AnonHelpdeskUrlMutationResult = Apollo.MutationResult<AnonHelpdeskUrlMutation>;
export type AnonHelpdeskUrlMutationOptions = Apollo.BaseMutationOptions<AnonHelpdeskUrlMutation, AnonHelpdeskUrlMutationVariables>;
export const LoginTestDocument = gql`
    mutation LoginTest($email: EmailAddress!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      email
    }
    token
    error
  }
}
    `;
export type LoginTestMutationFn = Apollo.MutationFunction<LoginTestMutation, LoginTestMutationVariables>;

/**
 * __useLoginTestMutation__
 *
 * To run a mutation, you first call `useLoginTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginTestMutation, { data, loading, error }] = useLoginTestMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginTestMutation(baseOptions?: Apollo.MutationHookOptions<LoginTestMutation, LoginTestMutationVariables>) {
        return Apollo.useMutation<LoginTestMutation, LoginTestMutationVariables>(LoginTestDocument, baseOptions);
      }
export type LoginTestMutationHookResult = ReturnType<typeof useLoginTestMutation>;
export type LoginTestMutationResult = Apollo.MutationResult<LoginTestMutation>;
export type LoginTestMutationOptions = Apollo.BaseMutationOptions<LoginTestMutation, LoginTestMutationVariables>;
export const UnlockTestDocument = gql`
    mutation UnlockTest($email: EmailAddress!, $password: String!, $unlockKey: String!) {
  unlock(email: $email, password: $password, unlockKey: $unlockKey) {
    user {
      email
    }
    token
    error
  }
}
    `;
export type UnlockTestMutationFn = Apollo.MutationFunction<UnlockTestMutation, UnlockTestMutationVariables>;

/**
 * __useUnlockTestMutation__
 *
 * To run a mutation, you first call `useUnlockTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlockTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlockTestMutation, { data, loading, error }] = useUnlockTestMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      unlockKey: // value for 'unlockKey'
 *   },
 * });
 */
export function useUnlockTestMutation(baseOptions?: Apollo.MutationHookOptions<UnlockTestMutation, UnlockTestMutationVariables>) {
        return Apollo.useMutation<UnlockTestMutation, UnlockTestMutationVariables>(UnlockTestDocument, baseOptions);
      }
export type UnlockTestMutationHookResult = ReturnType<typeof useUnlockTestMutation>;
export type UnlockTestMutationResult = Apollo.MutationResult<UnlockTestMutation>;
export type UnlockTestMutationOptions = Apollo.BaseMutationOptions<UnlockTestMutation, UnlockTestMutationVariables>;
export const CurrentUserTestDocument = gql`
    query CurrentUserTest {
  currentUser {
    user {
      email
    }
    token
    error
  }
}
    `;

/**
 * __useCurrentUserTestQuery__
 *
 * To run a query within a React component, call `useCurrentUserTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserTestQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserTestQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserTestQuery, CurrentUserTestQueryVariables>) {
        return Apollo.useQuery<CurrentUserTestQuery, CurrentUserTestQueryVariables>(CurrentUserTestDocument, baseOptions);
      }
export function useCurrentUserTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserTestQuery, CurrentUserTestQueryVariables>) {
          return Apollo.useLazyQuery<CurrentUserTestQuery, CurrentUserTestQueryVariables>(CurrentUserTestDocument, baseOptions);
        }
export type CurrentUserTestQueryHookResult = ReturnType<typeof useCurrentUserTestQuery>;
export type CurrentUserTestLazyQueryHookResult = ReturnType<typeof useCurrentUserTestLazyQuery>;
export type CurrentUserTestQueryResult = Apollo.QueryResult<CurrentUserTestQuery, CurrentUserTestQueryVariables>;