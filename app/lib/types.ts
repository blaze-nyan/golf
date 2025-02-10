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
export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  surname: string;
}

export interface ClientInfo {
  "Client ID": number;
  "Create New"?: boolean;
  "Client Code"?: string;
  Title?: string;
  "First Name"?: string;
  Surname?: string;
  "Given Name"?: string;
  Company?: string;
  Gender?: string;
}
export interface ClientImage {
  "Client ID": number;
  "Image ID": number;
  "Image UID"?: string;
  Description: string;
  "Image Usage": number;
  "Record Marked Deleted": boolean;
}

export interface ProfileData {
  "Client ID": number;
  "Client Code": string;
  Title: string;
  "First Name": string;
  Surname: string;
  "Given Name": string;
  Company: string;
  Gender: string;
  "Birth Date": number;
  Language: string;
  Nationality: string;
  "Passport Number": string;
  "ID Number": string;
  "Passport or ID": string;
  Designation: string;
}
