// app/lib/types.ts
export interface RawGolfCourse {
  "Golf Course ID": number;
  "Golf Course Name": string;
  "Golf Course Description": string;
  "Golf Course Fee Stock ID": number;
  "Allow Cross Over": boolean;
  "Number of Holes": number;
  "Golf Course Par": number;
  "Is Virtual": boolean;
  "Golf Course Image UID": string;
  "Golf Course Stock Status ID": number;
  "Golf Course Holes": number[];
  "Golf Course Notes": undefined[];
}

export interface GolfCourse {
  golfCourseId: number;
  golfCourseName: string;
  golfCourseDescription: string;
  golfCourseFeeStockId: number;
  allowCrossOver: boolean;
  numberOfHoles: number;
  golfCoursePar: number;
  isVirtual: boolean;
  golfCourseImageUid: string;
  golfCourseStockStatusId: number;
  golfCourseHoles: number[];
  golfCourseNotes: undefined[];
}
