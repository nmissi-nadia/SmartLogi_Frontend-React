export const parseRoles = (decodedToken: any): string[] => {
    // 1. Try 'authorities' or 'roles'
    const rawRoles = decodedToken.authorities || decodedToken.roles;

    if (!rawRoles) return [];

    // 2. If valid array, return it (assuming it's strings or objects with 'authority')
    if (Array.isArray(rawRoles)) {
        return rawRoles.map((r: any) => {
            if (typeof r === 'string') return r;
            if (typeof r === 'object' && r.authority) return r.authority; // Spring Security standard
            return String(r);
        });
    }

    // 3. If string, split by comma (fallback)
    if (typeof rawRoles === 'string') {
        return rawRoles.split(',').map(r => r.trim());
    }

    return [];
};
