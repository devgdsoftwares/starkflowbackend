import * as mongoose from 'mongoose';

const hrRoles = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('hr_roles', hrRoles);