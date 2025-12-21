# Quick SSH Key Setup for Git

## Quick Solution

### Step 1: Run the Setup Script (Easiest)

Open PowerShell in this directory and run:

```powershell
.\setup-git-ssh.ps1
```

This will:
- Show all your SSH keys
- Let you select which one to use
- Automatically configure `~/.ssh/config`
- Test the connection

### Step 2: Manual Setup (If Script Doesn't Work)

1. **Identify your GitHub SSH key:**
   - Open PowerShell
   - Run: `Get-ChildItem "$env:USERPROFILE\.ssh" -Filter "*" | Select-Object Name`
   - Note the filename (e.g., `id_rsa`, `github_rsa`, etc.)

2. **Create/edit SSH config:**
   ```powershell
   notepad "$env:USERPROFILE\.ssh\config"
   ```

3. **Add this configuration (replace `id_rsa` with your key filename):**
   ```
   Host github.com
       HostName github.com
       User git
       IdentityFile C:\Users\Albert\.ssh\id_rsa
       IdentitiesOnly yes
   ```

4. **Save and close**

5. **Test the connection:**
   ```powershell
   ssh -T git@github.com
   ```

   You should see: `Hi username! You've successfully authenticated...`

### Step 3: For This Repository Only (Alternative)

If you want to use a specific key only for this project:

```powershell
cd author-platform
git config core.sshCommand "ssh -i C:\Users\Albert\.ssh\your_key_name -F NUL"
```

Replace `your_key_name` with your actual key filename.

## Common Issues

**"Permission denied (publickey)"**
- Make sure the key is added to your GitHub account
- Check that the key path in config is correct
- Try: `ssh-add C:\Users\Albert\.ssh\your_key_name`

**"Too many authentication failures"**
- The `IdentitiesOnly yes` in config should fix this
- Make sure it's in your config file

**Key not found**
- Use full path: `C:\Users\Albert\.ssh\your_key_name`
- Windows uses backslashes in paths

## Verify Your Setup

```powershell
# Test GitHub connection
ssh -T git@github.com

# Check which key is being used
ssh -vT git@github.com
# (Look for "Offering public key: /path/to/key" in the output)
```

