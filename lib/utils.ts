import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const file_to_base64 = async (a_file: File) => {
  let a_function = 
    (file: File) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64_string = String(reader.result).split(",")[1]
        resolve(base64_string)
      };
      reader.onerror = error => reject(error);
    })
    return (await a_function(a_file) as string)
}

export function hasTimePassed(obj: { timeUntilHalving: any }) {
  // Check if obj is defined and contains the property "timeUntilHalving"
  if (!obj || !obj.timeUntilHalving) {
      console.error('Invalid input object or missing "timeUntilHalving" property.');
      return false; // Assuming time has not passed if input is invalid
  }

  const timeUntilHalving = obj.timeUntilHalving;

  // Extracting days, hours, and minutes from the string
  const match = timeUntilHalving.match(/\d+/g);

  // Check if match is null (no digits found in the string)
  if (!match) {
      console.error('Invalid format for "timeUntilHalving".');
      return false; // Assuming time has not passed if format is invalid
  }

  const [days, hours, minutes] = match.map((num: string) => parseInt(num));

  // Calculating total milliseconds until halving
  const totalMilliseconds = days * 24 * 60 * 60 * 1000 +
                             hours * 60 * 60 * 1000 +
                             minutes * 60 * 1000;

  // Comparing with current time
  const currentTime = new Date().getTime();
  const halvingTime = currentTime + totalMilliseconds;

  // Checking if halving time has passed
  console.log(`Is Past Time Until Halving: ${halvingTime < currentTime}`)
  return halvingTime < currentTime;
}
