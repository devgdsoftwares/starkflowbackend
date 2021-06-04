import { Int32 } from 'mongodb';
import * as mongoose from 'mongoose';

const user = new mongoose.Schema(
  {
    id: {
      type: String,
      // required: true,
      index: true,
      description: 'ID of the user'
    },
    customerId: {
      type: String,
      default: null
    },
    name: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    emailAddress: {
      type: String
    },
    email: {
      type: String,
      index: true
    },
    company: {
      type: String,
      description: 'Company of the user - From GH for candidates and for HRs from LI'
    },
    ghCreated: {
      type: Date,
      description: 'Github created at field for the user.'
    },
    avatar: {
      type: String,
      default: ''
    },
    resume: {
      type: String
    },
    resume_name: {
      type: String
    },
    hiring_status: {
      status: Number,
      job: mongoose.Schema.Types.ObjectId
    },
    login: {
      type: String
    },
    approved: {
      type: Boolean,
      default: 1
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'candidate']
      // default: 'candidate'
    },
    unregistered_role: {
      type: String,
      enum: ['hr', 'candidate']
    },
    onboarding: {
      type: Boolean,
      default: true,
      description:
        'If the user has to go through the on boarding process. Helpful when user has created account and run away'
    },
    skills: {
      type: [],
      default: []
    },
    designation: {
      type: String
    },
    summary: {
      type: String
    },
    phone: {
      type: String
    },
    skypeId: {
      type: String
    },
    can_edit: {
      name: false,
      email: false
    },
    education: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'School'
        },
        name: String
      }
    ],
    projects: {
      type: [],
      default: []
    },
    last_logged_in: {
      type: Date,
      default: new Date()
    },
    password: {
      type: String
    },
    experience_role: {
      type: String
    },
    looking_for: {
      type: Array
    },
    availability: {
      type: String
    },
    salary: {
      type: Object
    },
    locations: {
      type: Array
    },
    location: {
      type: String
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    admin_approve: {
      type: Boolean,
      default: false
    },
    email_approve: {
      type: Boolean,
      default: true
    },
    profile_status: {
      type: String,
      default: 'Incomplete'
    },
    experience: {
      type: Object
    },
    payment_id: {
      type: Array
    },
    invitationCount: {
      type: Number,
      default: 0
    },
    autoMatch: {
      type: Boolean,
      default: true
    },
    fluency: {
      type: String,
      default: ''
    },
    timezone: {
      type: Array,
      default: []
    },
    expected_salary: Number
  },
  {
    strict: false,
    timestamps: true
  }
);

export default mongoose.model('User', user);
