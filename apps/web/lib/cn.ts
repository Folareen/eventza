type ClassValue = string | number | bigint | null | undefined | boolean | ClassValue[];

/** Join conditional class names. Later values win only by source order -
 *  this does not resolve conflicting Tailwind utilities, so keep variant
 *  maps mutually exclusive. */
export function cn(...inputs: ClassValue[]): string {
    const out: string[] = [];
    const walk = (v: ClassValue) => {
        if (!v && v !== 0) return;
        if (Array.isArray(v)) { v.forEach(walk); return; }
        out.push(String(v));
    };
    inputs.forEach(walk);
    return out.join(' ');
}
