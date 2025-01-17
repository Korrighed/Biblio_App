# The project 

This is a simple app allowing management of books among users. 
They can :
- visualise books
- borrow while connected
- give back books
An admin panel exist as well. 

# Full front
Being a full front project, it depends on indexDB; 

- to create account from the existing data base. 
- to work systematically with the same browser to conserve data.

placeholder userID are as follow for "users":
- aboutin01 
- aboutin02
- aboutin03
- aboutin04

placeholder userID are as follow for "admin":

- admin

## Password reset 

to reset a password: 
- the user must ask for a reset
- the user must disconnect 
- an admin must pick the code from the admin panel
- the admin must disconnect 
- the user must connect once again and fill the corresponding form with the temporary code.  


# Prod
## Basic Vue environnement
This is a basic environnement set for a ve app with bootsrap : 

## Install depencies : 
```sh
npm install
```
Depending of the error messages install required framework.         
Most notably (boostrap)[https://getbootstrap.com/] and (boostrap icon)[https://icons.getbootstrap.com/]

## Add environnements :
add two en vironnement files : 

```.env.development
VITE_BASE=/
```
```.env.production
VITE_BASE=/Name_Of_repo/
```
## Start new repo 
Once pull adapte your the origin url to your repo
```sh
git remote set-url origin git://new.url.here
```

## gh-pages 
To deploy on git hub pages a sub branch of main as gh-pages.        
This sub branch will only serv the dist file. 

+ make assets
```sh
npm run build
```
+ add dist to the git 
```sh
git add dist -f
```
+ commit said dist file 
```sh
git commit -m"Ajout Dist pour prod"
```
To push new version 
```sh
git push origin --delete gh-pages
```
```sh
git subtree push --prefix dist origin gh-pages
```
