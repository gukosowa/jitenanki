// Create a new Worker from the 'sqlWorker.ts' module.
const worker = new Worker(new URL('./sqlWorker.ts', import.meta.url), { type: 'module' })

// A flag to indicate if the worker is ready to execute SQL commands.
let isReady = false

// A queue to hold SQL commands until the worker is ready to process them.
const commandQueue: { type: string; sql: string; params: any[]; id: string }[] = []

// A Map to store the resolve and reject functions for each command, indexed by a unique command ID.
const callbacks = new Map()

// Event listener for messages coming from the worker.
worker.onmessage = (e: MessageEvent) => {
  console.log('Message from worker:', e.data) // Log all messages from the worker for debugging.

  // Handle different types of messages based on their 'type' attribute.
  switch (e.data.type) {
    case 'ready':
      // Set the worker status to ready.
      isReady = true
      // Process each command in the queue.
      commandQueue.forEach((cmd) => worker.postMessage(cmd))
      // Clear the queue after processing.
      commandQueue.length = 0
      break
    case 'result':
    case 'error':
      // Retrieve the stored callbacks using the command ID.
      const { resolve, reject } = callbacks.get(e.data.id)
      if (e.data.type === 'result') {
        // Resolve the promise with the payload if the command was successful.
        resolve(e.data.payload)
      } else {
        // Reject the promise with an error if the command failed.
        reject(new Error(e.data.payload))
      }
      // Remove the callback from the map to free memory.
      callbacks.delete(e.data.id)
      break
  }
}

/**
 * Executes a SQL command using the worker.
 * @param sql The SQL query string. This should be a valid SQL command.
 * @param params An array of parameters for parameterized SQL statements.
 * @returns A Promise that resolves with the result of the SQL command or rejects with an error.
 *
 * Example Usage:
 *
 * // Example 1: Execute a simple SQL query to retrieve all table names in a SQLite database.
 * exec('SELECT name FROM sqlite_master WHERE type="table"')
 *   .then(results => console.log('Tables:', results))
 *   .catch(error => console.error('Error:', error));
 *
 * // Example 2: Execute a parameterized SQL query to insert data into a table.
 * const insertQuery = 'INSERT INTO users (name, age) VALUES (?, ?)';
 * const userData = ['John Doe', 30];
 * exec(insertQuery, userData)
 *   .then(result => console.log('Insert result:', result))
 *   .catch(error => console.error('Insert error:', error));
 */
export function exec(sql: string, params: any[] = []): Promise<any> {
  // Generate a unique ID for this command to correlate requests and responses.
  const id = performance.now().toString()
  return new Promise((resolve, reject) => {
    // Create a command object including the SQL, parameters, and command ID.
    const command = { type: 'exec', sql, params, id }
    // Store the resolve and reject functions in the map using the command ID.
    callbacks.set(id, { resolve, reject })
    if (isReady) {
      // Post the command to the worker if it is ready.
      worker.postMessage(command)
    } else {
      // Queue the command if the worker is not yet ready.
      commandQueue.push(command)
    }
  })
}
