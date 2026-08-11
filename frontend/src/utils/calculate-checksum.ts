export async function calculateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        buffer
    );

    const hashArray = new Uint8Array(hashBuffer);

    let binary = "";

    for (const byte of hashArray) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}