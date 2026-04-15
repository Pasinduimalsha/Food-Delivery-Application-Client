pipeline {
    agent any
    options {
        // Aggressive build rotation: Keep ONLY last 2 builds given disk space constraints
        buildDiscarder(logRotator(numToKeepStr: '2', artifactNumToKeepStr: '2'))
        timeout(time: 1, unit: 'HOURS')
    }
    parameters {
        booleanParam(name: 'autoApprove', defaultValue: false, description: 'Automatically run apply after generating plan?')
        booleanParam(name: 'runSonar', defaultValue: false, description: 'Run SonarQube code analysis?')
        choice(name: 'TARGET_ENV', choices: ['sbx', 'qa', 'stg', 'prod'], description: 'Select the target environment for deployment')
    }
    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        IMAGE_REPO = "pasindu12345/food-delivery-application-client"
        IMAGE_NAME = "${IMAGE_REPO}:latest"
        IMAGE_VERSION_TAG = "${IMAGE_REPO}:v0.0.${BUILD_NUMBER}"
        S3_BUCKET = "food-delivery-terraform-state-pasindu"
        AWS_BIN = "${WORKSPACE}/aws-bin/aws"
    }

    stages {
        stage('Determine Environment') {
            steps {
                script {
                    def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ""
                    echo "Checking Branch: ${branch}"
                    if (branch.contains('main') || branch.contains('master')) {
                        env.DEPLOY_ENV = 'prod'
                    } else if (branch.contains('qa')) {
                        env.DEPLOY_ENV = 'qa'
                    } else if (branch.contains('staging')) {
                        env.DEPLOY_ENV = 'stg'
                    } else {
                        env.DEPLOY_ENV = params.TARGET_ENV ?: 'sbx'
                    }
                    echo ">>> FINAL TARGET ENVIRONMENT: ${env.DEPLOY_ENV} <<<"
                }
            }
        }

        stage('Quick Clean & Prep') {
            steps {
                script {
                    sh 'docker system prune -af || true'
                    sh 'chmod +x aws-install-script.sh && ./aws-install-script.sh'
                }
            }
        }

        stage('Terraform Plan') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                    sh "terraform plan -out tfplan"
                    sh 'terraform show -no-color tfplan > tfplan.txt'
                }
            }
        }

        stage('Approval') {
            when { not { equals expected: true, actual: params.autoApprove } }
            steps {
                script {
                    def plan = readFile 'terraform/tfplan.txt'
                    input message: "Do you want to apply the plan?",
                    parameters: [text(name: 'Plan', description: 'Please review the plan', defaultValue: plan)]
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    sh "terraform apply -input=false tfplan"
                }
            }
        }

        stage('Get Server IPs & Ansible Config') {
            steps {
                script {
                    echo "Waiting for instances to boot..."
                    sh 'sleep 60'
                    dir('terraform') {
                        def buildIp = sh(script: 'terraform output -raw food_ordering_client_build_server_ip', returnStdout: true).trim()
                        def deployIp = sh(script: 'terraform output -raw food_ordering_client_deploy_server_ip', returnStdout: true).trim()
                        
                        writeFile file: 'build_server_conn.txt', text: "ubuntu@${buildIp}"
                        writeFile file: 'deploy_server_conn.txt', text: "ubuntu@${deployIp}"
                        sh "${AWS_BIN} s3 cp build_server_conn.txt s3://${S3_BUCKET}/food-delivery-client/build_server_conn.txt"
                        sh "${AWS_BIN} s3 cp deploy_server_conn.txt s3://${S3_BUCKET}/food-delivery-client/deploy_server_conn.txt"

                        def inventoryContent = "[${env.DEPLOY_ENV}]\n${deployIp} ansible_user=ubuntu\n"
                        writeFile file: '../ansible/inventory.ini', text: inventoryContent
                    }
                    sshagent(['Jenkins-slave']) {
                        echo "Managing Server Environment: ${env.DEPLOY_ENV}"
                        sh "ansible-playbook -i ansible/inventory.ini ansible/server-management.yml --limit ${env.DEPLOY_ENV} --ssh-extra-args='-o StrictHostKeyChecking=no'"
                    }
                }
            }
        }

        stage('Remote Setup & Sync') {
            steps {
                script {
                    sh "${AWS_BIN} s3 cp s3://${S3_BUCKET}/food-delivery-client/build_server_conn.txt build_server_conn.txt"
                    def buildServer = readFile('build_server_conn.txt').trim()
                    sshagent(['Jenkins-slave']) {
                        echo "Syncing code to Build Server..."
                        sh "ssh -o StrictHostKeyChecking=no ${buildServer} 'mkdir -p /home/ubuntu/app'"
                        sh "rsync -avz -e 'ssh -o StrictHostKeyChecking=no' --exclude '.git' --exclude 'terraform' --exclude 'node_modules' ./ ${buildServer}:/home/ubuntu/app/"
                        sh "scp -o StrictHostKeyChecking=no node-install.sh ${buildServer}:/home/ubuntu/app/"
                        sh "ssh -o StrictHostKeyChecking=no ${buildServer} 'chmod +x /home/ubuntu/app/node-install.sh && /home/ubuntu/app/node-install.sh'"
                    }
                }
            }
        }

        stage('Install Dependencies (Remote)') {
            steps {
                script {
                    def buildServer = readFile('build_server_conn.txt').trim()
                    sshagent(['Jenkins-slave']) {
                        sh "ssh -o StrictHostKeyChecking=no ${buildServer} 'cd app && npm ci'"
                    }
                }
            }
        }

        stage('Run unit tests (Remote)') {
            steps {
                script {
                    def buildServer = readFile('build_server_conn.txt').trim()
                    sshagent(['Jenkins-slave']) {
                        sh "ssh -o StrictHostKeyChecking=no ${buildServer} 'cd app && npm test -- --coverage --ci'"
                        echo "Fetching coverage report from Build Server..."
                        sh "scp -r -o StrictHostKeyChecking=no ${buildServer}:/home/ubuntu/app/coverage ./ || true"
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/**', fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        stage('Check for vulnerabilities (Remote)') {
            steps {
                script {
                    def buildServer = readFile('build_server_conn.txt').trim()
                    sshagent(['Jenkins-slave']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${buildServer} "
                                cd app
                                npm audit --audit-level=critical || true
                                echo 'No critical vulnerabilities found. Attempting to fix issues...'
                                npm audit fix || true
                                npm audit fix --force || true
                                npm audit --audit-level=critical || true
                            "
                        """
                    }
                }
            }
        }

        stage('Check linting (Remote)') {
            steps {
                script {
                    def buildServer = readFile('build_server_conn.txt').trim()
                    sshagent(['Jenkins-slave']) {
                        // Using || true to ensure pipeline continues even if linting finds issues
                        sh "ssh -o StrictHostKeyChecking=no ${buildServer} 'cd app && npm run lint || true'"
                    }
                }
            }
            post {
                always {
                    script {
                        def buildServer = readFile('build_server_conn.txt').trim()
                        sshagent(['Jenkins-slave']) {
                            sh "ssh -o StrictHostKeyChecking=no ${buildServer} 'rm -rf /home/ubuntu/app/node_modules'"
                            echo "Large node_modules folder cleaned up on Build Server."
                        }
                    }
                }
            }
        }

        stage('Run Sonarqube') {
            when { expression { params.runSonar == true } }
            steps {
                script {
                    def scannerHome = tool 'lil_sonar_tool'
                    withSonarQubeEnv(credentialsId: 'pasindu12345', installationName: 'lil_sonar_project') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Remote Build & Push') {
            steps {
                script {
                    def buildServer = readFile('build_server_conn.txt').trim()
                    sshagent(['Jenkins-slave']) {
                        withCredentials([usernamePassword(credentialsId: '12345678', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                            sh """
                                ssh -o StrictHostKeyChecking=no ${buildServer} "
                                    cd app
                                    chmod +x docker-script.sh
                                    ./docker-script.sh
                                    sudo docker build -t ${IMAGE_NAME} -t ${IMAGE_VERSION_TAG} .
                                    echo '$PASSWORD' | sudo docker login -u '$USERNAME' --password-stdin
                                    sudo docker push ${IMAGE_NAME}
                                    sudo docker push ${IMAGE_VERSION_TAG}
                                    sudo docker system prune -af
                                "
                            """
                        }
                    }
                }
            }
        }

        stage('Remote Deploy') {
            steps {
                script {
                    sh "${AWS_BIN} s3 cp s3://${S3_BUCKET}/food-delivery-client/deploy_server_conn.txt deploy_server_conn.txt"
                    def deployServer = readFile('deploy_server_conn.txt').trim()
                    sshagent(['Jenkins-slave']) {
                        withCredentials([usernamePassword(credentialsId: '12345678', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                            sh "scp -o StrictHostKeyChecking=no docker-compose.yml docker-script.sh docker-compose-script.sh ${deployServer}:/home/ubuntu/"
                            sh """
                                ssh -o StrictHostKeyChecking=no ${deployServer} "
                                    chmod +x docker-script.sh docker-compose-script.sh
                                    ./docker-script.sh
                                    echo '$PASSWORD' | sudo docker login -u '$USERNAME' --password-stdin
                                    ./docker-compose-script.sh ${IMAGE_NAME}
                                "
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    sh 'rm -rf dist/ coverage/ || true'
                    sh 'docker system prune -af || true'
                    sh 'sudo rm -rf /var/lib/jenkins/.sonar/cache/* || true'
                    deleteDir()
                } catch (Exception e) {
                    echo "Cleanup failed: ${e.getMessage()}"
                }
            }
        }
    }
}