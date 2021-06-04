import { isEmail } from 'validator';

export default class UserService {

  static getUpdateValidationErrors(user, data) {
    console.log('userssss' , user)
    if (user.role === 'candidate') {
      return UserService.validateCandidate(user, data);
    } else {
      return UserService.validateHR(user, data);
    }
  }

  static validateCandidate(user, data) {
    const errors = [];
    
    // Name
    if (!user.name && !data.name) {
      errors.push({ path: 'name', message: 'Name is required.' });
    }
    //phone number
    // if (!user.phone && !data.phone) {
    //   errors.push({ path: 'phone', message: 'Phone no. is required.' });
    // }
   
    // Email
    if (!data.email && !user.email) {
      errors.push({ path: 'email', message: 'Email is required.' });
    }

    // Valid Email (Only from data, because user email will be valid)
    if (data.email && !isEmail(data.email)) {
      errors.push({ path: 'email', message: 'Email must be valid.' });
    }

    // Resume
    // if (!data.resume) {
    //   errors.push({ path: 'resume', message: 'Resume is required.' });
    // }

    // Summary
    // if (!data.summary) {
    //   errors.push({ path: 'summary', message: 'Summary is required.' });
    // }

    // Designation
    if (!data.designation) {
      errors.push({ path: 'designation', message: 'Designation is required.' });
    }

    // Skills
    if (!data.skills) {
      errors.push({ path: 'skills', message: 'Skill is required.' });
    }

    // Type of work loking for
    if (user.looking_for.length <= 0 && data.looking_for.length <= 0) {
      errors.push({ path: 'looking_for', message: 'Work type looking for is required.' });
    }

    // User availability
    // if (!user.availability && !data.availability) {
    //   errors.push({ path: 'availability', message: 'Availability is required.' });
    // }

    // User experience
    if (!data.experience) {
      errors.push({ path: 'experience', message: 'Experience is required.' });
    }

    // User industry
    // if (!data.industry) {
    //   errors.push({ path: 'industry', message: 'Industry is required.' });
    // }

    // User education
    // if (data.education.length <= 0) {
    //   errors.push({ path: 'education', message: 'Education is required.' });
    // }
    
    if (!data.salary.value) {
      errors.push({ path: 'salary', message: 'Salary is required.' });
    }
    
    
    console.log('users' , user , data)
    return Object.keys(errors).length > 0 ? errors : false;
  }

  static validateHR(user, data) {
    const errors = [];

    // Name
    if (!user.name && !data.name) {
      errors.push({ path: 'name', message: 'Name is required.' });
    }

    // Email
    if (!data.email && !user.email) {
      errors.push({ path: 'email', message: 'Email is required.' });
    }

    // Valid Email (Only from data, because user email will be valid)
    if (data.email && !isEmail(data.email)) {
      errors.push({ path: 'email', message: 'Email must be valid.' });
    }

    return Object.keys(errors).length > 0 ? errors : false;
  }
}