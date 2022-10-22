# Creating a new deployment target

A deployment target is something like dev, staging, test, prod, etc

Current:

Prod: anveio
Staging: anvieo-staging

To add a new environment, say the environment "example":

1. fly apps create anveio-example
2. Create a new personal access token: https://web.fly.io/user/personal_access_tokens/new
3. Run `fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app anveio-example`
4. Create a database for the environment by running
   a. fly postgres create --name anveio-example-db
   b. fly postgres attach --app anveio-example anveio-example-db
