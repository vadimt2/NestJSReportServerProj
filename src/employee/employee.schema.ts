import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
export const EmployeeSchema = new mongoose.Schema({

  verifiedEmail: {
    type: Boolean
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    select: false,
  },
  employeeRole: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  dataReport: [
    {
      shiftDate: {
        type: Date,
      },
      startShift: {
        type: Date,
      },
      endShift: {
        type: Date,
      },
      comment:[
        
      ],
      coordinates: [
        {
          lat: {
            type: Number,
          },
          lng: {
            type: Number,
          },
        }
      ]
    }
  ]

});


EmployeeSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});