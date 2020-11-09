---
permalink: guides/deployment
group: Digging Deeper
---

# Deploy Adonis in Production

Let's see how we can deploy and run Adonis in production on a remote server. I will assume that you are using Ubuntu all along with this article to adapt the command for another distribution.

## 1. Initial Server Setup

Skip this step if your server is already set up.

```bash
sudo adduser adonis              # Create a new user
sudo usermod -aG sudo adonis     # Grant administrative privileges
sudo ufw allow OpenSSH           # Make sure that the firewall allows SSH connections
sudo ufw enable                  # Enable the firewall

sudo apt-get update              # Update packages
sudo apt-get install nodejs npm  # Install node and NPM
sudo npm i -g n                  # Install n to manage the node versions
sudo npm i -g pm2                # Install pm2 to manage node processes
sudo n lts                       # Install the latest version of node
```

To access your server with SSH, go back to your local machine and execute the following instructions to display your public key.

```bash
cat ~/.ssh/id_rsa.pub
```

Copy the SSH key printed to the terminal and go back to your remote server.

```bash
# If you are still logged in as root, run the command below:
su - adonis

mkdir ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys       # Copy the public key here
chmod 600 ~/.ssh/authorized_keys  # Restrict the permissions of the authorized_keys file
```

## 2. Clone Your Adonis Repository

To allow the server to access your Adonis project on Github/Gitlab, we need to generate a new SSH key and it to your account.

```bash
# Generate a new ssh key
# Follow the instructions and make sure to remember the name for the newly created key
ssh-keygen -t rsa -b 2048 -C "email@example.com"

# Copy the SSH key
pbcopy < ~/.ssh/id_ed25519.pub           # MacOs
xclip -sel clip < ~/.ssh/id_ed25519.pub  # Linux (requires the xclip package)
cat ~/.ssh/id_ed25519.pub | clip         # Git Bash on Windows
```

Then, add this new SSH Key to Github or Gitlab. Read the article below to learn more about the exact steps.

- [Adding a new SSH key to your GitHub account](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

- [Adding an SSH key to your GitLab account](https://docs.gitlab.com/ee/ssh/README.html#adding-an-ssh-key-to-your-gitlab-account)

You should now be able to clone your repository and install its dependencies.

```bash
git clone git@github.com:username/repository-name.git

git checkout production  # If you need to switch to a specific production branch
npm install              # Install dependencies
```

## 3. Set up Mysql

Here is how you can install MySQL on your server.

```bash
# Add the MySQL software repository
curl -OL https://dev.mysql.com/get/mysql-apt-config_0.8.10-1_all.deb
sudo dpkg -i mysql-apt-config*

sudo apt update       # Refresh your apt package cache to make the new software packages available
rm mysql-apt-config*  # Delete the file we downloaded

sudo apt install mysql-server  # Install MySQL
systemctl status mysql         # Check the MySQL is installed
mysql_secure_installation      # Secure MySQL (Follow the instructions)
mysql -u root -p               # Connect to MySQL
```

Here are the commands to run to create a new user and database for your project.

```mysql
# Create a new MySQL user
CREATE USER 'adonis'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD';

# Replace YOUR_PASSWORD
ALTER USER 'adonis'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YOUR_PASSWORD';

# Create a new database
CREATE DATABASE database_name;

# Grant the new user privileges to the tables on the new database
GRANT ALL ON adonis_tasks.* TO 'adonis'@'localhost';

# For the changes to take effect
FLUSH PRIVILEGES;

# Exit the MySQL server
exit
```

## 4. Build for Production

Go back to your project repository and create a new `.env` file.

```bash
nano .env
```

```bash
npm run build         # Generate the production bundle
cp .env build/.env    # Copy the .env file to the production bundle

pm2 start build/server.js --name API  # Start the Adonis server
```

> You may be wondering why we need to copy the `.env` file to the build folder. In a nutshell, there is no standard way of defining environment variables. One could do it via a `.env` file, via Heroku or AWS management console's or an app specification file for Digital Ocean. Earlier (before the recent release), we used to copy the `.env` file. But this can lead to false-positive behavior too. This means that from now on, you must run `cp .env build/.env` after each build.

Then ping your server with curl to see if everything is behaving correctly.

```bash
curl 127.0.0.1:3333  # Do you get a response?
```

One final step is to run the migrations and seed the database.

```bash
node ace migration:run --force
node ace db:seed --force
```

Regarding `pm2`, here are a few commands you should know to manage your processes.

- `pm2 kill`: stop and remove all processes.
- `pm2 start command --name PROCESS_NAME`: stop the process name
- `pm2 stop PROCESS_NAME`: stop a given process
- `pm2 restart PROCESS_NAME`: restart a given process

## 5. Set up Nginx with SSL.

To allow people to access Adonis from your domain name, we will install Nginx. We will also configure SSL to make sure the connection is secured.

```bash
sudo apt install nginx        # Install Nginx
sudo ufw allow 'Nginx HTTPS'  # Open the port 443 only (TLS/SSL encrypted traffic)
systemctl status nginx        # Check that Nginx is running

sudo add-apt-repository ppa:certbot/certbot        # Add the certbot repository
sudo apt-get install certbot python-certbot-nginx  # Install certbot
sudo ufw disable                                   # Disable the firewall while generating the certificate
sudo certbot --nginx -d api.example.com            # Generate the certificate
sudo ufw enable                                    # Enable the firewall
```

Configure Nginx.

```bash
cd /etc/nginx/sites-available
nano default
```

Here is a possible configuration file to deliver your website with SSL.

```nginx
server {
    server_name api.example.com;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://127.0.0.1:3333;
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = api.example.com) {
        return 301 https://$host$request_uri;
    }

    listen 80 default_server;
    listen [::]:80 default_server;

    server_name api.example.com;
    return 404;
}
```

## 6. Set up Your Continuous Deployment Process with Github Actions

If you are looking to deploy a new version of Adonis while merging on your production branch, here is a GitHub action file that connects to your remove server, run some instructions and notify you on Slack if something fails or succeeds.

> Make sure to configure the [related secret variables](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets): `secrets.HOST`, `secrets.USERNAME`, `secrets.KEY`, `secrets.SLACK_WEBHOOK`.

```yml
name: Deploy

on:
  push:
    branches:
      - production

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Deploying
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            # Copy and build new version

            cp -r my-project-repo my-project-repo-new
            cd my-project-repo-new
            git checkout production
            git fetch --all
            git reset --hard origin/production
            npm install --only=production
            npm run build
            cp .env build/.env

            # Run migrations

            node ace migration:run --force
            node ace db:seed --force

            # Replace current version with the new one

            cd ..
            mv my-project-repo my-project-repo-old
            mv my-project-repo-new my-project-repo

            # Restart server

            cd my-project-repo
            pm2 kill
            pm2 start build/server.js --name API
            rm -rf ../my-project-repo-old

      - name: Slack success notification
        if: job.status == 'success'
        uses: rtCamp/action-slack-notify@master
        env:
          SLACK_CHANNEL: api-scraping
          SLACK_COLOR: good
          SLACK_ICON: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
          SLACK_MESSAGE: 'Deployment achieved with success'
          SLACK_TITLE: CI
          SLACK_USERNAME: GitHub
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}

      - name: Slack error notification
        if: job.status == 'failure'
        uses: rtCamp/action-slack-notify@master
        env:
          SLACK_CHANNEL: api-scraping
          SLACK_COLOR: danger
          SLACK_ICON: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
          SLACK_MESSAGE: 'The deployment has failed @channel'
          SLACK_TITLE: CI
          SLACK_USERNAME: GitHub
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```
