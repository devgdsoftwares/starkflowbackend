import * as mongoose from 'mongoose';

const slack = new mongoose.Schema({
    access_token: String,
    scope: String,
    user_id: String,
    team_id: String,
    channel_id: String,
    url: String,
    sourceableUserId:mongoose.Schema.Types.ObjectId,
}, {
  timestamps: true
});

export default mongoose.model('Slack', slack);