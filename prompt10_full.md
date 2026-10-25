<USER_REQUEST>
# HireConnect — Global Avatar Navigation, Authentication, Registration & Profile Management

Inspect my existing HireConnect project and implement the following changes while preserving the existing design system and functionality.

## 1. Replace Sign In in the Navbar Across All Pages

Remove the visible **Sign In** text/button from the navbar on every page.

Keep all existing navbar items, logo, spacing, background, typography, and animations unchanged.

Replace the Sign In button with a small, circular profile avatar positioned at the far-right corner of the navbar.

Requirements:
- Display the authenticated user's profile photo when available.
- If no photo exists, display the user's initials or a clean default avatar icon.
- If the user is not signed in, display a neutral default avatar.
- Keep the avatar circular, properly sized, and aligned with the existing navbar.
- Make the navbar and avatar responsive across desktop, tablet, and mobile devices.
- Prevent overlapping, wrapping, or horizontal overflow.
- Preserve the existing navbar design and menu behavior.

Apply this shared avatar navigation consistently across all pages.

## 2. Avatar Dropdown Menu

When a user hovers over the avatar on desktop, show a polished dropdown menu with a smooth animation. On mobile and touch devices, open the menu on tap.

For signed-out visitors, display:
- Sign In
- Create Account / Sign Up

For signed-in users, display:
- My Profile
- My Dashboard
- Update Resume, for job seekers
- Company Profile, for recruiters
- Settings
- Sign Out

Show only the options relevant to the user's role.

Additional requirements:
- Close the dropdown when clicking outside it or pressing Escape.
- Support keyboard navigation and accessible focus states.
- Prevent the dropdown from being clipped by the navbar or viewport.
- Use the existing dark theme, typography, rounded corners, and subtle transitions.
- Do not create a separate dropdown implementation for every page; reuse the same shared behavior.

The avatar itself should open the menu rather than navigate directly to an unrelated page.

## 3. Preserve the Existing Sign In Page Animation

**The current Sign In page's animated design must remain the exact visual reference for all authentication pages.**

Preserve the existing animated image collage, floating images, image positions, sizes, movement, transitions, centered text "Not just another job board," dark grid background, typography, and animation timing.

Reuse the existing animation and components rather than recreating a different animation.

Do not remove, simplify, replace, or break the current Sign In page animation.

## 4. Sign In Page

Keep the existing Sign In page design and animation unchanged while ensuring the authentication forms are fully functional.

Provide two distinct login options:

### Job Seeker / Employee Login
- Email address
- Password with show/hide toggle
- Remember me
- Forgot password
- Sign In button
- Continue with Google
- Link to Create Account

### Recruiter / Employer Login
- Work email address
- Password with show/hide toggle
- Remember me
- Forgot password
- Recruiter Sign In button
- Continue with Google
- Link to Create Recruiter Account

Use a polished role selector or segmented control to switch between employee and recruiter login forms without changing the overall design.

Preserve the selected role during authentication and validate that the authenticated account is authorized for that role.

## 5. Sign Up / Create Account Page

Create a dedicated registration experience using the same animated image collage, background, typography, layout style, and motion design as the existing Sign In page.

Provide two separate registration flows.

### Job Seeker Registration
Include:
- Full name
- Email address
- Password and confirm password
- Google sign-up option
- Terms and privacy consent
- Create Account button
- Link to existing account Sign In

After successful registration, allow the candidate to complete their profile and upload a resume.

### Recruiter Registration
Include:
- Full name
- Work email
- Password and confirm password
- Company name
- Job title or recruiter role
- Company website
- Google sign-up option
- Terms and privacy consent
- Create Recruiter Account button
- Link to existing account Sign In

After registration, direct the recruiter through company profile creation and the required company verification process.

Keep the two registration flows visually consistent while clearly identifying the selected account type.

Do not claim that an account or company has been registered until the backend confirms success.

## 6. Profile Pages

Create separate, detailed profile pages for job seekers and recruiters.

### Job Seeker Profile
Include:
- Profile photo upload
- Personal details and professional headline
- Professional summary
- Education and grades
- Skills and technical expertise
- Work experience and internships
- Projects, GitHub links, and live demos
- Certifications and achievements
- Career preferences and preferred locations
- Resume upload, preview, download, replacement, and deletion
- Profile completion indicator
- Profile visibility and recruiter privacy settings

Allow users to edit and save individual sections.

### Recruiter Profile
Include:
- Profile photo
- Name and job title
- Professional contact information
- Company affiliation
- Company profile access
- Recruitment activity
- Job management access
- Candidate discovery access

Only authorized recruiters should be able to manage their associated company.

## 7. Settings Pages

Create role-appropriate settings pages that follow the existing HireConnect design.

Include:
- Profile and account settings
- Change password
- Email verification status
- Notification preferences
- Privacy and visibility controls
- Connected Google account status, where supported
- Session and sign-out controls
- Account deletion request
- Relevant recruiter company permissions

Candidates must be able to control whether recruiters can discover their profiles and access restricted information.

## 8. Google Authentication

Use a proper supported Google authentication flow for both login and registration.

- Support employee and recruiter account types.
- Preserve role selection throughout the flow.
- Associate Google-authenticated users with their existing accounts where appropriate.
- Prevent duplicate accounts when the same verified email is used.
- Enforce role permissions on the backend.
- Handle missing credentials, failed authentication, and cancelled sign-in.
- Document any required Google OAuth configuration.

Do not create a fake Google button that simply redirects users to a dashboard.

## 9. Shared Navigation and Role-Based Routing

Make the avatar dropdown and authentication flows work consistently throughout the website.

- Signed-out users can access Sign In and Sign Up.
- Employees can access their candidate profile, resume, applications, saved jobs, and settings.
- Recruiters can access their recruiter dashboard, company profile, job management, candidate discovery, and settings.
- Sign Out must clear the authenticated session correctly.
- Protected pages must verify authentication and authorization.
- Prevent users from accessing the other role's restricted features by manually changing URLs.

Reuse existing routes where possible and inspect the current project before creating new routes.

## 10. Privacy and Company Verification

- Keep candidate profiles private or undiscoverable until the candidate explicitly enables recruiter visibility.
- Restrict access to resumes and contact details according to candidate permissions.
- Verify company ownership or recruiter authorization before allowing job publication.
- Never display a verified company badge without successful verification.
- Protect authentication credentials and private information.
- Validate uploads and enforce file type and size limits.

## 11. Implementation Restrictions

- Preserve the existing HireConnect visual identity.
- Do not redesign the landing page or unrelated page content.
- Do not remove existing animations or introduce a different authentication animation.
- Reuse the existing animated Sign In experience for Sign Up and related authentication screens.
- Do not introduce Tailwind CSS.
- Avoid unnecessary dependencies and unrelated refactoring.
- Use the existing backend and authentication system if available.
- If backend functionality is missing, clearly identify what requires backend implementation rather than pretending the feature is functional.

## 12. Final Verification

Verify that:
1. The visible Sign In navbar button is removed from every page.
2. The circular avatar appears consistently at the right side of the navbar.
3. The avatar dropdown works on desktop and mobile.
4. Signed-out and signed-in menus show the correct options.
5. Employee and recruiter login forms work independently.
6. Both registration flows work correctly.
7. The original animated image collage remains intact on the Sign In page and is reused on Sign Up.
8. Profile and settings pages work with the correct account role.
9. Google authentication is configured properly or its remaining setup requirements are documented.
10. Candidate privacy and recruiter permissions are enforced.
11. Other page designs and functionality remain unchanged except for the requested shared avatar navigation.

**Final objective:** Replace the navbar Sign In button with a responsive circular account avatar across all pages, provide animated employee and recruiter authentication and registration experiences, and build detailed role-based profile and settings pages using the exact existing Sign In animation and HireConnect design system.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-23T23:06:16+05:30.
</ADDITIONAL_METADATA>