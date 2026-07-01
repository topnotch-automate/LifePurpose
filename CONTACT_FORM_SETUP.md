# Contact Form Setup

The About page contact form sends messages to **lifewardcoach@yahoo.com** via Yahoo SMTP.

## Vercel environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_PASSWORD` | Yes | Yahoo app password for `lifewardcoach@yahoo.com` |
| `SMTP_USER` | No | Defaults to `lifewardcoach@yahoo.com` |
| `CONTACT_EMAIL` | No | Inbox for submissions (defaults to `lifewardcoach@yahoo.com`) |
| `SMTP_HOST` | No | Defaults to `smtp.mail.yahoo.com` |
| `SMTP_PORT` | No | Defaults to `465` |

## Create a Yahoo app password

1. Sign in to Yahoo Mail with `lifewardcoach@yahoo.com`.
2. Open **Account security** → **Generate app password** (or use Yahoo’s “Sign in with app password” flow).
3. Copy the generated password.
4. In Vercel → **Settings → Environment Variables**, add:
   ```
   SMTP_PASSWORD=your_yahoo_app_password
   ```
5. Redeploy the site.

## Test

1. Open `/about` and submit the contact form.
2. Check the `lifewardcoach@yahoo.com` inbox (and spam folder).
3. Reply to a test message — replies go to the visitor’s email via the message `Reply-To` header.

## Troubleshooting

- **503 error on submit** — `SMTP_PASSWORD` is missing or wrong in Vercel.
- **Message not in inbox** — check spam; confirm the app password is for the same Yahoo account as `SMTP_USER`.
- **Auth errors in logs** — regenerate the Yahoo app password and update Vercel.
