import exp from "constants";
import { CallHandler } from "@nestjs/common";

// businesses_members table enum
export enum BUSINESS_MEMBER_TYPE {
	ADMIN = "admin",
	MANAGER = "manager",
	EDITOR = "editor",
	EMPLOYEE = "employee",
}
export enum EMPLOYEE_TYPE {
	PERMANENT = "permanent",
	ON_PROBATION = "on_probation",
	CONTRACTUAL = "contractual",
	INTERN = "intern",
}
export enum EMPLOYEE_STATUS {
	ACTIVE = "active",
	INACTIVE = "inactive",
	INVITED = "invited",
}

// For attendances table
export enum ATTENDANCE_STATUS {
	ON_TIME = "on_time",
	LATE = "late",
	ABSENT = "absent",
	LEFT_EARLY = "left_early",
	LEFT_TIMELY = "left_timely",
}

// For business_office_hours table
export enum OFFICE_HOURS_TYPE {
	AS_PER_CALENDAR = "as_per_calendar",
	FIXED = "fixed",
}

// For business_attendance_types table
export enum ATTENDANCE_TYPE {
	REMOTE = "remote",
	IP_BASED = "ip_based",
	LOCATION_BASED = "location_based",
	DEVICE = "device",
}

export enum ATTENDANCE_LOG_TYPE {
	CHECKIN = "checkin",
	CHECKOUT = "checkout",
}
// For office_policy_rules table
export enum POLICY_TYPE {
	GRACE_PERIOD = "grace_period",
	LATE_CHECKIN_EARLY_CHECKOUT = "late_checkin_early_checkout",
	UNPAID_LEAVE = "unpaid_leave",
}

export enum POLICY_ACTION {
	NO_PENALTY = "no_penalty",
	LEAVE_ADJUSTMENT = "leave_adjustment",
	SALARY_ADJUSTMENT = "salary_adjustment",
	CASH_PENALTY = "cash_penalty",
}

export enum HALF_DAY_CONFIGURATION {
	ENABLE = 1,
	DISABLE = 0,
}

export enum ACCOUNT_TYPE {
	SAVINGS = "savings",
	CURRENT = "current",
}

// profiles bank information table enum
export enum PURPOSE {
	PWW = "partner_wallet_withdrawal",
	OTHER = "other",
}

//ticketing
export enum DepartmentStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
}
export enum Gender {
	MALE = "male",
	FEMALE = "female",
	OTHER = "other",
}

export enum BloodGroup {
	A_POSITIVE = "A+",
	A_NEGATIVE = "A-",
	B_POSITIVE = "B+",
	B_NEGATIVE = "B-",
	AB_POSITIVE = "AB+",
	AB_NEGATIVE = "AB-",
	O_POSITIVE = "O+",
}

export enum ShiftPriorityEnum {
	HIGH = "high",
	MEDIUM = "medium",
	LOW = "low",
}

export enum TicketStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
}

export enum RequiredFieldsType {
	DROPDOWN = "dropdown",
	FILE_UPLOAD = "file_upload",
	MULTIPLE_CHOICE = "multiple_choice",
	CHECKBOXES = "checkboxes",
}
