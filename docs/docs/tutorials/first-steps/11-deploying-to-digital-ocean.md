---
permalink: tutorials/first-steps/deploying-to-digital-ocean
category: First Steps
group: Tutorials
author: Chimezie Enyinnaya
---

# Deploying to Digital Ocean

Now our application is feature complete, let’s deploy it to production. We’ll be deploying to Digital Ocean. Login (or create a new account if you don’t have one already) to your Digital Ocean account and create a new droplet running Ubuntu 18.04.

The rest of this tutorial assumes you have a fully configured droplet running Ubuntu 18.04, you can checkout [setting up a server with Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04) to learn how to do that.

## Installing Node.js

Let’s install Node.js on our server. First, we need to login to our server:

```sh
ssh root@IP_ADDRESS
```

[note]
  It is recommended to carry out tasks on your server as a non-root user with administrative privileges. For the purpose of demonstration, I’ll be using the root user directly. You might need to prefix some of the commands below with `sudo`.
[/note]

Once we are logged in, run the command below:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
```

Then run the snippet below:

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Now, we can install the latest of version of Node.js using the following command:

```sh
nvm install node
```

## Installing Nginx

Nginx will be used as our web server. We’ll use to reverse proxy, which will allow us access our app directly with an IP address or domain instead of tacking port to the IP address.

```sh
apt install nginx
```

Enter `Y` to install. Once installed, we need to open firewall for HTTP requests:

```sh
ufw allow 'Nginx HTTP'
```

## Installing MySQL

Since our application uses MySQL, we need to install it on our server as well:

```sh
apt install mysql-server
```

Next, let’s configuring MySQL:

```sh
mysql_secure_installation
```

Enter a root password when prompted, then answer the necessary options when prompted.

Finally, let’s login to the MySQL server:

```sh
mysql
```

Then execute the following command:

```sh
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

This will allow us use a password when connecting to MySQL as root (in my case). Remember to change `root` and `password` to your database user and password respectively.

Next, create a new database:

```sql
CREATE DATABASE tasks;
```

For the changes to take effect, run:

```sql
FLUSH PRIVILEGES;
```

Then exit the MySQL server:

```sql
exit;
```

## Pulling in our application

With the necessary things installed on our server, let’s pull in our application. have gone ahead to push the code for our application to [GitHub](https://github.com/ammezie/adonis5-tasks.git):

```sh
git clone https://github.com/ammezie/adonis5-tasks.git
```

Once cloned, run the following command:

```sh
cd adonis5-tasks
npm install
```

Next, we need to build our application. That is, compile the TypeScript files:

```sh
node ace build
```

Next, let’s create the `.env` file:

```sh
cp .env.example .env
```

Then generate an `APP_KEY`:

```sh
node ace generate:key
```

This will output a random string, which we’ll copy and add inside the `.env` file. Open `.env`:

```sh
vim .env
```

And paste the following into it:

```markup
// .env

PORT=3333
HOST=127.0.0.1
NODE_ENV=production
APP_KEY=YOUR_GENERATED_KEY_COPIED_FROM_ABOVE
DB_CONNECTION=mysql
DB_HOST=localhost
DB_NAME=tasks
DB_USER=YOUR_DATABASE_USERNAME
DB_PASSWORD=YOUR_DATABASE_PASSWORD
```

Since we have updated the `.env` file, we need to rebuild our application:

```sh
node ace build
```

Now, we can run the migration:

```sh
node ace migration:run --force
```

Because we are on production, we have to use the `--force` flag, otherwise the migration will not run.

## Installing PM2

[PM2](http://pm2.keymetrics.io/) is a process manager which we’ll use to start our application and restart it whenever it crashes.

```sh
npm install pm2 -g
```

With PM2 installed, we can start our application with it:

```sh
pm2 start build/server.js
```

## Setting up Nginx as a reverse proxy server

Like I said earlier, we’ll be using Nginx as a reverse proxy. Let’s open the default server configuration file:

```sh
vim /etc/nginx/sites-available/default
```

and update the `server` block as below:

```nginx
// /etc/nginx/sites-available/default

server_name DOMAIN_NAME_OR_IP_ADDRESS;

location / {
  proxy_pass http://localhost:3333;
  proxy_http_version 1.1;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

Let’s make sure there are no errors in the configuration:

```sh
nginx -t
```

Then we can restart Nginx:

```sh
service nginx restart
```

Now you should be able to access the app with your `IP_ADDRESS` or `DOMAIN_NAME` (if configured).

[https://res.cloudinary.com/adonis-js/image/upload/v1583320024/adonisjs.com/screenshot-104.248.121.241-2020.03.03-14_11_10_vh5bpg.png](https://res.cloudinary.com/adonis-js/image/upload/v1583320024/adonisjs.com/screenshot-104.248.121.241-2020.03.03-14_11_10_vh5bpg.png)
