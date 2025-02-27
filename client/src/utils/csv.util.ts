export async function parseCSV(csv: File): Promise<string[] | Error> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error("Failed to read CSV file"));
          return;
        }
  
        const text = event.target.result as string;
        const lines = text.split(/\r?\n/).map(line => line.trim()); // Split by new lines & trim spaces
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation
  
        const emails: string[] = [];
  
        for (const line of lines) {
          if (line === "") continue; // Ignore empty lines
  
          const columns = line.split(",");
          if (columns.length !== 1) {
            reject(new Error("Invalid CSV format: Each line should contain exactly one email"));
            return;
          }
  
          const email = columns[0].trim();
          if (!emailRegex.test(email)) {
            reject(new Error(`Invalid email format: ${email}`));
            return;
          }
  
          emails.push(email);
        }
  
        if (emails.length === 0) {
          reject(new Error("No valid emails found in the CSV file"));
        } else {
          resolve(emails);
        }
      };
  
      reader.onerror = () => reject(new Error("Error reading CSV file"));
      reader.readAsText(csv);
    });
  }
  