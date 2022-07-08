const getCurDateISO = () => new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T').shift();

export default getCurDateISO;
