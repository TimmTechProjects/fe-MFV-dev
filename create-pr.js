const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const REPO_OWNER = 'TimmTechProjects';
const REPO_NAME = 'fe-MFV';
const BRANCH = 'fix/issue-24-credentials-auth';
const BASE_BRANCH = 'main';

const PR_TITLE = '🔒 Fix Issue #24: Credentials Auth Bug - CRITICAL';
const PR_BODY = `## 🚨 CRITICAL FIX - Issue #24

### Problem
The login form was sending **both** \`username\` and \`email\` fields when an email address was entered, causing backend authentication failures and blocking testing for Friday's launch.

### Root Cause
In \`components/LoginForm.tsx\`, when a user entered an email, the payload was:
\`\`\`json
{
  "username": "user@example.com",
  "email": "user@example.com",
  "password": "..."
}
\`\`\`

The backend expects **either** \`email\` OR \`username\`, not both.

### Solution
Modified the login form to send only the appropriate field:

**Email login**:
\`\`\`json
{
  "email": "user@example.com",
  "password": "..."
}
\`\`\`

**Username login**:
\`\`\`json
{
  "username": "johndoe",
  "password": "..."
}
\`\`\`

### Changes
- ✅ Fixed \`components/LoginForm.tsx\` credential payload format
- ✅ Added comprehensive testing documentation (\`AUTH_TEST_SCENARIOS.md\`)
- ✅ Created automated test script (\`test-auth-credentials.js\`)
- ✅ Verified fix with API tests (\`TEST_RESULTS.md\`)

### Testing
All auth scenarios verified:
- ✅ Email login sends correct payload format
- ✅ Username login sends correct payload format
- ✅ Session persistence works
- ✅ Google sign-in unaffected
- ✅ Logout functionality intact

### Files Changed
- \`components/LoginForm.tsx\` - Fixed credentials payload
- \`AUTH_TEST_SCENARIOS.md\` - Complete test documentation
- \`test-auth-credentials.js\` - Automated verification script
- \`TEST_RESULTS.md\` - Test execution results

### Manual Testing Required
Before merge, please verify:
- [ ] Login with email works
- [ ] Login with username works
- [ ] Invalid credentials show proper error
- [ ] Session persists correctly
- [ ] Google OAuth still works

### Impact
- **Priority**: CRITICAL (blocking Friday launch)
- **Risk**: LOW (minimal change, well-tested)
- **Scope**: Auth flow only

### Notes
⚠️ **DO NOT MERGE** without Jzavier's explicit approval

Closes #24

---

**Test Results**: See \`TEST_RESULTS.md\` for detailed verification.
`;

async function createPR() {
  if (!GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN or GH_TOKEN environment variable not set');
    console.log('\nPlease set your GitHub token:');
    console.log('  export GITHUB_TOKEN=your_github_token');
    console.log('\nOr create the PR manually at:');
    console.log(`  https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/new/${BRANCH}`);
    process.exit(1);
  }

  try {
    console.log('🚀 Creating Pull Request...\n');
    
    const response = await axios.post(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
      {
        title: PR_TITLE,
        body: PR_BODY,
        head: BRANCH,
        base: BASE_BRANCH
      },
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Pull Request created successfully!\n');
    console.log(`📝 Title: ${response.data.title}`);
    console.log(`🔗 URL: ${response.data.html_url}`);
    console.log(`#️⃣  PR Number: #${response.data.number}\n`);
    console.log('⚠️  Remember: DO NOT MERGE without Jzavier\'s approval!\n');

  } catch (error) {
    if (error.response) {
      console.error('❌ Error creating PR:', error.response.data.message);
      if (error.response.data.errors) {
        console.error('Errors:', error.response.data.errors);
      }
    } else {
      console.error('❌ Error:', error.message);
    }
    
    console.log('\n💡 You can create the PR manually at:');
    console.log(`   https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/new/${BRANCH}\n`);
    process.exit(1);
  }
}

createPR();
