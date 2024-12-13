# Basic Vue environnement
This is a basic environnement set for a ve app with bootsrap : 

# Install depencies : 

```sh
npm install
```
Depending of the error messages install required framework.         
Most notably (boostrap)[https://getbootstrap.com/] and (boostrap icon)[https://icons.getbootstrap.com/]

# Add environnements :
add two en vironnement files : 

```.env.development
VITE_BASE=/
```
```.env.production
VITE_BASE=/Name_Of_repo/
```
# gh-pages 
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
