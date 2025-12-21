# SSH Key Configuration for Git

## Problem
Multiple SSH keys in `.ssh` folder, but need to use only one for Git authentication.

## Solutions

### Option 1: Use SSH Config File (Recommended)

Create or edit `~/.ssh/config` (Windows: `C:\Users\YourUsername\.ssh\config`):

```
# Default GitHub key (the one you want to use)
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes

# Alternative: Use a specific named key
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/your_github_key
    IdentitiesOnly yes
```

**Replace `id_rsa` or `your_github_key` with your actual key filename.**

The `IdentitiesOnly yes` ensures only the specified key is used.

### Option 2: Use Git Config for This Repository Only

In your repository, set the SSH command to use a specific key:

```bash
git config core.sshCommand "ssh -i ~/.ssh/your_github_key -F /dev/null"
```

**Windows PowerShell:**
```powershell
git config core.sshCommand "ssh -i C:\Users\YourUsername\.ssh\your_github_key -F NUL"
```

**To Reverse/Remove Option 2:**

If you've set `core.sshCommand` and want to remove it:

```bash
git config --local --unset core.sshCommand
```

**Windows PowerShell:**
```powershell
git config --local --unset core.sshCommand
```

This will remove the repository-specific SSH command and Git will use the SSH config file (Option 1) or system defaults instead.

### Option 3: Set SSH_AGENT Environment Variable

Add to your shell profile (`.bashrc`, `.zshrc`, or PowerShell profile):

```bash
export GIT_SSH_COMMAND="ssh -i ~/.ssh/your_github_key -F /dev/null"
```

**Windows PowerShell:**
```powershell
$env:GIT_SSH_COMMAND = "ssh -i C:\Users\YourUsername\.ssh\your_github_key -F NUL"
```

### Option 4: Use SSH Agent (if you use multiple keys)

1. Start SSH agent:
   ```bash
   eval "$(ssh-agent -s)"
   ```

2. Add your specific key:
   ```bash
   ssh-add ~/.ssh/your_github_key
   ```

3. Verify it's added:
   ```bash
   ssh-add -l
   ```

## Testing Your Configuration

Test SSH connection to GitHub:

```bash
ssh -T git@github.com
```

If configured correctly, you should see:
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

## Quick Setup (Recommended Steps)

1. **Identify your GitHub SSH key:**
   - Usually named `id_rsa`, `id_ed25519`, or `github_rsa`
   - Check in `~/.ssh/` directory

2. **Create/Edit SSH config:**
   ```bash
   # Windows (PowerShell)
   notepad $env:USERPROFILE\.ssh\config
   
   # Linux/Mac
   nano ~/.ssh/config
   ```

3. **Add configuration:**
   ```
   Host github.com
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_rsa  # Change to your key filename
       IdentitiesOnly yes
   ```

4. **Set correct permissions (Linux/Mac):**
   ```bash
   chmod 600 ~/.ssh/config
   chmod 600 ~/.ssh/id_rsa
   ```

5. **Test connection:**
   ```bash
   ssh -T git@github.com
   ```

## For This Repository

If you want to use a specific key only for this repository, use Option 2 above in the `author-platform` directory.

