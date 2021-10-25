const { celebrator } = require('celebrate');

const celebrate = celebrator({}, { abortEarly: true });

export default celebrate;
