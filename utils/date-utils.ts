export type Timestamp<T> = {
	value: T;
	timestamp: number;

	// Add other properties if needed
};

// Function to convert Date to Timestamp<Date>
export function toTimestamp(timeString: string): Timestamp<Date> {
	const [hours, minutes, seconds] = timeString.split(":").map(Number);
	const date = new Date();
	date.setHours(hours, minutes, seconds, 0);
	return { value: date, timestamp: date.getTime() };
}
