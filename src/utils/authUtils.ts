export const parseRoles = (decodedToken: any): string[] => {
    console.log('parseRoles - Decoded token:', decodedToken);

    // 1. Try 'authorities' or 'roles'
    const rawRoles = decodedToken.authorities || decodedToken.roles;
    console.log('parseRoles - Raw roles:', rawRoles);

    if (!rawRoles) {
        console.log('parseRoles - No roles found, returning empty array');
        return [];
    }

    // 2. If valid array, return it (assuming it's strings or objects with 'authority')
    if (Array.isArray(rawRoles)) {
        console.log('parseRoles - Roles is array');
        const parsed = rawRoles.map((r: any) => {
            if (typeof r === 'string') return r;
            if (typeof r === 'object' && r.authority) return r.authority; // Spring Security standard
            return String(r);
        });
        console.log('parseRoles - Parsed array roles:', parsed);
        return parsed;
    }

    // 3. If string, split by comma (fallback)
    if (typeof rawRoles === 'string') {
        console.log('parseRoles - Roles is string, splitting by comma');
        const parsed = rawRoles.split(',').map(r => r.trim());
        console.log('parseRoles - Parsed string roles:', parsed);
        return parsed;
    }

    console.log('parseRoles - Unknown format, returning empty array');
    return [];
};
