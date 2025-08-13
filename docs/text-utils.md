# Test Utilities

## Generate LINE idToken for local/test mode
This command generates a fake LINE idToken for testing LIFF login APIs without calling LINE's real API.

### Prerequisites
- `.env.test` contains:
  - `TEST_IDTOKEN_HS256_SECRET`
  - `LINE_LOGIN_CHANNEL_ID`

### Command
```bash
dotenv -e .env.test -- node -e '
const jwt=require("jsonwebtoken");
const secret=process.env.TEST_IDTOKEN_HS256_SECRET;
const aud=process.env.LINE_LOGIN_CHANNEL_ID;
const now=Math.floor(Date.now()/1000);
const token=jwt.sign(
  { sub:"U_dev_sub", iss:"https://access.line.me", aud, iat:now, exp:now+600 },
  secret,
  { algorithm:"HS256" }
);
console.log(token);
'