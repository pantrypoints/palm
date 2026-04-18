import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
// Add `questions` to your imports here
import { user, questions } from '$lib/db/schema.js'; 
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { setSessionAsync } from '$lib/session.js';
import ImageKit from 'imagekit';

// Import environment variables securely
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: publicEnv.PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: privateEnv.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: publicEnv.PUBLIC_IMAGEKIT_URL_ENDPOINT
});

// Helper function to handle the file upload
async function uploadToImageKit(file, fileName) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        imagekit.upload({
            file: buffer,
            fileName: fileName,
            folder: '/palms' 
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result.url);
        });
    });
}

export async function load({ locals }) {
    if (locals.user) {
        throw redirect(302, '/profile');
    }
    return {};
}

export const actions = {
    register: async ({ request, cookies }) => {
        const data = await request.formData();
        
        const username = data.get('username')?.toString().trim();
        const password = data.get('password')?.toString();
        const passwordConfirm = data.get('passwordConfirm')?.toString();
        const gender = data.get('gender')?.toString();
        const dateOfBirth = data.get('dateOfBirth')?.toString() || null;
        const job = data.get('job')?.toString().trim() || null;
        const handed = data.get('handed')?.toString() || null;
        
        // --- RESTORED QUESTION VARIABLES ---
        const q1 = data.get('q1')?.toString().trim() || null;
        const q2 = data.get('q2')?.toString().trim() || null;
        const q3 = data.get('q3')?.toString().trim() || null;
        
        const leftPalmFile = data.get('leftPalm');
        const rightPalmFile = data.get('rightPalm');

        const errors = {};

        // Basic Validation
        if (!username || username.length < 3) errors.username = 'Username must be at least 3 characters.';
        if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
        if (password !== passwordConfirm) errors.passwordConfirm = 'Passwords do not match.';
        if (!gender) errors.gender = 'Please select a gender.';
        
        // File Validation
        if (!leftPalmFile || leftPalmFile.size === 0) errors.leftPalm = 'Left palm photo is required.';
        if (!rightPalmFile || rightPalmFile.size === 0) errors.rightPalm = 'Right palm photo is required.';

        // --- ADDED QUESTIONS TO VALUES OBJECT SO THEY DON'T CLEAR ON ERROR ---
        if (Object.keys(errors).length > 0) {
            return fail(422, { 
                errors, 
                values: { username, gender, dateOfBirth, job, handed, q1, q2, q3 } 
            });
        }

        // Check username uniqueness
        const [existing] = await db.select().from(user).where(eq(user.username, username)).limit(1);
        if (existing) {
            return fail(422, { 
                errors: { username: 'Username already taken.' }, 
                values: { username, gender, dateOfBirth, job, handed, q1, q2, q3 } 
            });
        }

        let leftPalmUrl, rightPalmUrl;

        try {
            const timestamp = Date.now();
            leftPalmUrl = await uploadToImageKit(leftPalmFile, `left_${username}_${timestamp}`);
            rightPalmUrl = await uploadToImageKit(rightPalmFile, `right_${username}_${timestamp}`);
        } catch (uploadError) {
            console.error("ImageKit Upload Error:", uploadError);
            return fail(500, { 
                errors: { server: 'Failed to upload images. Please try again.' },
                values: { username, gender, dateOfBirth, job, handed, q1, q2, q3 }
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        
        const [newUser] = await db.insert(user).values({
            username, 
            passwordHash, 
            gender, 
            dateOfBirth, 
            job, 
            handed, 
            leftPalmUrl, 
            rightPalmUrl 
        }).returning();

        // --- RESTORED QUESTION SAVING LOGIC ---
        if (q1 || q2 || q3) {
            const qs = [q1, q2, q3].filter(Boolean).map(content => ({ content, userId: newUser.id }));
            if (qs.length > 0) {
                await db.insert(questions).values(qs);
            }
        }

        await setSessionAsync(cookies, newUser.id);
        throw redirect(302, '/profile');
    }
};