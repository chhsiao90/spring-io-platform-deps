rm -rf release
mkdir release
git init release
yarn run build
cp -r static/* release 
git -C release checkout -b gh-pages
git -C release add .
git -C release commit -m "Release"
git -C release remote add origin https://github.com/chhsiao90/spring-io-platform-deps.git
git -C release push origin gh-pages --force
