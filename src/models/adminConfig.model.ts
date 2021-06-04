import * as mongoose from 'mongoose';

const AdminConfig = new mongoose.Schema({
    minSalary: {
        type: Number
    },
    maxSalary: {
        type: Number
    },
    minExperience: {
        type: Number
    },
    maxExperience: {
        type: Number
    },
    minJobsSalary: {
        type: Number
    },
    maxJobsSalary: {
        type: Number
    },
}, {
    strict: false,
    timestamps: true
});

export default mongoose.model('AdminConfig', AdminConfig);

