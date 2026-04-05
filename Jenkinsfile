pipeline {
  agent any
  options {
      // Keep only the last 3 builds and artifacts to save Jenkins internal disk space
      buildDiscarder(logRotator(numToKeepStr: '3', artifactNumToKeepStr: '3'))
  }
  tools {
      // Ensure Node.js and NPM are available on the Jenkins agent
      // Go to Manage Jenkins -> Tools -> NodeJS installations to define 'NodeJS_latest'
      nodejs "NodeJS_latest"
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
        sh 'npm audit --parseable --production'
        // sh 'npm outdated || exit 0'
      }
    }

    stage('Check linting') {
      steps {
        sh 'npm run lint'
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

	stage('checkout') {
		steps {
				script{
					dir("terraform")
					{
						git "https://github.com/Pasinduimalsha/Food-Delivery-Application-Client.git"
					}
				}
			}
    }

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
		agent any
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
	stage("Run the docker image using docker-compose"){
		when {
			expression { env.SHOULD_BUILD_IMAGE == 'true' }
		}
		agent any
		steps{
			script{
					unstash 'client_conn_data'
					def DEPLOY_SERVER = readFile('client_server_conn.txt').trim()

				sshagent(['Jenkins-slave']){
					withCredentials([usernamePassword(credentialsId: '12345678', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]){
							echo "Pull the docker image"
							sh "ls -la"
							sh """
								scp -o StrictHostKeyChecking=no \
									docker-script.sh \
									docker-compose-script.sh \
									docker-compose.yml \
									${DEPLOY_SERVER}:/home/ubuntu/
								"""
							sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'bash ~/docker-script.sh'"
							sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} sudo usermod -aG docker ubuntu"
							sh "ssh ${DEPLOY_SERVER} sudo docker login -u $USERNAME -p $PASSWORD"
							sh "ssh ${DEPLOY_SERVER} sudo docker pull ${IMAGE_NAME}"
							sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'bash ~/docker-compose-script.sh ${IMAGE_NAME}'"
							sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'echo ${CURRENT_SOURCE_HASH} > /home/ubuntu/.food_delivery_client_source_hash'"
							// sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'sudo docker-compose up -d ${IMAGE_NAME}'"

					}
				}
			}
		}

}

    // stage('Check unit:e2e') {
    //   steps {
    //     sh 'npm run test:e2e -- --headless --url https://www.example.com --config video=false || exit 0'
    //   }
    // }

  }

//   post {
//     always {
//       node {
//         // 1. Delete the Jenkins Workspace to clear large folders like node_modules and .terraform
//         deleteDir() 
        
//         // 2. Remove dangling Docker build cache and unused image layers
//         script {
//           try {
//               sh 'docker system prune -f'
//           } catch (Exception e) {
//               echo "Docker prune skipped or failed: ${e.getMessage()}"
//           }
//         }
//       }
//     }
//   }
}


// REF:
//  https://github.com/Andre-ADPC/Vite-TS-Vue-React-Prj-Template-2025/blob/master/DOCS/Build%20a%20Jenkins%20Pipeline.md