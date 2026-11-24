# Tapash Mallik Store

E-commerce web app (Node.js + Express) with Docker, Jenkins CI/CD and Kubernetes.
Contact: Tapash Mallik, Nagpur, Maharashtra, India | 9765539332 | tmallik789@gmail.com

## Run locally (VS Code terminal)
    npm install
    npm test
    npm start          # http://localhost:3000

## Docker
    docker build -t tapash-mallik-store:local .
    docker run -d -p 3000:3000 --name store tapash-mallik-store:local

## Kubernetes (manual)
    kubectl apply -f k8s/namespace.yaml
    sed "s|IMAGE_PLACEHOLDER|YOUR_DOCKERHUB_USERNAME/tapash-mallik-store:latest|" k8s/deployment.yaml | kubectl apply -f -
    kubectl apply -f k8s/service.yaml
    # open http://<node-ip>:30080   (minikube: minikube service tapash-store-svc -n tapash-store)

## Jenkins
Edit DOCKER_USER in Jenkinsfile. Create credentials: `dockerhub-creds` (username/password)
and `kubeconfig-file` (secret file). Create a Pipeline job from SCM pointing to your GitHub repo.
