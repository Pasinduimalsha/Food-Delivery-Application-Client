pipeline {
  agent any
  options {
      // Very aggressive build rotation: Keep ONLY last 2 builds given 6GB disk space
      buildDiscarder(logRotator(numToKeepStr: '2', artifactNumToKeepStr: '2'))
  }
  tools {
      nodejs "NodeJS_latest"
    //   terraform "Terraform_latest"
  }
   parameters {
        booleanParam(name: 'autoApprove', defaultValue: false, description: 'Automatically run apply after generating plan?')
        booleanParam(name: 'runSonar', defaultValue: false, description: 'Run SonarQube code analysis?')
    }
  environment {
	IMAGE_REPO = "pasindu12345/food-delivery-application-client"
	IMAGE_NAME = "${IMAGE_REPO}:latest"
	IMAGE_VERSION_TAG = "${IMAGE_REPO}:v0.0.${BUILD_NUMBER}"
	}

  stages {
	 stage('Quick Clean') {
      steps {
		// Report disk status before cleaning
		sh 'df -h'
		// Aggressively clear ALL unused Docker images and build cache, not just dangling ones
		sh 'docker system prune -af || true'
		// Report disk status after cleaning
		sh 'df -h'
      }
    }
	 stage('Install Dependencies') {
      steps {
		sh 'node -v'
		sh 'npm -v'
		sh 'npm ci'
      }
    }

	stage('Run unit tests (coverage)') {
		steps {
				sh 'npm test -- --coverage --ci'
		}
		post {
			always {
			archiveArtifacts artifacts: 'coverage/**', fingerprint: true
			}
		}
	}

	stage('Run Sonarqube') {
            when {
                expression { params.runSonar == true }
            }
            environment {
                scannerHome = tool 'lil_sonar_tool';
            }
            steps {
              withSonarQubeEnv(credentialsId: 'pasindu12345', installationName: 'lil_sonar_project') {
                sh "${scannerHome}/bin/sonar-scanner"
              }
            }
	}

    stage('Check for vulnerabilities') {
      steps {
        script {
            sh 'npm audit --audit-level=critical'
            echo "No critical vulnerabilities found. Attempting to fix high/moderate issues..."
            sh 'npm audit fix || true'
            sh 'npm audit fix --force || true'
            sh 'npm audit --audit-level=critical || true'
        }
      }
    }

    stage('Check linting') {
      steps {
        sh 'npm run lint'
      }
      post {
        always {
            // Delete Node Modules IMMEDIATELY after linting to free up 1.3 GB
            sh 'rm -rf node_modules'
            echo "Large node_modules folder cleaned up to prepare for Docker build."
        }
      }
    }

    // stage('Check unit:test') {
    //   steps {
    //     sh 'npm run test:unit -- --ci --coverage'
    //   }
    //   post {
    //     always {
    //       junit 'junit.xml'
    //       cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
    //     }
    //   }
    // }

	//        Dockerfile is already doing this
	//     stage('Build') {
	//       steps {
	//     	sh 'npm run build'
	//       }
	//     }

	// stage('checkout') {
	// 	steps {
	// 		script {
	// 			// Checkout the full repository into the workspace root
	// 			git "https://github.com/Pasinduimalsha/Food-Delivery-Application-Client.git"
	// 		}
	// 	}
    // }

	stage('Plan') {
		steps {
			withCredentials([
				string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
				string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
			]) {
				sh 'pwd;cd terraform/ ; terraform init'
				sh "pwd;cd terraform/ ; terraform plan -out=tfplan"
				sh 'pwd;cd terraform/ ; terraform show -no-color tfplan > tfplan.txt'

				// stash name: 'tfplan-artifact', , includes: '**'
			}
		}
	}
	stage('Approval') {
		when {
			not {
				equals expected: true, actual: params.autoApprove
			}
		}
		steps {
			script {
				// unstash 'tfplan-artifact'
				def plan = readFile 'terraform/tfplan.txt'
				input message: "Do you want to apply the plan?",
				parameters: [text(name: 'Plan', description: 'Please review the plan', defaultValue: plan)]
			}
		}
	}
	stage('Apply') {
		steps {
			withCredentials([
				string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
				string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
			]) {
				// unstash 'tfplan-artifact'
				sh "pwd;cd terraform/ ; terraform apply -input=false tfplan"
				sh "pwd;cd terraform/ ; terraform output -raw food_ordering_client_deploy_server_ip"
			}
		}
	}
	stage('Get Server IPs') {
		steps {
			script {
				withCredentials([
					string(credentialsId: 'AWS_ACCESS_KEY_ID', variable: 'AWS_ACCESS_KEY_ID'),
					string(credentialsId: 'AWS_SECRET_ACCESS_KEY', variable: 'AWS_SECRET_ACCESS_KEY')
				]) {
					def clientServerIp = sh(
						script: 'cd terraform/ ; terraform output -raw food_ordering_client_deploy_server_ip',
						returnStdout: true
					).trim()
					echo "Client Server IP: ${clientServerIp}"
					def clientServerConn = "ubuntu@${clientServerIp}"
					echo "Build Server SSH Connection String: ${clientServerConn}"

					writeFile file: 'client_server_conn.txt', text: clientServerConn
					stash name: 'client_conn_data', includes: 'client_server_conn.txt'
				}
			}
		}
	}

	stage('Detect App Changes') {
		steps {
			script {
				unstash 'client_conn_data'
				def DEPLOY_SERVER = readFile('client_server_conn.txt').trim()

				def currentSourceHash = sh(
					script: '''#!/usr/bin/env bash
					set -euo pipefail
					FILES=$(git ls-files Dockerfile docker-compose.yml package.json package-lock.json vite.config.js src public index.html 2>/dev/null || true)
					if [ -z "$FILES" ]; then
					echo "NO_FILES"
					exit 0
					fi
					(
					for file in $FILES; do
						if [ -f "$file" ]; then
						printf "%s\n" "$file"
						shasum -a 256 "$file"
						fi
					done
					) | shasum -a 256 | awk '{print $1}'
					''',
					returnStdout: true
				).trim()

				def previousSourceHash = ''
				sshagent(['Jenkins-slave']) {
					previousSourceHash = sh(
						script: "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'cat /home/ubuntu/.food_delivery_client_source_hash 2>/dev/null || true'",
						returnStdout: true
					).trim()
				}

				echo "Current source hash: ${currentSourceHash}"
				echo "Previous source hash: ${previousSourceHash ?: 'NONE'}"

				if (currentSourceHash && currentSourceHash != 'NO_FILES' && currentSourceHash != previousSourceHash) {
					env.SHOULD_BUILD_IMAGE = 'true'
					env.CURRENT_SOURCE_HASH = currentSourceHash
					echo 'App changes detected. Image build/push will run.'
				} else {
					env.SHOULD_BUILD_IMAGE = 'false'
					env.CURRENT_SOURCE_HASH = previousSourceHash
					echo 'No app changes detected. Skipping image build/push and compose rollout.'
				}
			}
		}
	}

	stage("Build the docker image and push to dockerhub"){
		when {
			expression { env.SHOULD_BUILD_IMAGE == 'true' }
		}
		steps {
			script {
				withCredentials([usernamePassword(credentialsId: '12345678', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
					echo "Packing the code and creating docker images"
					sh "ls -la"
					sh "docker build -t ${IMAGE_VERSION_TAG} -t ${IMAGE_NAME} ."
					sh 'echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin'
					sh "docker push ${IMAGE_VERSION_TAG}"
					sh "docker push ${IMAGE_NAME}"
				}
			}
		}
	}
    stage("Run the docker image using docker-compose") {
        when {
            expression { env.SHOULD_BUILD_IMAGE == 'true' }
        }
        steps {
            script {
                unstash 'client_conn_data'
                // Parse the IP from 'ubuntu@IP'
                def DEPLOY_SERVER_CONN = readFile('client_server_conn.txt').trim()
                def DEPLOY_SERVER_IP = DEPLOY_SERVER_CONN.split('@')[1]

                sshagent(['Jenkins-slave']) {
                    withCredentials([usernamePassword(credentialsId: '12345678', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
                        echo "Deploying to ${DEPLOY_SERVER_IP} using Ansible"
                        
                        // 1. Install necessary collections locally on Jenkins
                        sh "ansible-galaxy collection install -r ansible/requirements.yml"

                        // 2. Run the deployment playbook
                        sh """
                            ansible-playbook -i '${DEPLOY_SERVER_IP},' \
                                -u ubuntu \
                                --ssh-common-args='-o StrictHostKeyChecking=no' \
                                -e "image_name=${IMAGE_NAME} docker_user=${USERNAME} docker_password=${PASSWORD}" \
                                ansible/playbook.yml
                        """
                        
                        // Update the success hash on the server using an Ansible ad-hoc command to stay consistent
                        sh """
                            ansible all -i '${DEPLOY_SERVER_IP},' \
                                -u ubuntu \
                                --ssh-common-args='-o StrictHostKeyChecking=no' \
                                -m shell -a "echo ${CURRENT_SOURCE_HASH} > /home/ubuntu/.food_delivery_client_source_hash"
                        """
                    }
                }
            }
        }
    }
  }

    // stage('Check unit:e2e') {

  post {
    always {
      script {
        try {
            // 1. Instantly delete the images we built (already pushed)
            sh "docker rmi ${IMAGE_VERSION_TAG} ${IMAGE_NAME} || true"
            // 2. Clear build layers
            sh "docker image prune -af || true"
            // 3. Clear all leftover Docker resources (including unused images)
            sh 'docker system prune -af || true'
            // 4. Clear SonarQube scanner cache
            sh 'sudo rm -rf /var/lib/jenkins/.sonar/cache/* || true'
            // 5. Purge disabled/old Snaps and clear snap seed
            sh '''
                snap list --all | awk '/disabled/{print $1, $3}' | while read snapname revision; do sudo snap remove "$snapname" --revision "$revision"; done || true
                sudo rm -rf /var/lib/snapd/seed/snaps/* || true
            '''
            // 6. Report disk status
            sh 'df -h'
            // 7. Delete the bulky workspace (node_modules, etc.)
            deleteDir()
        } catch (Exception e) {
            echo "Cleanup skipped or failed: ${e.getMessage()}"
        }
      }
      echo "Aggressive storage cleanup: Docker images and Workspace cleared."
    }
  }
}

// REF:
//  https://github.com/Andre-ADPC/Vite-TS-Vue-React-Prj-Template-2025/blob/master/DOCS/Build%20a%20Jenkins%20Pipeline.md