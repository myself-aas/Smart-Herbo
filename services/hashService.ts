/**
 * Local hashing utilities for data‑sovereignty compliance.
 * Uses the Web Crypto API (SHA‑256) to generate an irreversible identifier
 * for a captured image. The hash is never sent off‑device; it is stored only
 * in local storage for diagnostic logging.
 */

/**
 * Compute a SHA‑256 hash of a base64‑encoded image string.
 * Returns the hex representation of the digest.
 */
export const hashImageBase64 = async (base64: string): Promise<string> => {
  // Strip any data URL prefix (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, "");
  // Decode base64 to a Uint8Array
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Compute SHA‑256 digest
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

/**
 * Persist a diagnostic log entry locally. The log is kept in `localStorage`
 * under the key `bovinemetric_diagnostic_log`. Each entry includes a timestamp
 * and the image hash. This approach avoids any network transmission.
 */
export const appendDiagnosticLog = (hash: string): void => {
  const key = "bovinemetric_diagnostic_log";
  const existing = localStorage.getItem(key);
  const logs: { ts: number; hash: string }[] = existing ? JSON.parse(existing) : [];
  logs.push({ ts: Date.now(), hash });
  localStorage.setItem(key, JSON.stringify(logs));
};
