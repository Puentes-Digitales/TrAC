import { StateCourse } from "../client/constants";

export type ITakenSemester = {
  year: number;
  term: string;
};
export type IRangeGrade = {
  min: number;
  max: number;
  color: string;
};
export type IDistribution = {
  label: string;
  value: number;
};

export type ITakenCourse = {
  term: string;
  year: number;
  equiv: string;
  registration?: string;
  grade?: number;
  state?: StateCourse;
  currentDistribution?: IDistribution[];
  parallelGroup?: number;
  bandColors?: { min: number; max: number; color: string }[];
};

export type ICourse = {
  code: string;
  name: string;
  credits: { label: string; value: number }[];
  flow: string[];
  requisites: string[];
  historicDistribution: IDistribution[];
  taken: ITakenCourse[];
  bandColors: { min: number; max: number; color: string }[];
};

export type IExternalEvaluation = {
  code: string;
  name: string;
  taken: ITakenExternalEvaluation[];
  bandColors: { min: number; max: number; color: string }[];
};

export type ITakenExternalEvaluation = {
  term: string;
  year: number;
  registration?: string;
  grade?: number;
  topic: string;
  state?: StateCourse;
  currentDistribution?: IDistribution[];
  bandColors?: { min: number; max: number; color: string }[];
};

export type IGroupedCourse = {
  code: string;
  name: string;
  credits: { label: string; value: number }[];
  flow: string[];
  requisites: string[];
  historicDistribution: IDistribution[];
  agroupedDistribution: IDistribution[];
  n_total: number;
  n_passed: number;
  bandColors: { min: number; max: number; color: string }[];
  agroupedBandColors: { min: number; max: number; color: string }[];
};

export * from "./utils";
