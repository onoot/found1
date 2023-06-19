export const authenticated = (handler) => async (req, res) => {
    const token = req.cookies?.token || '';

    try {
        const result = await fetch('/api/auth/validation', { credentials: 'include' })

        req.user = result.user;
        handler(req, res);
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};
