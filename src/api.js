const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const QUESTION_COUNT = import.meta.env.VITE_QUESTION_COUNT || 5;

export const fetchQuestions = async () => {
    try {
        const response = await fetch(`${GAS_URL}?count=${QUESTION_COUNT}`);
        if (!response.ok) throw new Error('Fetch failed');
        return await response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
        // Fallback or empty
        return [];
    }
};

export const submitResult = async (userId, score, total) => {
    try {
        // Use text/plain to avoid CORS preflight (OPTIONS request)
        // Google Apps Script cannot handle preflight requests.
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({ userId, score, total }),
        });
        return { status: 'success' };
    } catch (error) {
        console.error('Error submitting result:', error);
        return { status: 'error' };
    }
};
