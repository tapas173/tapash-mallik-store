pipeline {
  agent any

  environment {
    DOCKER_USER = 'YOUR_DOCKERHUB_USERNAME'          // <-- change this
    IMAGE_NAME  = "${DOCKER_USER}/tapash-mallik-store"
    IMAGE_TAG   = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install & Test') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG -t $IMAGE_NAME:latest .'
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                         usernameVariable: 'U', passwordVariable: 'P')]) {
          sh 'echo $P | docker login -u $U --password-stdin'
          sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
          sh 'docker push $IMAGE_NAME:latest'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
          sh '''
            kubectl apply -f k8s/namespace.yaml
            sed "s|IMAGE_PLACEHOLDER|$IMAGE_NAME:$IMAGE_TAG|" k8s/deployment.yaml | kubectl apply -f -
            kubectl apply -f k8s/service.yaml
            kubectl -n tapash-store rollout status deployment/tapash-store --timeout=120s
          '''
        }
      }
    }
  }

  post {
    success { echo 'Deployed successfully.' }
    failure { echo 'Pipeline failed - check the stage logs.' }
    always  { sh 'docker logout || true' }
  }
}
