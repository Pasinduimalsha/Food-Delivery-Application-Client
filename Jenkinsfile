pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = "dockerhub-credentials"
        SSH_CREDENTIALS_ID = "dev-server"
        SSH_TARGET = "ubuntu@16.170.174.241"
        REACT_APP_IMAGE = "pasindu12345/react-frontend:latest"
    }

    tools {
        maven 'Maven 3.9.9' // optional, can be removed if frontend doesn't use Maven
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/RMCV-Rajapaksha/The-Home-Services-Booking-System.git'
            }
        }

        stage('Build & Push Frontend Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker build -t $REACT_APP_IMAGE -f frontend/Dockerfile The-Home-Services-Booking-System/frontend
                        docker push $REACT_APP_IMAGE
                        docker logout
                        '''
                    }
                }
            }
        }

        stage('Deploy Frontend Application') {
            steps {
                script {
                    sshagent([SSH_CREDENTIALS_ID]) {
                        sh '''
                        ssh -T -o StrictHostKeyChecking=no $SSH_TARGET <<EOF
                        set -xe
                        docker pull $REACT_APP_IMAGE
                        docker ps -q --filter "name=react-frontend" | grep -q . && docker stop react-frontend || true
                        docker ps -aq --filter "name=react-frontend" | grep -q . && docker rm react-frontend || true
                        docker run -d --restart always --name react-frontend -p 80:80 $REACT_APP_IMAGE
                        docker logout
                        EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        success {
            emailext(
                to: 'sch.chamara@gmail.com',
                subject: "✅ SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: green;">🎉 Build Successful! 🎉</h2>
                        <p>The job <b>${env.JOB_NAME}</b> build <b>#${env.BUILD_NUMBER}</b> completed successfully.</p>
                        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
                            <tr style="background-color: #dff0d8; color: #3c763d;">
                                <th>Detail</th><th>Value</th>
                            </tr>
                            <tr><td><b>Job Name</b></td><td>${env.JOB_NAME}</td></tr>
                            <tr><td><b>Build Number</b></td><td>${env.BUILD_NUMBER}</td></tr>
                            <tr><td><b>Build Status</b></td><td style="color: green;"><b>SUCCESS ✅</b></td></tr>
                            <tr><td><b>Duration</b></td><td>${currentBuild.durationString}</td></tr>
                            <tr><td><b>Build URL</b></td><td><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                        </table>
                        <h4 style="color: #8A2BE2;">🚀 Deployment was successful!</h4>
                        <p>Your application is now running.</p>
                    </body>
                </html>
                """,
                mimeType: 'text/html',
                replyTo: 'sch.chamara@gmail.com',
                from: 'sch.chamara@gmail.com'
            )
        }

        failure {
            emailext(
                to: 'sch.chamara@gmail.com',
                subject: "❌ FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: red;">⚠️ Build Failed! ⚠️</h2>
                        <p>The job <b>${env.JOB_NAME}</b> build <b>#${env.BUILD_NUMBER}</b> has failed.</p>
                        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
                            <tr style="background-color: #f2dede; color: #a94442;">
                                <th>Detail</th><th>Value</th>
                            </tr>
                            <tr><td><b>Job Name</b></td><td>${env.JOB_NAME}</td></tr>
                            <tr><td><b>Build Number</b></td><td>${env.BUILD_NUMBER}</td></tr>
                            <tr><td><b>Build Status</b></td><td style="color: red;"><b>FAILURE ❌</b></td></tr>
                            <tr><td><b>Duration</b></td><td>${currentBuild.durationString}</td></tr>
                            <tr><td><b>Build URL</b></td><td><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></td></tr>
                        </table>
                        <h3 style="color: #FF4500;">🔎 Possible Causes:</h3>
                        <ul>
                            <li>Check the console output for errors.</li>
                            <li>Verify Docker image build and push steps.</li>
                            <li>Confirm SSH connection to the deployment server.</li>
                        </ul>
                        <h4 style="color: #8B0000;">🛠️ Fix it ASAP!</h4>
                        <p>Click the build URL above to investigate further.</p>
                    </body>
                </html>
                """,
                mimeType: 'text/html',
                replyTo: 'sch.chamara@gmail.com',
                from: 'sch.chamara@gmail.com'
            )
        }
    }
}
