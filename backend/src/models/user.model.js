const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false // Do not return password by default when querying
        },
        role: {
            type: String,
            enum: ['user', 'seller', 'admin'],
            default: 'user'
        },
        phone: {
            type: String,
            trim: true
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        isBanned: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },

        // ── Password Reset ────────────────────────────────────────────────────
        resetPasswordToken: {
            type: String,
            select: false
        },
        resetPasswordExpire: {
            type: Date,
            select: false
        }
    },
    {
        timestamps: true // Tracks createdAt and updatedAt automatically
    }
);

// Pre-save hook: Encrypt password using bcrypt before saving to DB
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return;
    }
    
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Check if entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
